import {
  ANIMALS, ELEMENTS, ELEMENT_COLOR_NAMES, ELEMENT_DIRECTIONS, BRANCH_ELEMENT, stemElement,
  analyze, buildChart, pillarsOfDate, pillarName, tenGod, branchTenGod,
  type Analysis, type Element, type Pillar, type SajuChart, type TenGod,
} from "./core";

// ───────── 결정적 난수 (같은 사람·같은 날 → 같은 결과) ─────────
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
const clamp = (n: number, lo = 40, hi = 99) => Math.max(lo, Math.min(hi, Math.round(n)));

// ───────── 지지 관계 ─────────
const SIX_HAP: [number, number][] = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];
const SAM_HAP = [[8, 0, 4], [11, 3, 7], [2, 6, 10], [5, 9, 1]];
export const isChung = (a: number, b: number) => (a + 6) % 12 === b;
export const isYukHap = (a: number, b: number) => SIX_HAP.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
export const isSamHap = (a: number, b: number) => a !== b && SAM_HAP.some((g) => g.includes(a) && g.includes(b));
const STEM_HAP: [number, number][] = [[0, 5], [1, 6], [2, 7], [3, 8], [4, 9]];
export const isStemHap = (a: number, b: number) => STEM_HAP.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

// ───────── 오늘의 운세 ─────────
export interface DailyFortune {
  dateLabel: string;
  dayPillar: Pillar;
  god: TenGod;
  total: number;
  categories: { key: string; label: string; score: number; text: string }[];
  lucky: { color: string; number: number; direction: string; time: string };
  relation: string | null;
  advice: string;
}

const GOD_DAILY: Record<TenGod, { tone: number; advice: string }> = {
  비견: { tone: 0, advice: "나와 같은 기운의 날입니다. 동료와 협력하되 고집과 경쟁심은 한 걸음 물러서세요." },
  겁재: { tone: -6, advice: "지출과 경쟁이 늘 수 있는 날입니다. 충동 결제와 보증·동업 이야기는 미루세요." },
  식신: { tone: 8, advice: "표현력과 여유가 살아나는 날입니다. 맛있는 식사, 창작, 새로운 시도에 좋습니다." },
  상관: { tone: 0, advice: "재치와 말솜씨가 빛나지만 직설이 화를 부를 수 있어요. 한 박자 늦춰 말하세요." },
  편재: { tone: 6, advice: "뜻밖의 기회와 사람 인연이 들어옵니다. 작은 투자·영업·제안에 유리합니다." },
  정재: { tone: 8, advice: "꾸준한 노력이 결실을 맺는 날입니다. 정산, 저축, 계약 마무리에 좋습니다." },
  편관: { tone: -4, advice: "압박과 책임이 커지는 날입니다. 무리한 약속을 줄이고 체력을 챙기세요." },
  정관: { tone: 6, advice: "신뢰와 평판이 오르는 날입니다. 면접·보고·공식 자리에서 좋은 인상을 줍니다." },
  편인: { tone: -2, advice: "생각이 많아지는 날입니다. 혼자 정리하는 시간이 도움이 되고, 공부·자격 준비에 좋습니다." },
  정인: { tone: 7, advice: "귀인과 배움의 기운이 있는 날입니다. 조언을 구하고 문서·시험 일정을 챙기세요." },
};

const CAT_TEXT: Record<string, [string, string, string]> = {
  wealth: ["지출을 점검하고 소액 결제부터 줄여보세요.", "무난한 흐름입니다. 계획한 만큼만 쓰면 안정적이에요.", "금전 감각이 좋습니다. 수입 기회를 놓치지 마세요."],
  love: ["감정 표현이 엇갈리기 쉬워요. 짧고 따뜻한 한마디가 좋습니다.", "차분한 교감의 날. 일상 대화에서 마음이 가까워져요.", "호감이 오가는 날입니다. 먼저 연락해 보세요."],
  work: ["실수 방지를 위해 한 번 더 확인하세요.", "맡은 일을 꾸준히 처리하면 충분합니다.", "집중력과 평판이 오릅니다. 중요한 일을 앞쪽에 배치하세요."],
  health: ["수면과 수분 보충이 우선입니다.", "가벼운 스트레칭으로 컨디션을 유지하세요.", "활력이 좋은 날입니다. 운동 루틴을 시작하기 좋아요."],
};
const catIdx = (s: number) => (s < 60 ? 0 : s < 78 ? 1 : 2);
const LUCKY_TIMES = ["오전 7–9시", "오전 9–11시", "오전 11시–오후 1시", "오후 1–3시", "오후 3–5시", "오후 5–7시", "오후 7–9시"];

export function dailyFortune(chart: SajuChart, an: Analysis, date: Date): DailyFortune {
  const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
  const t = pillarsOfDate(y, m, d);
  const god = tenGod(an.dm, t.day.stem);
  const base = 72 + GOD_DAILY[god].tone;

  let adj = 0;
  let relation: string | null = null;
  const myDayBranch = chart.day.branch;
  if (isChung(myDayBranch, t.day.branch)) { adj -= 8; relation = `오늘 ${pillarName(t.day)}일의 지지가 내 일지와 충(沖)해 변동·이동수가 있습니다.`; }
  else if (isYukHap(myDayBranch, t.day.branch)) { adj += 7; relation = `오늘 ${pillarName(t.day)}일의 지지가 내 일지와 합(合)해 인연·협력운이 좋습니다.`; }
  else if (isSamHap(myDayBranch, t.day.branch)) { adj += 4; relation = `오늘의 지지가 내 일지와 삼합을 이뤄 흐름이 순조롭습니다.`; }
  if (isStemHap(an.dm, t.day.stem)) { adj += 3; relation = (relation ?? "") + " 일간과 천간합이 들어 마음이 통하는 날입니다."; }

  // 용신 오행의 날이면 가점
  const dayEl = stemElement(t.day.stem);
  if (dayEl === an.yongsin) adj += 5;

  const seed = `${chart.input.year}${chart.input.month}${chart.input.day}${chart.input.hour}${chart.input.gender}|${y}-${m}-${d}`;
  const jitter = (k: string) => (hash(seed + k) % 13) - 6;
  const bump: Record<string, number> = {
    wealth: god === "정재" || god === "편재" ? 8 : god === "겁재" ? -10 : 0,
    love: god === "정관" || god === "정재" || god === "식신" ? 6 : god === "상관" ? -4 : 0,
    work: god === "정관" || god === "정인" ? 7 : god === "편관" ? -5 : 0,
    health: god === "편관" || god === "편인" ? -6 : god === "식신" ? 6 : 0,
  };
  const labels: Record<string, string> = { wealth: "재물운", love: "애정운", work: "직장·학업운", health: "건강운" };
  const categories = (Object.keys(labels) as (keyof typeof labels)[]).map((key) => {
    const score = clamp(base + adj + bump[key] + jitter(key));
    return { key, label: labels[key], score, text: CAT_TEXT[key][catIdx(score)] };
  });
  const total = clamp(base + adj + jitter("t") / 2);

  const luckyEl = an.yongsin;
  return {
    dateLabel: `${y}년 ${m}월 ${d}일`,
    dayPillar: t.day,
    god,
    total,
    categories,
    lucky: {
      color: ELEMENT_COLOR_NAMES[luckyEl],
      number: (hash(seed + "n") % 45) + 1,
      direction: ELEMENT_DIRECTIONS[luckyEl],
      time: LUCKY_TIMES[hash(seed + "h") % LUCKY_TIMES.length],
    },
    relation,
    advice: GOD_DAILY[god].advice,
  };
}

// ───────── 신년운세: 세운·월운 기반 ─────────
export interface MonthFortune {
  month: number; // 양력 월
  pillar: Pillar;
  god: TenGod;
  score: number;
  keyword: string;
}

const GOD_KEYWORD: Record<TenGod, string> = {
  비견: "협력·독립", 겁재: "경쟁·지출 주의", 식신: "여유·표현", 상관: "아이디어·구설 주의",
  편재: "기회·활동", 정재: "수입·안정", 편관: "압박·도전", 정관: "승진·신뢰",
  편인: "공부·고민", 정인: "귀인·문서",
};

export interface YearFortune {
  year: number;
  yearPillar: Pillar;
  god: TenGod;
  branchGod: TenGod;
  score: number;
  summary: string;
  months: MonthFortune[];
  best: MonthFortune;
  worst: MonthFortune;
  tips: string[];
}

const YEAR_SUMMARY: Record<TenGod, string> = {
  비견: "주변 사람과 힘을 합치거나 독립을 고민하게 되는 해입니다. 경쟁자가 늘 수 있으니 내 몫을 분명히 하세요.",
  겁재: "재물이 나가기 쉬운 해입니다. 보증·동업·충동 투자를 피하고 지출 통제가 핵심입니다.",
  식신: "여유와 표현의 해입니다. 재능을 드러내고 건강·취미·창작에서 만족을 얻습니다.",
  상관: "아이디어가 폭발하지만 말과 규칙 사이에서 마찰이 생길 수 있는 해입니다. 변화와 이직 욕구가 커집니다.",
  편재: "활동 반경과 돈의 흐름이 커지는 해입니다. 기회가 많은 만큼 분산과 기록이 필요합니다.",
  정재: "노력한 만큼 안정적으로 쌓이는 해입니다. 저축·계약·결혼 등 현실적 결실에 유리합니다.",
  편관: "책임과 압박이 커지지만 단련을 통해 성장하는 해입니다. 건강과 무리한 약속을 관리하세요.",
  정관: "직장·사회적 평판이 오르는 해입니다. 승진·합격·공식적 인정의 기회가 있습니다.",
  편인: "공부·자격·내면 정리의 해입니다. 속도를 늦추고 기반을 다지면 다음 도약이 쉬워집니다.",
  정인: "귀인과 문서(계약·합격·부동산)의 해입니다. 도움을 청하면 길이 열립니다.",
};

export function yearFortune(chart: SajuChart, an: Analysis, year: number): YearFortune {
  const t = pillarsOfDate(year, 6, 15);
  const god = tenGod(an.dm, t.year.stem);
  const branchGod = branchTenGod(an.dm, t.year.branch);
  const yearEl = stemElement(t.year.stem);
  const seed = `${chart.input.year}${chart.input.month}${chart.input.day}${chart.input.gender}`;

  let yAdj = GOD_DAILY[god].tone + (yearEl === an.yongsin ? 6 : 0);
  if (isChung(chart.year.branch, t.year.branch)) yAdj -= 6; // 세운이 태어난 해의 띠를 충
  if (isChung(chart.day.branch, t.year.branch)) yAdj -= 5;
  if (isYukHap(chart.day.branch, t.year.branch)) yAdj += 5;

  const months: MonthFortune[] = [];
  for (let mo = 1; mo <= 12; mo++) {
    const p = pillarsOfDate(year, mo, 20).month; // 월 중순 이후라 절기 경계 영향 없음
    const g = tenGod(an.dm, p.stem);
    let s = 70 + yAdj + GOD_DAILY[g].tone + ((hash(`${seed}${year}${mo}`) % 9) - 4);
    if (stemElement(p.stem) === an.yongsin) s += 5;
    if (isChung(chart.day.branch, p.branch)) s -= 7;
    if (isYukHap(chart.day.branch, p.branch)) s += 5;
    months.push({ month: mo, pillar: p, god: g, score: clamp(s), keyword: GOD_KEYWORD[g] });
  }
  const sorted = [...months].sort((a, b) => b.score - a.score);
  const score = clamp(months.reduce((a, b) => a + b.score, 0) / 12);
  const tips = [
    `올해의 용신 오행은 ${ELEMENTS[an.yongsin]}(${ELEMENT_COLOR_NAMES[an.yongsin]}) — ${ELEMENT_DIRECTIONS[an.yongsin]} 방향과 해당 색을 가까이 하세요.`,
    `가장 좋은 달은 ${sorted[0].month}월(${sorted[0].keyword}), 조심할 달은 ${sorted[11].month}월(${sorted[11].keyword})입니다.`,
    chart.year.branch === t.year.branch ? "본인 띠의 해(본명년)라 환경 변화가 큽니다. 큰 결정은 상반기에 정리하세요." : `올해는 ${ANIMALS[t.year.branch]}띠의 해입니다.`,
  ];
  return {
    year, yearPillar: t.year, god, branchGod, score,
    summary: YEAR_SUMMARY[god], months, best: sorted[0], worst: sorted[11], tips,
  };
}

// ───────── 궁합 ─────────
export interface MatchResult {
  total: number;
  parts: { label: string; score: number; note: string }[];
  verdict: string;
}

export function matchScore(a: SajuChart, b: SajuChart): MatchResult {
  const aa = analyze(a), bb = analyze(b);
  const parts: MatchResult["parts"] = [];

  // 1. 일간 관계
  let s1 = 70, n1 = "일간의 기운이 무난하게 맞닿습니다.";
  if (isStemHap(aa.dm, bb.dm)) { s1 = 95; n1 = "두 사람의 일간이 천간합을 이루는 인연입니다. 끌림과 신뢰가 큽니다."; }
  else {
    const g = tenGod(aa.dm, bb.dm);
    if (g === "정재" || g === "정관" || g === "정인" || g === "식신") { s1 = 84; n1 = `상대는 나에게 ${g}의 기운 — 서로를 안정시키는 관계입니다.`; }
    else if (g === "상관" || g === "편관" || g === "겁재") { s1 = 58; n1 = `상대는 나에게 ${g}의 기운 — 자극이 크고 부딪힘도 있는 관계입니다.`; }
  }
  parts.push({ label: "일간 궁합", score: s1, note: n1 });

  // 2. 일지(배우자궁)
  let s2 = 68, n2 = "배우자궁이 평범하게 어울립니다.";
  if (isYukHap(a.day.branch, b.day.branch)) { s2 = 94; n2 = "일지가 육합 — 생활 리듬과 정서가 잘 맞습니다."; }
  else if (isSamHap(a.day.branch, b.day.branch)) { s2 = 84; n2 = "일지가 삼합 — 함께할수록 힘이 커집니다."; }
  else if (isChung(a.day.branch, b.day.branch)) { s2 = 45; n2 = "일지가 충 — 다툼 뒤 풀어가는 대화법이 필요합니다."; }
  parts.push({ label: "배우자궁(일지)", score: s2, note: n2 });

  // 3. 띠
  let s3 = 70, n3 = `${ANIMALS[a.year.branch]}띠와 ${ANIMALS[b.year.branch]}띠, 큰 충돌은 없습니다.`;
  if (isYukHap(a.year.branch, b.year.branch)) { s3 = 90; n3 = "띠가 육합입니다. 처음부터 편안합니다."; }
  else if (isSamHap(a.year.branch, b.year.branch)) { s3 = 82; n3 = "띠가 삼합입니다. 목표를 공유하면 시너지가 큽니다."; }
  else if (isChung(a.year.branch, b.year.branch)) { s3 = 50; n3 = "띠가 충입니다. 가치관 차이를 인정하면 오히려 보완됩니다."; }
  parts.push({ label: "띠 궁합", score: s3, note: n3 });

  // 4. 오행 보완
  const aNeed = aa.yongsin, bNeed = bb.yongsin;
  const aGives = bb.counts[aNeed] >= 2, bGives = aa.counts[bNeed] >= 2;
  const s4 = 62 + (aGives ? 18 : 0) + (bGives ? 18 : 0);
  const n4 =
    aGives && bGives ? "서로가 서로의 부족한 오행을 채워주는 이상적인 보완 관계입니다."
    : aGives || bGives ? "한쪽이 상대의 부족한 기운을 채워주는 관계입니다."
    : "오행 보완은 약한 편입니다. 취향·환경으로 부족한 기운을 함께 채워보세요.";
  parts.push({ label: "오행 보완", score: s4, note: n4 });

  const total = clamp(parts.reduce((x, p) => x + p.score, 0) / parts.length, 30, 99);
  const verdict =
    total >= 85 ? "천생연분에 가까운 궁합입니다." : total >= 72 ? "서로 노력하면 오래 가는 좋은 궁합입니다." : total >= 60 ? "다름을 이해할수록 깊어지는 궁합입니다." : "충돌 지점이 분명하지만, 알고 대처하면 충분히 극복 가능합니다.";
  return { total, parts, verdict };
}

export { buildChart, BRANCH_ELEMENT };
export type { Element };
