// Shared helpers for the MINO film. Loaded by every host page before its compositions.
(function () {
  const FPS = 60;

  // Brand symbol: a lime half-disc and a paper half-square that meet in the middle.
  function symbolSVG(cls) {
    return (
      '<svg class="' + (cls || "") + '" viewBox="0 0 100 100" aria-hidden="true">' +
      '<path class="sym-a" d="M46 8 A42 42 0 0 0 46 92 Z" fill="#C8FF00"/>' +
      '<path class="sym-b" d="M54 8 H86 A6 6 0 0 1 92 14 V86 A6 6 0 0 1 86 92 H54 Z" fill="#F4F4F0"/>' +
      "</svg>"
    );
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  // Timecode as MM:SS:FF at 60fps, offset by where this scene sits in the film.
  function timecode(t) {
    const f = Math.max(0, Math.round(t * FPS));
    const ff = f % FPS;
    const s = Math.floor(f / FPS) % 60;
    const m = Math.floor(f / FPS / 60);
    return pad(m) + ":" + pad(s) + ":" + pad(ff);
  }

  /**
   * Background grid + drifting lime light + HUD, driven by one proxy tween so
   * every value is a pure function of time (seek-safe).
   * opts: { offset, duration, scene, status: [a, b], glow: [[x0,y0],[x1,y1]] }
   * glow points are fractions of the canvas; the light eases between them on a
   * 10s sine cycle.
   */
  function chrome(tl, root, opts) {
    const W = Number(root.dataset.width);
    const H = Number(root.dataset.height);
    const bg = root.querySelector("#chrome-bg");
    const grid = bg.querySelector(".grid");
    const glow = bg.querySelector(".glow");
    const tc = root.querySelector("#chrome-hud .tc");
    root.querySelector("#chrome-hud .s1").textContent = opts.status[0];
    root.querySelector("#chrome-hud .s2").textContent = opts.status[1];
    root.querySelector("#chrome-hud .br").textContent = pad(opts.scene) + " / 10";

    const proxy = { t: 0 };
    const paint = () => {
      const t = proxy.t;
      const g = opts.glow;
      const k = 0.5 - 0.5 * Math.cos((2 * Math.PI * (t + opts.offset)) / 10);
      const x = (g[0][0] + (g[1][0] - g[0][0]) * k) * W;
      const y = (g[0][1] + (g[1][1] - g[0][1]) * k) * H;
      glow.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      const d = ((t + opts.offset) * 6) % 80;
      grid.style.backgroundPosition = d.toFixed(2) + "px " + d.toFixed(2) + "px";
      tc.textContent = "MINO · " + timecode(t + opts.offset);
    };
    paint();
    tl.to(proxy, { t: opts.duration, duration: opts.duration, ease: "none", onUpdate: paint }, 0);
  }

  /**
   * Odometer counter: each digit is a column that rolls; higher columns only
   * roll while the column below passes 9 -> 0. Leading zeros stay blank.
   */
  function odometer(tl, el, to, at, dur, ease) {
    const digits = String(to).length;
    const lh = 1; // em
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
        let pos;
        if (c.k === 0) pos = p.v;
        else {
          const whole = Math.floor(p.v / unit);
          const carry = Math.max(0, (p.v % unit) - (unit - 1));
          pos = whole + carry;
        }
        c.strip.style.transform = "translateY(" + (-pos * lh).toFixed(4) + "em)";
      }
    };
    paint();
    tl.to(p, { v: to, duration: dur, ease: ease || "power3.out", onUpdate: paint }, at);
  }

  // Types text one character at a time (Hangul syllables count as one).
  function type(tl, el, text, at, cps) {
    const chars = Array.from(text);
    const step = 1 / (cps || 22);
    tl.set(el, { textContent: "" }, at);
    for (let i = 1; i <= chars.length; i++) {
      tl.set(el, { textContent: chars.slice(0, i).join("") }, at + i * step);
    }
    return at + chars.length * step;
  }

  const BG = {
    ink: "#0a0a0a",
    paper:
      "radial-gradient(ellipse 75% 70% at 50% 45%, #fbf9fc 0%, #f5f0f6 55%, #e6dde9 100%)",
    lime:
      "radial-gradient(ellipse 90% 80% at 30% 25%, #d6ff3a 0%, #c8ff00 45%, #a6dc00 100%)",
  };

  /**
   * Background flip: a lime band sweeps left -> right in 0.25s and the next
   * background is revealed behind its trailing edge. No fade.
   */
  function wipe(tl, host, at, nextBg, z) {
    const W = Number(host.dataset.width);
    const next = document.createElement("div");
    next.className = "wipe-next";
    next.style.cssText =
      "position:absolute;inset:0;background:" + nextBg + ";z-index:" + (z || 40) + ";clip-path:inset(0 100% 0 0)";
    const band = document.createElement("div");
    band.className = "wipe-band";
    band.style.cssText =
      "position:absolute;top:0;bottom:0;left:0;width:" + W * 0.45 + "px;z-index:" + ((z || 40) + 1) +
      ";background:linear-gradient(90deg,#b8f000,#c8ff00 40%,#dcff4d);box-shadow:0 0 60px rgba(200,255,0,.6);visibility:hidden";
    host.appendChild(next);
    host.appendChild(band);
    const p = { x: -W * 0.45 - 160 };
    const paint = () => {
      band.style.visibility = p.x > -W * 0.45 - 160 ? "visible" : "hidden";
      band.style.transform = "translateX(" + p.x.toFixed(1) + "px)";
      const right = Math.max(0, W - Math.max(0, p.x));
      next.style.clipPath = "inset(0 " + right.toFixed(1) + "px 0 0)";
    };
    tl.to(p, { x: W, duration: 0.25, ease: "power1.inOut", onUpdate: paint }, at);
    return next;
  }

  window.MinoKit = { FPS, BG, symbolSVG, chrome, odometer, type, timecode, wipe };
})();
