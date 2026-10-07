import KoreanLunarCalendar from "korean-lunar-calendar";

// ───────── 기본 상수 ─────────
export const STEMS = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"] as const;
export const STEMS_HANJA = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
export const BRANCHES = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"] as const;
export const BRANCHES_HANJA = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;
export const ANIMALS = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"] as const;

export const ELEMENTS = ["목", "화", "토", "금", "수"] as const;
export const ELEMENTS_HANJA = ["木", "火", "土", "金", "水"] as const;
export type Element = 0 | 1 | 2 | 3 | 4;
/** 오행 색 (한지 위에서도 읽히는 채도) */
export const ELEMENT_COLORS = ["#2f8f5b", "#d9483b", "#c8921b", "#7b8794", "#2b6cb0"] as const;
export const ELEMENT_COLOR_NAMES = ["초록", "빨강", "노랑/황토", "흰색/은색", "검정/남색"] as const;
export const ELEMENT_DIRECTIONS = ["동쪽", "남쪽", "중앙", "서쪽", "북쪽"] as const;

const stemElement = (s: number) => Math.floor(s / 2) as Element;
const BRANCH_ELEMENT: Element[] = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];
/** 지지 본기(대표 천간) — 십성·음양 판단에 사용 */
const BRANCH_MAIN_STEM = [9, 5, 0, 1, 4, 2, 3, 5, 6, 7, 4, 8];

export interface Pillar {
  stem: number;
  branch: number;
}

export const pillarName = (p: Pillar) => `${STEMS[p.stem]}${BRANCHES[p.branch]}`;
export const pillarHanja = (p: Pillar) => `${STEMS_HANJA[p.stem]}${BRANCHES_HANJA[p.branch]}`;
export const pillarIndex = (p: Pillar) => {
  for (let i = 0; i < 60; i++) if (i % 10 === p.stem && i % 12 === p.branch) return i;
  return 0;
};
export const pillarFromIndex = (i: number): Pillar => {
  const n = ((i % 60) + 60) % 60;
  return { stem: n % 10, branch: n % 12 };
};

// ───────── 천문 계산: 태양 황경 (Meeus 저정밀식, 오차 ≈ 수 분) ─────────
const JD_UNIX_EPOCH = 2440587.5;
const KST_OFFSET_MS = 9 * 3600 * 1000;

/** KST 달력 시각 → UTC ms */
const kstToMs = (y: number, m: number, d: number, h = 0, mi = 0) =>
  Date.UTC(y, m - 1, d, h, mi) - KST_OFFSET_MS;

export function sunLongitude(ms: number): number {
  const jd = ms / 86400000 + JD_UNIX_EPOCH;
  const T = (jd - 2451545) / 36525;
  const rad = Math.PI / 180;
  const L0 = 280.46646 + 36000.76983 * T;
  const M = (357.52911 + 35999.05029 * T) * rad;
  const C =
    (1.914602 - 0.004817 * T) * Math.sin(M) +
    0.019993 * Math.sin(2 * M) +
    0.000289 * Math.sin(3 * M);
  const omega = (125.04 - 1934.136 * T) * rad;
  const lon = L0 + C - 0.00569 - 0.00478 * Math.sin(omega);
  return ((lon % 360) + 360) % 360;
}

const signedDiff = (a: number, b: number) => ((a - b + 540) % 360) - 180;

/** targetLon(도)을 태양이 통과하는 시각(ms). near 기준 ±40일 안에서 이분 탐색 */
export function termTime(targetLon: number, nearMs: number): number {
  let lo = nearMs - 40 * 86400000;
  let hi = nearMs + 40 * 86400000;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (signedDiff(sunLongitude(mid), targetLon) < 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** 월 경계가 되는 12절(節) 이름: 입춘(315°)부터 30°씩 */
export const JEOL_NAMES = ["입춘", "경칩", "청명", "입하", "망종", "소서", "입추", "백로", "한로", "입동", "대설", "소한"];
const jeolLon = (k: number) => (315 + 30 * k) % 360;

// ───────── 달력 ─────────
export interface BirthInput {
  year: number;
  month: number;
  day: number;
  /** 시간 모름이면 null */
  hour: number | null;
  minute: number;
  gender: "M" | "F";
  calendar: "solar" | "lunar";
  leap: boolean;
  /** 진태양시 보정(−30분) */
  trueSolar: boolean;
  name: string;
}

export function toSolar(
  b: Pick<BirthInput, "year" | "month" | "day" | "calendar" | "leap">
): { year: number; month: number; day: number } | null {
  if (b.year < 1900 || b.year > 2100) return null;
  const cal = new KoreanLunarCalendar();
  if (b.calendar === "lunar") {
    if (!cal.setLunarDate(b.year, b.month, b.day, b.leap)) return null;
    const s = cal.getSolarCalendar();
    return { year: s.year, month: s.month, day: s.day };
  }
  const probe = new Date(Date.UTC(b.year, b.month - 1, b.day));
  if (probe.getUTCMonth() !== b.month - 1 || probe.getUTCDate() !== b.day) return null;
  return { year: b.year, month: b.month, day: b.day };
}

export function toLunar(y: number, m: number, d: number) {
  const cal = new KoreanLunarCalendar();
  if (!cal.setSolarDate(y, m, d)) return null;
  const l = cal.getLunarCalendar();
  return { year: l.year, month: l.month, day: l.day, leap: !!l.intercalation };
}

// ───────── 사주 4주 ─────────
function julianDayNumber(y: number, m: number, d: number) {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

/** 양력 날짜의 일주 (2000-01-01 = 무오일로 검증) */
export function dayPillar(y: number, m: number, d: number): Pillar {
  return pillarFromIndex(julianDayNumber(y, m, d) + 49);
}

/** 해당 시각의 월(寅=0 … 丑=11)과 세(歲) 연도 */
function monthAndYear(ms: number, y: number, m: number) {
  const lon = sunLongitude(ms);
  const idx = Math.floor((((lon - 315) % 360) + 360) % 360 / 30);
  const sajuYear = m <= 2 && lon < 315 ? y - 1 : y;
  return { idx, sajuYear };
}

function monthPillar(sajuYear: number, idx: number): Pillar {
  const yearStem = (((sajuYear - 4) % 10) + 10) % 10;
  const first = ((yearStem % 5) * 2 + 2) % 10; // 오호둔: 寅월 천간
  return { stem: (first + idx) % 10, branch: (2 + idx) % 12 };
}

function hourPillar(dayStem: number, hour: number, minute: number): Pillar {
  const branch = Math.floor(((hour * 60 + minute + 60) % 1440) / 120);
  return { stem: ((dayStem % 5) * 2 + branch) % 10, branch };
}

export interface SajuChart {
  input: BirthInput;
  solar: { year: number; month: number; day: number };
  lunar: { year: number; month: number; day: number; leap: boolean } | null;
  /** 연·월·일·시 (시간 모름이면 hour=null) */
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
  /** 출생 시각 UTC ms (시간 모름이면 정오 가정) */
  birthMs: number;
}

export function buildChart(input: BirthInput): SajuChart | null {
  const solar = toSolar(input);
  if (!solar) return null;

  let { year: y, month: m, day: d } = solar;
  let h = input.hour ?? 12;
  let mi = input.hour === null ? 0 : input.minute;
  if (input.trueSolar && input.hour !== null) {
    const t = new Date(Date.UTC(y, m - 1, d, h, mi) - 30 * 60000);
    y = t.getUTCFullYear();
    m = t.getUTCMonth() + 1;
    d = t.getUTCDate();
    h = t.getUTCHours();
    mi = t.getUTCMinutes();
  }

  // 23시 이후는 자시(子時)로 보아 다음 날 일주를 사용
  let dy = y,
    dm = m,
    dd = d;
  if (input.hour !== null && h >= 23) {
    const t = new Date(Date.UTC(y, m - 1, d + 1));
    dy = t.getUTCFullYear();
    dm = t.getUTCMonth() + 1;
    dd = t.getUTCDate();
  }

  const ms = kstToMs(y, m, d, h, mi);
  const { idx, sajuYear } = monthAndYear(ms, y, m);
  const yearP: Pillar = { stem: (((sajuYear - 4) % 10) + 10) % 10, branch: (((sajuYear - 4) % 12) + 12) % 12 };
  const monthP = monthPillar(sajuYear, idx);
  const dayP = dayPillar(dy, dm, dd);
  const hourP = input.hour === null ? null : hourPillar(dayP.stem, h, mi);

  return {
    input,
    solar,
    lunar: toLunar(solar.year, solar.month, solar.day),
    year: yearP,
    month: monthP,
    day: dayP,
    hour: hourP,
    birthMs: ms,
  };
}

/** 특정 양력 날짜(정오 기준)의 일진·월건·세운 */
export function pillarsOfDate(y: number, m: number, d: number) {
  const ms = kstToMs(y, m, d, 12, 0);
  const { idx, sajuYear } = monthAndYear(ms, y, m);
  return {
    year: { stem: (((sajuYear - 4) % 10) + 10) % 10, branch: (((sajuYear - 4) % 12) + 12) % 12 } as Pillar,
    month: monthPillar(sajuYear, idx),
    day: dayPillar(y, m, d),
  };
}

// ───────── 십성 / 오행 ─────────
export const TEN_GODS = ["비견", "겁재", "식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인"] as const;
export type TenGod = (typeof TEN_GODS)[number];

/** 일간(dm) 기준 다른 천간(other)의 십성 */
export function tenGod(dm: number, other: number): TenGod {
  const de = stemElement(dm);
  const oe = stemElement(other);
  const same = dm % 2 === other % 2;
  const rel = (oe - de + 5) % 5; // 0 동일, 1 내가 생, 2 내가 극, 3 나를 극, 4 나를 생
  const table: [TenGod, TenGod][] = [
    ["비견", "겁재"],
    ["식신", "상관"],
    ["편재", "정재"],
    ["편관", "정관"],
    ["편인", "정인"],
  ];
  return table[rel][same ? 0 : 1];
}

export const branchTenGod = (dm: number, branch: number) => tenGod(dm, BRANCH_MAIN_STEM[branch]);

export function elementCounts(c: SajuChart): number[] {
  const counts = [0, 0, 0, 0, 0];
  const add = (p: Pillar, branchWeight = 1) => {
    counts[stemElement(p.stem)] += 1;
    counts[BRANCH_ELEMENT[p.branch]] += branchWeight;
  };
  add(c.year);
  add(c.month, 2); // 월령(月令)은 가중
  add(c.day);
  if (c.hour) add(c.hour);
  return counts;
}

export interface Analysis {
  dm: number;
  dmElement: Element;
  counts: number[];
  gods: { label: string; stem: TenGod | "일간"; branch: TenGod }[];
  godCounts: Record<string, number>;
  /** 0~100, 높을수록 일간이 강함 */
  strength: number;
  strong: boolean;
  yongsin: Element;
  yongsinReason: string;
  weakest: Element;
  strongest: Element;
}

const GROUP: Record<TenGod, "peer" | "output" | "wealth" | "officer" | "resource"> = {
  비견: "peer", 겁재: "peer", 식신: "output", 상관: "output",
  편재: "wealth", 정재: "wealth", 편관: "officer", 정관: "officer",
  편인: "resource", 정인: "resource",
};

export function analyze(c: SajuChart): Analysis {
  const dm = c.day.stem;
  const dmEl = stemElement(dm);
  const counts = elementCounts(c);

  const pillars: { label: string; p: Pillar | null }[] = [
    { label: "시주", p: c.hour },
    { label: "일주", p: c.day },
    { label: "월주", p: c.month },
    { label: "연주", p: c.year },
  ];
  const gods = pillars
    .filter((x) => x.p)
    .map(({ label, p }) => ({
      label,
      stem: label === "일주" ? ("일간" as const) : tenGod(dm, p!.stem),
      branch: branchTenGod(dm, p!.branch),
    }));

  const godCounts: Record<string, number> = {};
  const bump = (g: TenGod, w = 1) => (godCounts[g] = (godCounts[g] ?? 0) + w);
  for (const { p, label } of pillars) {
    if (!p) continue;
    if (label !== "일주") bump(tenGod(dm, p.stem));
    bump(branchTenGod(dm, p.branch), label === "월주" ? 2 : 1);
  }

  // 강약: 나를 돕는 힘(비겁·인성) 대 나를 소모하는 힘
  const resourceEl = ((dmEl + 4) % 5) as Element;
  const outputEl = ((dmEl + 1) % 5) as Element;
  const wealthEl = ((dmEl + 2) % 5) as Element;
  const officerEl = ((dmEl + 3) % 5) as Element;
  const support = counts[dmEl] + counts[resourceEl];
  const drain = counts[outputEl] + counts[wealthEl] + counts[officerEl];
  const total = support + drain || 1;
  const strength = Math.round((support / total) * 100);
  const strong = strength >= 50;

  const pick = (els: Element[]) => els.slice().sort((a, b) => counts[a] - counts[b])[0];
  const yongsin = strong ? pick([outputEl, wealthEl, officerEl]) : pick([resourceEl, dmEl]);
  const yongsinReason = strong
    ? "일간의 힘이 강해 기운을 덜어내고 쓰는 오행(식상·재성·관성) 중 가장 부족한 기운을 보완합니다."
    : "일간의 힘이 약해 나를 돕는 오행(인성·비겁) 중 가장 부족한 기운을 보완합니다.";

  const order = ([0, 1, 2, 3, 4] as Element[]).sort((a, b) => counts[a] - counts[b]);
  return {
    dm,
    dmElement: dmEl,
    counts,
    gods,
    godCounts,
    strength,
    strong,
    yongsin,
    yongsinReason,
    weakest: order[0],
    strongest: order[4],
  };
}

export const godGroup = (g: TenGod) => GROUP[g];

// ───────── 대운 ─────────
export interface Daewoon {
  pillar: Pillar;
  startAge: number;
  endAge: number;
  startYear: number;
  god: TenGod;
}

export function daewoon(c: SajuChart, count = 9): { forward: boolean; startAge: number; list: Daewoon[] } {
  const yangYear = c.year.stem % 2 === 0;
  const forward = (yangYear && c.input.gender === "M") || (!yangYear && c.input.gender === "F");

  const lon = sunLongitude(c.birthMs);
  const cur = Math.floor((((lon - 315) % 360) + 360) % 360 / 30);
  const targetIdx = forward ? (cur + 1) % 12 : cur;
  const target = termTime(jeolLon(targetIdx), c.birthMs);
  const days = Math.abs(target - c.birthMs) / 86400000;
  const startAge = Math.max(1, Math.round(days / 3)); // 3일 = 1년

  const base = pillarIndex(c.month);
  const list: Daewoon[] = [];
  for (let i = 1; i <= count; i++) {
    const p = pillarFromIndex(base + (forward ? i : -i));
    const a = startAge + (i - 1) * 10;
    list.push({
      pillar: p,
      startAge: a,
      endAge: a + 9,
      startYear: c.solar.year + a - 1,
      god: tenGod(c.day.stem, p.stem),
    });
  }
  return { forward, startAge, list };
}

export const ageOf = (c: SajuChart, y: number) => y - c.solar.year + 1;

export function nextJeol(fromMs: number): { name: string; ms: number } {
  const lon = sunLongitude(fromMs);
  const cur = Math.floor((((lon - 315) % 360) + 360) % 360 / 30);
  const k = (cur + 1) % 12;
  return { name: JEOL_NAMES[k], ms: termTime(jeolLon(k), fromMs + 15 * 86400000) };
}

// ───────── 공유용 직렬화 ─────────
export function birthToQuery(b: BirthInput): string {
  const q = new URLSearchParams({
    y: String(b.year), m: String(b.month), d: String(b.day),
    h: b.hour === null ? "" : String(b.hour), mi: String(b.minute),
    g: b.gender, c: b.calendar === "lunar" ? "l" : "s",
    lp: b.leap ? "1" : "0", ts: b.trueSolar ? "1" : "0", n: b.name,
  });
  return q.toString();
}

export function birthFromQuery(q: URLSearchParams, prefix = ""): BirthInput | null {
  const num = (k: string) => Number(q.get(prefix + k));
  const y = num("y"), m = num("m"), d = num("d");
  if (!q.get(prefix + "y") || !y || !m || !d) return null;
  const hRaw = q.get(prefix + "h");
  return {
    year: y, month: m, day: d,
    hour: hRaw === null || hRaw === "" ? null : Number(hRaw),
    minute: num("mi") || 0,
    gender: q.get(prefix + "g") === "F" ? "F" : "M",
    calendar: q.get(prefix + "c") === "l" ? "lunar" : "solar",
    leap: q.get(prefix + "lp") === "1",
    trueSolar: q.get(prefix + "ts") === "1",
    name: (q.get(prefix + "n") ?? "").slice(0, 20),
  };
}

export { stemElement, BRANCH_ELEMENT };
