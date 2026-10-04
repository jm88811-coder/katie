// Shared helpers for the MINO film. Loaded by the host page before any composition.
(function () {
  const FPS = 60;
  const LIME = "#C8FF00";
  const PAPER = "#F4F4F0";
  const PATH_A = "M46 8 A42 42 0 0 0 46 92 Z";
  const PATH_B = "M54 8 H86 A6 6 0 0 1 92 14 V86 A6 6 0 0 1 86 92 H54 Z";

  // Small single-SVG symbol for UI chrome (app headers, sidebars).
  function symbolSVG(cls) {
    return (
      '<svg class="' + (cls || "") + '" viewBox="0 0 100 100" aria-hidden="true">' +
      '<path d="' + PATH_A + '" fill="' + LIME + '"/>' +
      '<path d="' + PATH_B + '" fill="' + PAPER + '"/></svg>'
    );
  }

  // Hero symbol: two separately movable pieces (lime half-disc + paper half-square).
  function symbolHTML(id) {
    return (
      '<div class="sym"' + (id ? ' id="' + id + '"' : "") + ">" +
      '<div class="sym-a"' + (id ? ' id="' + id + '-a"' : "") + '><svg viewBox="0 0 100 100"><path d="' + PATH_A + '" fill="' + LIME + '"/></svg></div>' +
      '<div class="sym-b"' + (id ? ' id="' + id + '-b"' : "") + '><svg viewBox="0 0 100 100"><path d="' + PATH_B + '" fill="' + PAPER + '"/></svg></div>' +
      "</div>"
    );
  }

  // Full lockup: symbol + MINO wordmark + AI badge. Ids are prefixed per scene.
  function logoHTML(p) {
    return (
      '<div class="logo" id="' + p + '-logo">' +
      '<div class="logo-sym">' + symbolHTML(p + "-sym") + "</div>" +
      '<div class="logo-word" id="' + p + '-word">' +
      '<span id="' + p + '-l0">M</span><span id="' + p + '-l1">I</span><span id="' + p + '-l2">N</span><span id="' + p + '-l3">O</span>' +
      '<b class="logo-ai" id="' + p + '-ai">AI</b></div></div>'
    );
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  // MM:SS:FF at 60fps.
  function timecode(t) {
    const f = Math.max(0, Math.round(t * FPS));
    return pad(Math.floor(f / FPS / 60)) + ":" + pad(Math.floor(f / FPS) % 60) + ":" + pad(f % FPS);
  }

  // Deterministic PRNG (mulberry32).
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function show(tl, el, from, to) {
    tl.set(el, { visibility: "visible" }, from);
    if (to != null) tl.set(el, { visibility: "hidden" }, to);
  }

  /**
   * Per-scene background + HUD, driven by one proxy tween (seek-safe).
   * wrap holds .sbg (.grid, .glow) and .hud (.tc, .s1, .s2, .br).
   * opts: { start, end, scenes: [[globalTime, n], ...], status: [a, b], glow: [[x,y],[x,y]] }
   */
  function chrome(tl, wrap, W, H, opts) {
    const grid = wrap.querySelector(".grid");
    const glow = wrap.querySelector(".glow");
    const tc = wrap.querySelector(".tc");
    const br = wrap.querySelector(".br");
    wrap.querySelector(".s1").textContent = opts.status[0];
    wrap.querySelector(".s2").textContent = opts.status[1];
    const proxy = { t: opts.start };
    const paint = () => {
      const t = proxy.t;
      if (glow) {
        const g = opts.glow;
        const k = 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 10);
        const x = (g[0][0] + (g[1][0] - g[0][0]) * k) * W;
        const y = (g[0][1] + (g[1][1] - g[0][1]) * k) * H;
        glow.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      }
      const d = (t * 6) % 80;
      grid.style.backgroundPosition = d.toFixed(2) + "px " + d.toFixed(2) + "px";
      tc.textContent = "MINO · " + timecode(t);
      let n = opts.scenes[0][1];
      for (const s of opts.scenes) if (t >= s[0] - 1e-6) n = s[1];
      br.textContent = pad(n) + " / 10";
    };
    paint();
    tl.to(proxy, { t: opts.end, duration: opts.end - opts.start, ease: "none", onUpdate: paint }, opts.start);
  }

  /**
   * Background flip: a lime band sweeps left -> right in 0.25s and the incoming
   * scene wrapper is revealed behind its trailing edge. No fade.
   */
  function wipeIn(tl, host, wrap, at, W) {
    const bw = W * 0.42;
    const band = document.createElement("div");
    band.className = "wipe-band";
    band.style.width = bw + "px";
    host.appendChild(band);
    const p = { x: -bw - 160 };
    const paint = () => {
      band.style.visibility = p.x > -bw - 160 && p.x < W + 159 ? "visible" : "hidden";
      band.style.transform = "translateX(" + p.x.toFixed(1) + "px)";
      const right = Math.min(W, Math.max(0, W - p.x));
      wrap.style.clipPath = "inset(0 " + right.toFixed(1) + "px 0 0)";
    };
    tl.set(wrap, { clipPath: "inset(0 " + W + "px 0 0)" }, at);
    tl.to(p, { x: W + 160, duration: 0.25, ease: "power1.inOut", onUpdate: paint }, at);
  }

  /** Opens the incoming wrapper outward from a horizontal centre line. */
  function lineOpen(tl, host, wrap, at, H) {
    const top = document.createElement("div");
    const bot = document.createElement("div");
    top.className = bot.className = "open-line";
    host.appendChild(top);
    host.appendChild(bot);
    const p = { o: 0 };
    const paint = () => {
      const half = (H / 2) * (1 - p.o);
      wrap.style.clipPath = "inset(" + half.toFixed(1) + "px 0 " + half.toFixed(1) + "px 0)";
      const y = H / 2 - (H / 2) * p.o;
      top.style.transform = "translateY(" + (y - 1).toFixed(1) + "px)";
      bot.style.transform = "translateY(" + (H - y - 1).toFixed(1) + "px)";
      const vis = p.o > 0 && p.o < 1 ? "visible" : "hidden";
      top.style.visibility = bot.style.visibility = vis;
      top.style.opacity = bot.style.opacity = String(1 - p.o * 0.6);
    };
    tl.set(wrap, { clipPath: "inset(" + H / 2 + "px 0 " + H / 2 + "px 0)" }, at);
    tl.to(p, { o: 1, duration: 0.3, ease: "power3.inOut", onUpdate: paint }, at);
  }

  /** Odometer: each digit column rolls; higher columns roll only on carry. */
  function odometer(tl, el, to, at, dur, ease) {
    const digits = String(to).length;
    el.innerHTML = "";
    el.classList.add("odo");
    el.setAttribute("data-layout-allow-overflow", "");
    const cols = [];
    for (let k = digits - 1; k >= 0; k--) {
      const col = document.createElement("span");
      col.className = "odo-col";
      const strip = document.createElement("span");
      strip.className = "odo-strip";
      const steps = Math.floor(to / Math.pow(10, k));
      for (let i = 0; i <= steps; i++) {
        const s = document.createElement("span");
        s.textContent = k > 0 && i === 0 ? " " : String(i % 10);
        strip.appendChild(s);
      }
      col.appendChild(strip);
      el.appendChild(col);
      cols.push({ k, strip });
    }
    const p = { v: 0 };
    const paint = () => {
      for (const c of cols) {
        const unit = Math.pow(10, c.k);
        const pos = c.k === 0 ? p.v : Math.floor(p.v / unit) + Math.max(0, (p.v % unit) - (unit - 1));
        c.strip.style.transform = "translateY(" + (-pos).toFixed(4) + "em)";
      }
    };
    paint();
    tl.to(p, { v: to, duration: dur, ease: ease || "power3.out", onUpdate: paint }, at);
  }

  // Types text one character at a time (a Hangul syllable is one character).
  function type(tl, el, text, at, cps) {
    const chars = Array.from(text);
    const step = 1 / (cps || 22);
    tl.set(el, { textContent: "" }, at);
    for (let i = 1; i <= chars.length; i++) {
      tl.set(el, { textContent: chars.slice(0, i).join("") }, at + i * step);
    }
    return at + chars.length * step;
  }

  /**
   * Samples points that sit on the ink of a text element (or the hero symbol),
   * in coordinates relative to `origin`. Deterministic: canvas raster + seeded pick.
   */
  function inkPoints(el, origin, count, seed) {
    const r = el.getBoundingClientRect();
    const o = origin.getBoundingClientRect();
    const w = Math.ceil(r.width);
    const h = Math.ceil(r.height);
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#fff";
    if (el.classList.contains("sym")) {
      const s = w / 100;
      ctx.scale(s, s);
      ctx.fill(new Path2D(PATH_A));
      ctx.fill(new Path2D(PATH_B));
    } else {
      const cs = getComputedStyle(el);
      ctx.font = cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
      ctx.textBaseline = "alphabetic";
      const m = ctx.measureText(el.textContent);
      const y = h / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
      ctx.fillText(el.textContent, 0, y);
    }
    const data = ctx.getImageData(0, 0, w, h).data;
    const pts = [];
    const step = 4;
    for (let y = 0; y < h; y += step)
      for (let x = 0; x < w; x += step) if (data[(y * w + x) * 4 + 3] > 140) pts.push([x, y]);
    const rand = rng(seed);
    const out = [];
    for (let i = 0; i < count && pts.length; i++) {
      const p = pts[Math.floor(rand() * pts.length)];
      out.push({ x: r.left - o.left + p[0], y: r.top - o.top + p[1], u: p[0] / w, rand });
    }
    return out;
  }

  /**
   * Scenes that start later are not laid out at build time (their slot is hidden),
   * so layout is measured on an invisible copy of the scene placed at the origin.
   */
  function measure(compId, fn) {
    // Clone the whole slot: it carries data-composition-id, which the runtime uses
    // to scope the scene's CSS, so the copy is styled exactly like the real thing.
    const slot = document.querySelector('[data-composition-id="' + compId + '"]');
    const copy = slot.cloneNode(true);
    copy.removeAttribute("id");
    copy.style.cssText = "position:absolute;left:0;top:0;width:1920px;height:1080px;display:block;visibility:hidden;pointer-events:none;overflow:hidden;z-index:-1";
    document.body.appendChild(copy);
    try {
      return fn(copy);
    } finally {
      copy.remove();
    }
  }

  function fontsReady() {
    return Promise.all([
      document.fonts.load('400 20px "Pretendard"'),
      document.fonts.load('800 20px "Pretendard"'),
      document.fonts.load('500 20px "JetBrains Mono"'),
    ]).then(() => document.fonts.ready);
  }

  window.MinoKit = {
    measure, fontsReady,
    FPS, LIME, PAPER, symbolSVG, symbolHTML, logoHTML, timecode, rng, show, chrome, wipeIn, lineOpen, odometer, type, inkPoints,
  };
})();
