(function () {
  const D = window.KATIE_DATA;

  const qs = (sel, root) => (root || document).querySelector(sel);
  const qsa = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function fmt(tpl, vars) {
    return tpl.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : ""));
  }

  function won(n) {
    return Math.round(n).toLocaleString("ko-KR") + "원";
  }

  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem("katie." + key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem("katie." + key, JSON.stringify(value));
      } catch (e) {}
    },
  };

  function saveIdea(text) {
    const ideas = store.get("savedIdeas", []);
    ideas.unshift({ text, ts: Date.now() });
    store.set("savedIdeas", ideas.slice(0, 200));
    renderDashboard();
  }

  // ---------- Tabs ----------
  function switchTab(tab) {
    qsa("nav.tabs button").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
    qsa("section.panel").forEach((p) => p.classList.toggle("active", p.id === tab));
    if (tab === "dashboard") renderDashboard();
  }

  qsa("nav.tabs button").forEach((b) => b.addEventListener("click", () => switchTab(b.dataset.tab)));

  // ---------- Dashboard ----------
  function renderDashboard() {
    const checklist = store.get("checklist", D.checklistDefaults.map((t) => ({ text: t, done: false })));
    const doneCount = checklist.filter((c) => c.done).length;
    const pct = checklist.length ? Math.round((doneCount / checklist.length) * 100) : 0;
    const ideas = store.get("savedIdeas", []);
    const candidates = store.get("scorecard", []);
    const topCandidate = candidates.slice().sort((a, b) => scoreOf(b) - scoreOf(a))[0];

    const dayIndex = Math.floor(Date.now() / 86400000) % D.quotes.length;
    const todayQuote = D.quotes[dayIndex];

    qs("#dashboard").innerHTML = `
      <div class="card">
        <h2>오늘의 요약</h2>
        <p class="desc">아이디어 발굴 → 영감 → 전략 수립 → 시뮬레이션 → 실행 체크리스트, 5단계를 순환하며 사업을 구체화하세요.</p>
        <div class="grid-3">
          <div class="stat"><div class="num">${pct}%</div><div class="label">체크리스트 진행률</div></div>
          <div class="stat"><div class="num">${ideas.length}</div><div class="label">저장한 아이디어</div></div>
          <div class="stat"><div class="num">${topCandidate ? escapeHtml(topCandidate.name) : "-"}</div><div class="label">최고 점수 아이템 후보</div></div>
        </div>
      </div>
      <div class="card">
        <h2>오늘의 영감</h2>
        <div class="quote-box">
          <div class="qtext">"${escapeHtml(todayQuote.text)}"</div>
          <div class="qauthor">${escapeHtml(todayQuote.author)} · ${escapeHtml(todayQuote.org)}<span class="qcat">${escapeHtml(todayQuote.category)}</span></div>
        </div>
        <button class="btn secondary small" id="dash-go-inspiration">영감 탭 더 보기</button>
      </div>
      <div class="card">
        <h2>빠른 이동</h2>
        <div class="chip-row">
          <button class="chip" data-goto="idealab">아이디어 발굴</button>
          <button class="chip" data-goto="strategy">전략 수립</button>
          <button class="chip" data-goto="simulator">시뮬레이션</button>
          <button class="chip" data-goto="checklist">체크리스트</button>
        </div>
      </div>
    `;
    qs("#dash-go-inspiration").addEventListener("click", () => switchTab("inspiration"));
    qsa("#dashboard .chip[data-goto]").forEach((c) => c.addEventListener("click", () => switchTab(c.dataset.goto)));
  }

  // ---------- Idea Lab ----------
  let selectedBooks = [];

  function renderIdeaLab() {
    qs("#idealab").innerHTML = `
      <div class="card">
        <h2>1. 북믹싱 조합기</h2>
        <p class="desc">서로 다른 카테고리의 책 5권을 고르면, 각 책의 핵심 원리를 교차 결합해 새로운 사업 아이디어 발상 질문을 생성합니다. (최대 5권 선택)</p>
        <div class="book-list" id="book-list"></div>
        <div style="margin-top:12px; display:flex; gap:8px;">
          <button class="btn" id="bookmix-generate">조합 아이디어 생성</button>
          <button class="btn secondary" id="bookmix-example">예시로 보기</button>
          <button class="btn secondary" id="bookmix-clear">선택 초기화</button>
        </div>
        <div id="bookmix-results" style="margin-top:14px;"></div>
      </div>

      <div class="card">
        <h2>2. 기존 아이템 개선기 (SCAMPER)</h2>
        <p class="desc">이미 있는 상품/서비스 이름을 입력하면 7가지 개선 관점의 질문을 생성합니다.</p>
        <div class="field">
          <label>개선하고 싶은 아이템/서비스</label>
          <input type="text" id="scamper-item" placeholder="예: 동네 세탁소, 배달 앱, 필라테스 스튜디오..." />
        </div>
        <button class="btn" id="scamper-generate">개선 질문 생성</button>
        <div class="result-item" style="margin-top:12px;">
          <strong>예시: ${escapeHtml(D.scamperExample.item)}</strong><br/>
          <span style="color:var(--text-dim)">${escapeHtml(D.scamperExample.notes)}</span>
        </div>
        <div id="scamper-results" style="margin-top:12px;"></div>
      </div>

      <div class="card">
        <h2>3. 리뷰/후기 페인포인트 마이너</h2>
        <p class="desc">고객 리뷰·후기를 붙여넣으면 불만 문장을 추출해 카테고리별로 분류하고, 개선 아이디어를 제안합니다.</p>
        <div class="field">
          <textarea id="painpoint-input" placeholder="리뷰/후기를 한 줄씩 붙여넣으세요"></textarea>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn" id="painpoint-analyze">분석하기</button>
          <button class="btn secondary" id="painpoint-demo">데모 리뷰 채우기</button>
        </div>
        <div id="painpoint-results" style="margin-top:14px;"></div>
      </div>
    `;

    renderBookList();
    qs("#bookmix-generate").addEventListener("click", () => generateBookMix(selectedBooks));
    qs("#bookmix-example").addEventListener("click", pickExampleBooks);
    qs("#bookmix-clear").addEventListener("click", () => { selectedBooks = []; renderBookList(); qs("#bookmix-results").innerHTML = ""; });
    qs("#scamper-generate").addEventListener("click", generateScamper);
    qs("#painpoint-analyze").addEventListener("click", analyzePainpoints);
    qs("#painpoint-demo").addEventListener("click", () => { qs("#painpoint-input").value = D.demoReviews; });
  }

  function bookKey(b) { return b.category + "::" + b.title; }

  function renderBookList() {
    const container = qs("#book-list");
    let html = "";
    Object.entries(D.bookCategories).forEach(([cat, books]) => {
      html += `<div class="book-cat-title">${escapeHtml(cat)}</div>`;
      books.forEach((b) => {
        const key = cat + "::" + b.title;
        const checked = selectedBooks.some((s) => s.key === key);
        const disabled = !checked && selectedBooks.length >= 5;
        html += `
          <label class="book-item">
            <input type="checkbox" data-key="${escapeHtml(key)}" data-cat="${escapeHtml(cat)}" data-title="${escapeHtml(b.title)}" data-principle="${escapeHtml(b.principle)}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} />
            <span>
              <div class="b-title">${escapeHtml(b.title)} <span style="color:var(--text-dim); font-weight:400;">(${escapeHtml(cat)})</span></div>
              <div class="b-principle">${escapeHtml(b.principle)}</div>
            </span>
          </label>`;
      });
    });
    container.innerHTML = html;
    qsa('#book-list input[type=checkbox]').forEach((cb) => {
      cb.addEventListener("change", () => {
        const key = cb.dataset.key;
        if (cb.checked) {
          selectedBooks.push({ key, category: cb.dataset.cat, title: cb.dataset.title, principle: cb.dataset.principle });
        } else {
          selectedBooks = selectedBooks.filter((s) => s.key !== key);
        }
        renderBookList();
      });
    });
  }

  function pickExampleBooks() {
    selectedBooks = [];
    const cats = Object.keys(D.bookCategories).slice(0, 5);
    cats.forEach((cat) => {
      const b = D.bookCategories[cat][0];
      selectedBooks.push({ key: cat + "::" + b.title, category: cat, title: b.title, principle: b.principle });
    });
    renderBookList();
    generateBookMix(selectedBooks);
  }

  function generateBookMix(books) {
    const out = qs("#bookmix-results");
    if (books.length < 2) {
      out.innerHTML = `<p class="desc">서로 다른 카테고리에서 2권 이상 선택해주세요.</p>`;
      return;
    }
    const pairs = [];
    for (let i = 0; i < books.length; i++) {
      for (let j = i + 1; j < books.length; j++) pairs.push([books[i], books[j]]);
    }
    let html = "";
    pairs.forEach((pair, idx) => {
      const [a, b] = pair;
      const pattern = D.combinatorPatterns[idx % D.combinatorPatterns.length];
      const prompt = fmt(pattern, { A: a.title, B: b.title, pA: a.principle, pB: b.principle });
      html += `
        <div class="result-item">
          <div>${escapeHtml(prompt)}</div>
          <button class="btn secondary small" data-save="${escapeHtml(prompt)}" style="margin-top:8px;">아이디어로 저장</button>
        </div>`;
    });
    out.innerHTML = html;
    qsa("#bookmix-results [data-save]").forEach((btn) =>
      btn.addEventListener("click", () => saveIdea(btn.dataset.save))
    );
  }

  function generateScamper() {
    const item = qs("#scamper-item").value.trim();
    const out = qs("#scamper-results");
    if (!item) {
      out.innerHTML = `<p class="desc">아이템 이름을 먼저 입력해주세요.</p>`;
      return;
    }
    let html = "";
    D.scamper.forEach((s) => {
      const q = fmt(s.question, { item });
      html += `
        <div class="result-item">
          <strong>${escapeHtml(s.key)}</strong>
          <div style="margin:6px 0;">${escapeHtml(q)}</div>
          <button class="btn secondary small" data-save="${escapeHtml(s.key + ": " + q)}">아이디어로 저장</button>
        </div>`;
    });
    out.innerHTML = html;
    qsa("#scamper-results [data-save]").forEach((btn) =>
      btn.addEventListener("click", () => saveIdea(btn.dataset.save))
    );
  }

  function analyzePainpoints() {
    const text = qs("#painpoint-input").value.trim();
    const out = qs("#painpoint-results");
    if (!text) {
      out.innerHTML = `<p class="desc">분석할 리뷰 텍스트를 입력해주세요.</p>`;
      return;
    }
    const sentences = text.split(/\n+|(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
    const counts = {};
    D.painpointDict.forEach((d) => (counts[d.category] = 0));
    counts["기타"] = 0;
    const flagged = [];

    sentences.forEach((s) => {
      const lower = s.toLowerCase();
      const isComplaint =
        D.painpointGeneralSignals.some((sig) => s.includes(sig)) ||
        D.painpointDict.some((d) => d.keywords.some((k) => lower.includes(k.toLowerCase())));
      if (!isComplaint) return;
      let matched = null;
      for (const d of D.painpointDict) {
        if (d.keywords.some((k) => lower.includes(k.toLowerCase()))) {
          matched = d;
          break;
        }
      }
      const cat = matched ? matched.category : "기타";
      counts[cat] = (counts[cat] || 0) + 1;
      flagged.push({ sentence: s, category: cat });
    });

    const sortedCats = Object.entries(counts).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);

    if (sortedCats.length === 0) {
      out.innerHTML = `<p class="desc">뚜렷한 불만 문장을 찾지 못했습니다. 리뷰 내용을 조금 더 구체적으로 붙여넣어보세요.</p>`;
      return;
    }

    let html = `<h3>불만 카테고리 분포</h3>`;
    sortedCats.forEach(([cat, n], idx) => {
      const dict = D.painpointDict.find((d) => d.category === cat);
      const actions = dict ? dict.actions : "직접 인터뷰로 구체적 원인을 파악해보세요";
      html += `
        <div class="candidate-row ${idx === 0 ? "top" : ""}">
          <span>${escapeHtml(cat)} (${n}건)</span>
          <span class="score">${idx === 0 ? "최우선 개선 포인트" : ""}</span>
        </div>
        <div class="result-item">개선 방향 제안: ${escapeHtml(actions)}
          <br/><button class="btn secondary small" data-save="${escapeHtml(cat + " 개선: " + actions)}" style="margin-top:8px;">아이디어로 저장</button>
        </div>`;
    });

    html += `<h3>추출된 불만 문장</h3>`;
    flagged.forEach((f) => {
      html += `<div class="result-item"><span class="qcat" style="margin-left:0; margin-right:8px;">${escapeHtml(f.category)}</span>${escapeHtml(f.sentence)}</div>`;
    });

    out.innerHTML = html;
    qsa("#painpoint-results [data-save]").forEach((btn) =>
      btn.addEventListener("click", () => saveIdea(btn.dataset.save))
    );
  }

  // ---------- Inspiration ----------
  let activeQuoteCat = "전체";

  function renderInspiration() {
    qs("#inspiration").innerHTML = `
      <div class="card">
        <h2>사업가 명언 갤러리</h2>
        <p class="desc">카테고리를 눌러 필터링하거나, 랜덤 명언 버튼으로 영감을 얻어보세요.</p>
        <div class="chip-row" id="quote-cats"></div>
        <button class="btn secondary small" id="quote-random" style="margin-bottom:12px;">랜덤 명언 뽑기</button>
        <div id="quote-list"></div>
      </div>
      <div class="card">
        <h2>영감 사례: 서로 다른 것을 섞어 만든 사업들</h2>
        <p class="desc">아래 사례들은 "북믹싱 조합기"가 만드는 질문이 실제로 어떤 결과로 이어질 수 있는지 보여주는 참고 예시입니다.</p>
        <div id="case-list"></div>
        <button class="btn" id="go-idealab">나도 조합해보기 →</button>
      </div>
    `;

    const catRow = qs("#quote-cats");
    catRow.innerHTML = D.quoteCategories
      .map((c) => `<button class="chip ${c === activeQuoteCat ? "active" : ""}" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`)
      .join("");
    qsa("#quote-cats .chip").forEach((c) =>
      c.addEventListener("click", () => {
        activeQuoteCat = c.dataset.cat;
        renderInspiration();
      })
    );

    renderQuoteList();
    qs("#quote-random").addEventListener("click", () => {
      const list = D.quotes;
      const q = list[Math.floor(Math.random() * list.length)];
      qs("#quote-list").innerHTML =
        `<div class="quote-box"><div class="qtext">"${escapeHtml(q.text)}"</div><div class="qauthor">${escapeHtml(q.author)} · ${escapeHtml(q.org)}<span class="qcat">${escapeHtml(q.category)}</span></div></div>` +
        qs("#quote-list").innerHTML;
    });

    const caseList = qs("#case-list");
    caseList.innerHTML = D.caseStudies
      .map(
        (c) => `
      <div class="case-card">
        <div class="c-name">${escapeHtml(c.name)}</div>
        <div class="c-mix">${escapeHtml(c.mixA)} × ${escapeHtml(c.mixB)}</div>
        <div class="c-result">→ ${escapeHtml(c.result)}</div>
      </div>`
      )
      .join("");
    qs("#go-idealab").addEventListener("click", () => switchTab("idealab"));
  }

  function renderQuoteList() {
    const list = activeQuoteCat === "전체" ? D.quotes : D.quotes.filter((q) => q.category === activeQuoteCat);
    qs("#quote-list").innerHTML = list
      .map(
        (q) => `
      <div class="quote-box">
        <div class="qtext">"${escapeHtml(q.text)}"</div>
        <div class="qauthor">${escapeHtml(q.author)} · ${escapeHtml(q.org)}<span class="qcat">${escapeHtml(q.category)}</span></div>
      </div>`
      )
      .join("");
  }

  // ---------- Strategy ----------
  function scoreOf(c) {
    return (c.repeat || 0) + (c.automation || 0) + (c.niche || 0) + (c.scale || 0);
  }

  function renderStrategy() {
    qs("#strategy").innerHTML = `
      <div class="card">
        <h2>역행자 7단계 로드맵</h2>
        <p class="desc">자의식 해체부터 부의 확장까지, 사업가 전략 수립의 큰 흐름입니다. 전체 원문은 저장소의
        <code>역행자-사업가-전략수립.md</code> 파일을 참고하세요.</p>
        <div class="timeline" id="roadmap-timeline"></div>
      </div>
      <div class="card">
        <h2>아이템 4대 기준 스코어카드</h2>
        <p class="desc">후보 아이템을 반복성 · 자동화 가능성 · 경쟁강도(니치) · 확장성 4가지 기준(각 1~5점)으로 채점하고 비교하세요.</p>
        <div class="grid-2">
          <div class="field"><label>아이템 이름</label><input type="text" id="sc-name" placeholder="예: 반려동물 구독박스" /></div>
        </div>
        <div class="grid-2" id="sc-sliders"></div>
        <button class="btn" id="sc-add">후보 추가</button>
        <h3>후보 비교</h3>
        <div id="sc-list"></div>
      </div>
    `;

    qs("#roadmap-timeline").innerHTML = D.roadmapStages
      .map((s) => `<div class="t-item"><h4>${escapeHtml(s.stage)}</h4><p>${escapeHtml(s.summary)}</p></div>`)
      .join("");

    const sliders = qs("#sc-sliders");
    sliders.innerHTML = D.scorecardCriteria
      .map(
        (c) => `
      <div class="field">
        <label>${escapeHtml(c.label)}: <span id="val-${c.key}">3</span>점</label>
        <input type="range" min="1" max="5" value="3" id="sc-${c.key}" />
      </div>`
      )
      .join("");
    D.scorecardCriteria.forEach((c) => {
      qs("#sc-" + c.key).addEventListener("input", (e) => {
        qs("#val-" + c.key).textContent = e.target.value;
      });
    });

    qs("#sc-add").addEventListener("click", () => {
      const name = qs("#sc-name").value.trim();
      if (!name) return;
      const candidate = { name };
      D.scorecardCriteria.forEach((c) => (candidate[c.key] = parseInt(qs("#sc-" + c.key).value, 10)));
      const list = store.get("scorecard", []);
      list.push(candidate);
      store.set("scorecard", list);
      qs("#sc-name").value = "";
      renderScorecardList();
    });

    renderScorecardList();
  }

  function renderScorecardList() {
    const list = store.get("scorecard", []);
    const sorted = list.slice().sort((a, b) => scoreOf(b) - scoreOf(a));
    const maxScore = sorted.length ? scoreOf(sorted[0]) : 0;
    qs("#sc-list").innerHTML =
      sorted
        .map((c, idx) => {
          const total = scoreOf(c);
          return `
        <div class="candidate-row ${total === maxScore && idx === 0 ? "top" : ""}">
          <span>${escapeHtml(c.name)}</span>
          <span class="score">${total} / 20</span>
          <button class="btn secondary small" data-remove="${escapeHtml(c.name)}">삭제</button>
        </div>`;
        })
        .join("") || `<p class="desc">아직 후보가 없습니다.</p>`;
    qsa("#sc-list [data-remove]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const remaining = store.get("scorecard", []).filter((c) => c.name !== btn.dataset.remove);
        store.set("scorecard", remaining);
        renderScorecardList();
      })
    );
  }

  // ---------- Simulator ----------
  function renderSimulator() {
    const saved = store.get("sim", {
      capital: 20000000,
      firstRevenue: 5000000,
      growth: 8,
      fixedCost: 3000000,
      variablePct: 40,
      months: 12,
    });
    qs("#simulator").innerHTML = `
      <div class="card">
        <h2>재무 시뮬레이터</h2>
        <p class="desc">초기 자본과 매출 가정을 입력하면 월별 현금흐름과 손익분기점(BEP)을 계산합니다.</p>
        <div class="grid-3">
          <div class="field"><label>초기 자본(원)</label><input type="number" id="sim-capital" value="${saved.capital}" /></div>
          <div class="field"><label>첫 달 매출(원)</label><input type="number" id="sim-firstRevenue" value="${saved.firstRevenue}" /></div>
          <div class="field"><label>월 매출 성장률(%)</label><input type="number" id="sim-growth" value="${saved.growth}" /></div>
          <div class="field"><label>월 고정비(원)</label><input type="number" id="sim-fixedCost" value="${saved.fixedCost}" /></div>
          <div class="field"><label>변동비율(매출대비 %)</label><input type="number" id="sim-variablePct" value="${saved.variablePct}" /></div>
          <div class="field"><label>시뮬레이션 기간(개월)</label><input type="number" id="sim-months" value="${saved.months}" min="3" max="36" /></div>
        </div>
        <button class="btn" id="sim-run">시뮬레이션 실행</button>
        <div id="sim-summary" style="margin-top:14px;"></div>
        <div id="sim-chart"></div>
        <div id="sim-table"></div>
      </div>
    `;
    qs("#sim-run").addEventListener("click", runSimulator);
    runSimulator();
  }

  function runSimulator() {
    const capital = parseFloat(qs("#sim-capital").value) || 0;
    const firstRevenue = parseFloat(qs("#sim-firstRevenue").value) || 0;
    const growth = (parseFloat(qs("#sim-growth").value) || 0) / 100;
    const fixedCost = parseFloat(qs("#sim-fixedCost").value) || 0;
    const variablePct = (parseFloat(qs("#sim-variablePct").value) || 0) / 100;
    const months = Math.max(3, Math.min(36, parseInt(qs("#sim-months").value, 10) || 12));

    store.set("sim", {
      capital, firstRevenue, growth: growth * 100, fixedCost, variablePct: variablePct * 100, months,
    });

    let cash = capital;
    let bepMonth = null;
    const rows = [];
    for (let m = 1; m <= months; m++) {
      const revenue = firstRevenue * Math.pow(1 + growth, m - 1);
      const variableCost = revenue * variablePct;
      const profit = revenue - variableCost - fixedCost;
      cash += profit;
      if (bepMonth === null && profit > 0) bepMonth = m;
      rows.push({ m, revenue, variableCost, fixedCost, profit, cash });
    }

    qs("#sim-summary").innerHTML = `
      <div class="grid-3">
        <div class="stat"><div class="num">${bepMonth ? bepMonth + "개월" : "미도달"}</div><div class="label">월 손익분기점(BEP)</div></div>
        <div class="stat"><div class="num">${won(rows[rows.length - 1].cash)}</div><div class="label">${months}개월 후 예상 현금</div></div>
        <div class="stat"><div class="num">${won(rows[rows.length - 1].revenue)}</div><div class="label">${months}개월차 월매출</div></div>
      </div>`;

    const maxAbs = Math.max(...rows.map((r) => Math.abs(r.cash)), 1);
    qs("#sim-chart").innerHTML = `<div class="bar-chart">${rows
      .map((r) => {
        const h = Math.max(2, Math.round((Math.abs(r.cash) / maxAbs) * 150));
        return `<div class="bar ${r.cash < 0 ? "neg" : ""}" style="height:${h}px" title="${r.m}개월차: ${won(r.cash)}"></div>`;
      })
      .join("")}</div>`;

    qs("#sim-table").innerHTML = `
      <table class="sim-table">
        <thead><tr><th>월</th><th>매출</th><th>변동비</th><th>고정비</th><th>월손익</th><th>누적현금</th></tr></thead>
        <tbody>
          ${rows
            .map(
              (r) => `<tr class="${r.m === bepMonth ? "bep" : ""}">
                <td>${r.m}개월차${r.m === bepMonth ? " (BEP)" : ""}</td>
                <td>${won(r.revenue)}</td>
                <td>${won(r.variableCost)}</td>
                <td>${won(r.fixedCost)}</td>
                <td>${won(r.profit)}</td>
                <td>${won(r.cash)}</td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>`;
  }

  // ---------- Checklist ----------
  function renderChecklist() {
    const list = store.get("checklist", D.checklistDefaults.map((t) => ({ text: t, done: false })));
    qs("#checklist").innerHTML = `
      <div class="card">
        <h2>실행 체크리스트</h2>
        <p class="desc">역행자 로드맵 기반 기본 체크리스트입니다. 항목을 추가하거나 완료 표시를 해보세요.</p>
        <div class="progress-bar"><div class="fill" id="cl-fill" style="width:0%"></div></div>
        <div id="cl-items"></div>
        <div style="display:flex; gap:8px; margin-top:10px;">
          <input type="text" id="cl-new" placeholder="새 체크리스트 항목 입력" />
          <button class="btn" id="cl-add">추가</button>
        </div>
      </div>
    `;
    store.set("checklist", list);
    renderChecklistItems();
    qs("#cl-add").addEventListener("click", () => {
      const val = qs("#cl-new").value.trim();
      if (!val) return;
      const cur = store.get("checklist", []);
      cur.push({ text: val, done: false });
      store.set("checklist", cur);
      qs("#cl-new").value = "";
      renderChecklistItems();
    });
  }

  function renderChecklistItems() {
    const list = store.get("checklist", []);
    const done = list.filter((c) => c.done).length;
    const pct = list.length ? Math.round((done / list.length) * 100) : 0;
    qs("#cl-fill").style.width = pct + "%";
    qs("#cl-items").innerHTML = list
      .map(
        (c, i) => `
      <div class="checklist-item ${c.done ? "done" : ""}">
        <input type="checkbox" data-idx="${i}" ${c.done ? "checked" : ""} />
        <span class="txt">${escapeHtml(c.text)}</span>
        <button class="remove" data-remove="${i}">삭제</button>
      </div>`
      )
      .join("");
    qsa("#cl-items input[type=checkbox]").forEach((cb) =>
      cb.addEventListener("change", () => {
        const cur = store.get("checklist", []);
        cur[parseInt(cb.dataset.idx, 10)].done = cb.checked;
        store.set("checklist", cur);
        renderChecklistItems();
      })
    );
    qsa("#cl-items [data-remove]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const cur = store.get("checklist", []);
        cur.splice(parseInt(btn.dataset.remove, 10), 1);
        store.set("checklist", cur);
        renderChecklistItems();
      })
    );
  }

  // ---------- Init ----------
  renderDashboard();
  renderIdeaLab();
  renderInspiration();
  renderStrategy();
  renderSimulator();
  renderChecklist();
})();
