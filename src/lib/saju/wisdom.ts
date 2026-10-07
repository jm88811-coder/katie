import {
  BRANCHES, ELEMENTS, STEMS, ageOf, daewoon, godGroup, pillarName, tenGod,
  type Analysis, type Daewoon, type SajuChart, type TenGod,
} from "./core";
import { DAY_MASTER } from "./content";
import { isChung, yearFortune, type YearFortune } from "./fortune";

// ───────── 철학 렌즈 ─────────
export interface Lens {
  id: "dao" | "confucian" | "yijing" | "buddhism";
  name: string;
  quote: string;
  source: string;
  insight: string;
  practice: string;
  evidence: string[];
  weight: number;
}

const gc = (an: Analysis, ...gods: TenGod[]) => gods.reduce((s, g) => s + (an.godCounts[g] ?? 0), 0);

function chartChungs(chart: SajuChart): string[] {
  const list: [string, number][] = [
    ["연지", chart.year.branch], ["월지", chart.month.branch], ["일지", chart.day.branch],
  ];
  if (chart.hour) list.push(["시지", chart.hour.branch]);
  const out: string[] = [];
  for (let i = 0; i < list.length; i++)
    for (let j = i + 1; j < list.length; j++)
      if (isChung(list[i][1], list[j][1]))
        out.push(`${list[i][0]} ${BRANCHES[list[i][1]]}와 ${list[j][0]} ${BRANCHES[list[j][1]]}가 충(沖)`);
  return out;
}

export function currentDaewoon(chart: SajuChart, now = new Date()): Daewoon | null {
  const age = ageOf(chart, now.getFullYear());
  return daewoon(chart).list.find((d) => age >= d.startAge && age <= d.endAge) ?? null;
}

export function pickLenses(chart: SajuChart, an: Analysis, now = new Date()): Lens[] {
  const lenses: Lens[] = [];
  const peer = gc(an, "비견", "겁재");
  const resource = gc(an, "편인", "정인");
  const output = gc(an, "식신", "상관");
  const chungs = chartChungs(chart);
  const dw = currentDaewoon(chart, now);
  const dwChung = dw ? isChung(chart.day.branch, dw.pillar.branch) : false;

  if (an.strong && output <= 2) {
    lenses.push({
      id: "dao", name: "도가(道家) — 덜어냄의 지혜",
      quote: "知足者富 (족함을 아는 자가 부유하다)", source: "도덕경 33장 취지",
      insight: "힘이 넘치는 사주는 더 채우는 것보다 흘려보내는 길을 찾을 때 운이 열립니다. 쥐고 있던 주도권을 나누고, 재능을 바깥으로 표현할수록 막힌 기운이 풀립니다.",
      practice: "한 달에 한 번, 내가 쥐고 있는 일 하나를 다른 사람에게 넘겨보세요. 결과물을 세상에 공개하는 습관(글·작품·발표)을 만드세요.",
      evidence: [`일간 힘 ${an.strength}점(신강)`, `식상(표현) 기운 ${output}점으로 부족`],
      weight: 80 + (an.strength - 50) / 2,
    });
  }
  if (!an.strong || resource <= 1) {
    lenses.push({
      id: "confucian", name: "유가(儒家) — 수신(修身)과 관계",
      quote: "君子求諸己 (군자는 원인을 자기에게서 구한다)", source: "논어 위령공 취지",
      insight: "힘이 약하거나 배움·귀인 기운이 얕은 사주는 혼자 버티기보다 기본기를 쌓고 믿을 사람을 곁에 두는 것이 운의 뿌리가 됩니다. 흔들릴 때는 환경 탓보다 내가 바꿀 수 있는 습관부터 돌아보세요.",
      practice: "배움 하나(자격·독서·멘토링)를 90일 단위로 정하고, 정기적으로 조언을 구할 사람 한 명을 고정하세요.",
      evidence: [!an.strong ? `일간 힘 ${an.strength}점(신약)` : `일간 힘 ${an.strength}점`, `인성(배움·귀인) 기운 ${resource}점`],
      weight: 78 + (50 - an.strength) / 2,
    });
  }
  if (chungs.length > 0 || dwChung) {
    lenses.push({
      id: "yijing", name: "주역(周易) — 변화와 때(時)",
      quote: "窮則變 變則通 通則久 (궁하면 변하고, 변하면 통하고, 통하면 오래간다)", source: "주역 계사전 하 취지",
      insight: "충(沖)은 흔들림이 아니라 정체된 구조가 바뀌는 신호입니다. 변화가 올 때 버티기만 하면 소모되고, 방향을 바꿔 올라타면 새 국면이 열립니다. 중요한 것은 '무엇을 할까'보다 '지금이 어느 때인가'입니다.",
      practice: "큰 결정은 변화가 시작되는 달 직전에 정리하고, 변동기에는 되돌릴 수 있는 작은 실험부터 하세요.",
      evidence: [...chungs, ...(dwChung && dw ? [`현재 대운 ${pillarName(dw.pillar)}의 지지가 일지와 충`] : [])],
      weight: 85 + chungs.length * 3 + (dwChung ? 6 : 0),
    });
  }
  if (peer >= 4) {
    lenses.push({
      id: "buddhism", name: "불교 — 집착과 인과",
      quote: "應無所住而生其心 (머무는 바 없이 마음을 낸다)", source: "금강경 취지",
      insight: "비견·겁재가 많은 사주는 '내 것, 내 방식'에 대한 집착이 클수록 사람과 재물이 흩어집니다. 결과에 매달리기보다 과정의 원인(인因)을 바르게 심을 때 열매가 안정됩니다.",
      practice: "결정 전에 '이 선택이 내 자존심 때문인가, 목적 때문인가'를 한 줄로 적어보세요. 경쟁 상대를 협력 관계로 바꿀 방법 하나를 찾아보세요.",
      evidence: [`비견·겁재 기운 ${peer}점`],
      weight: 75 + peer,
    });
  }
  if (lenses.length < 2) {
    const base = DAY_MASTER[an.dm];
    const hasDao = lenses.some((l) => l.id === "dao");
    lenses.push(
      hasDao
        ? {
            id: "yijing", name: "주역(周易) — 때를 읽는 지혜",
            quote: "君子見幾而作 (군자는 기미를 보고 움직인다)", source: "주역 계사전 하 취지",
            insight: `${base.title}의 기질은 밀어붙일 때보다 흐름이 바뀌는 시점을 읽을 때 빛납니다. 큰 충돌이 없는 지금은 서두르기보다 다음 계절의 신호를 살피며 준비하기 좋은 때입니다.`,
            practice: "분기마다 한 번, 지난 3개월의 흐름과 앞으로 3개월의 신호를 한 장으로 적어보세요.",
            evidence: ["사주 내 뚜렷한 충(沖)이 없어 안정 구조", `오행 균형: 가장 강한 ${ELEMENTS[an.strongest]}, 가장 약한 ${ELEMENTS[an.weakest]}`],
            weight: 60,
          }
        : {
            id: "dao", name: "도가(道家) — 흐름을 거스르지 않기",
            quote: "上善若水 (가장 좋은 것은 물과 같다)", source: "도덕경 8장 취지",
            insight: `${base.title}의 기질을 억지로 바꾸기보다, 흐름이 열리는 쪽으로 몸을 맡길 때 가장 힘이 덜 듭니다. 균형 잡힌 사주일수록 큰 변화보다 꾸준함이 운을 키웁니다.`,
            practice: "하루 중 가장 에너지가 좋은 시간대를 찾아 중요한 일을 그 시간에 두세요.",
            evidence: [`오행 균형: 가장 강한 ${ELEMENTS[an.strongest]}, 가장 약한 ${ELEMENTS[an.weakest]}`],
            weight: 60,
          }
    );
  }
  return lenses.sort((a, b) => b.weight - a.weight).slice(0, 3);
}

// ───────── 인생 시즌 지도 ─────────
export type SeasonId = "spring" | "summer" | "autumn" | "winter";
export interface SeasonInfo {
  id: SeasonId; name: string; emoji: string; theme: string; todo: string[]; avoid: string[];
}

export const SEASONS: Record<SeasonId, SeasonInfo> = {
  spring: { id: "spring", name: "씨뿌리기", emoji: "🌱", theme: "표현·시도·재능이 열리는 시기",
    todo: ["작게 시작해서 공개하기", "새 기술·사람 만나기", "포트폴리오·콘텐츠 쌓기"], avoid: ["완벽해질 때까지 미루기", "결과를 바로 기대하기"] },
  summer: { id: "summer", name: "키우기(단련)", emoji: "🔥", theme: "책임과 압박 속에서 실력이 단련되는 시기",
    todo: ["조직·역할 안에서 성과 내기", "체력·멘탈 관리 루틴", "신뢰 쌓기"], avoid: ["무리한 약속", "충동적 이직·결별"] },
  autumn: { id: "autumn", name: "거두기", emoji: "🍂", theme: "노력이 재물·성과로 돌아오는 시기",
    todo: ["수익 구조 만들기·저축", "계약·정산·자산 정리", "성과 문서화"], avoid: ["과소비·과욕", "수확 직전 방심"] },
  winter: { id: "winter", name: "갈무리(쉬기)", emoji: "❄️", theme: "배움과 재정비로 다음 계절을 준비하는 시기",
    todo: ["공부·자격·내면 정리", "관계·재정 점검", "건강 회복"], avoid: ["조급한 확장", "남과의 비교"] },
};

const seasonOf = (god: TenGod): SeasonId => {
  const g = godGroup(god);
  return g === "output" ? "spring" : g === "officer" ? "summer" : g === "wealth" ? "autumn" : "winter";
};

export interface SeasonSlot {
  daewoon: Daewoon;
  season: SeasonInfo;
  current: boolean;
  evidence: string;
}

export function seasonMap(chart: SajuChart, now = new Date()): SeasonSlot[] {
  const dw = daewoon(chart);
  const age = ageOf(chart, now.getFullYear());
  return dw.list.map((d) => ({
    daewoon: d,
    season: SEASONS[seasonOf(d.god)],
    current: age >= d.startAge && age <= d.endAge,
    evidence: `${d.startAge}~${d.endAge}세 대운 ${pillarName(d.pillar)} — 일간 기준 ${d.god}`,
  }));
}

// ───────── 위기 → 기회 카드 ─────────
export interface CrisisCard {
  id: string;
  kind: "crisis" | "opportunity";
  title: string;
  signal: string;
  mistake: string;
  flip: string[];
  evidence: string[];
}

const GOD_CARD: Partial<Record<TenGod, Omit<CrisisCard, "id" | "evidence" | "signal">>> = {
  겁재: { kind: "crisis", title: "새어나가는 돈, 경쟁자의 등장",
    mistake: "보증·동업·충동 소비로 번 돈이 흩어지고, 비교 때문에 무리한 결정을 내립니다.",
    flip: ["수입의 일정 비율을 월초 자동이체로 먼저 분리하기", "큰 금액은 24시간 보류 규칙 적용", "경쟁자를 분석 대상으로 삼아 차별점 한 가지 만들기"] },
  편관: { kind: "crisis", title: "책임과 압박이 커지는 시기",
    mistake: "혼자 다 떠안다 번아웃이 오거나, 압박을 피해 중요한 일을 미룹니다.",
    flip: ["해야 할 일을 '내 책임/위임 가능/버릴 것'으로 나누기", "주 2회 이상 몸을 쓰는 루틴 고정", "어려운 과제를 실력의 증거로 기록하기"] },
  상관: { kind: "crisis", title: "말과 규칙 사이의 마찰",
    mistake: "직설적인 한마디로 신뢰를 잃거나, 규칙에 반발해 기회를 스스로 닫습니다.",
    flip: ["중요한 말은 글로 한 번 정리한 뒤 전하기", "불만을 개선 제안서 형태로 바꿔 전달하기", "창작·콘텐츠 활동으로 표현 욕구를 출구화하기"] },
  편인: { kind: "crisis", title: "생각만 깊어지는 정체기",
    mistake: "준비만 하다가 시작을 놓치고, 고립되어 판단이 한쪽으로 쏠립니다.",
    flip: ["공부는 90일 안에 결과물(글·시험·프로젝트)로 마무리", "한 주에 한 번 사람을 만나 생각을 말로 꺼내기", "'충분히 안다'가 아니라 '충분히 시도했다'를 기준으로 삼기"] },
  식신: { kind: "opportunity", title: "재능이 빛나는 여유의 시기",
    mistake: "편안함에 안주해 기회를 지나칩니다.",
    flip: ["가장 자신 있는 재능을 외부에 공개하기", "작은 수익화 실험 1건 시작", "건강·취미 루틴을 장기 습관으로 고정"] },
  정재: { kind: "opportunity", title: "노력이 결실로 돌아오는 시기",
    mistake: "안정에 만족해 다음 투자를 멈춥니다.",
    flip: ["저축·계약·정산을 이 시기에 정리", "수입 구조를 한 줄 더 늘릴 계획 세우기", "신뢰를 문서(계약·기록)로 남기기"] },
  편재: { kind: "opportunity", title: "활동 반경과 기회가 넓어지는 시기",
    mistake: "기회가 많아 분산되고 기록 없이 흘려보냅니다.",
    flip: ["새 만남·제안은 '기준 3가지'로 선별", "수입·지출·약속을 한곳에 기록", "영업·제안 활동을 분기 목표로 만들기"] },
  정관: { kind: "opportunity", title: "신뢰와 평판이 올라가는 시기",
    mistake: "겸손이 지나쳐 인정받을 기회를 사양합니다.",
    flip: ["공식 평가·승진·자격 기회에 적극 지원", "성과를 정리해 윗사람에게 공유", "약속과 마감을 철저히 지켜 신뢰를 축적"] },
  정인: { kind: "opportunity", title: "귀인과 배움이 찾아오는 시기",
    mistake: "도움을 받고도 표현하지 않아 인연이 끊깁니다.",
    flip: ["멘토·선배에게 구체적 질문 보내기", "문서·시험·부동산 일정 점검", "받은 도움을 다시 나누는 작은 행동하기"] },
};

export function crisisCards(chart: SajuChart, an: Analysis, yf: YearFortune, now = new Date()): CrisisCard[] {
  const cards: CrisisCard[] = [];
  const dw = currentDaewoon(chart, now);

  if (dw && isChung(chart.day.branch, dw.pillar.branch)) {
    cards.push({
      id: "dw-chung", kind: "crisis", title: "삶의 기반이 바뀌는 대운의 충",
      signal: "현재 대운이 일지(배우자궁·생활 기반)와 충돌합니다.",
      mistake: "변화를 거부하고 같은 방식을 고집하다 관계·거주·직업에서 소모됩니다.",
      flip: ["거주·직업·관계 중 바꿀 한 가지를 정해 작게 실험하기", "큰 결정은 시간을 두고 두 번 확인하기", "변화 일지를 쓰며 얻는 것과 잃는 것을 함께 기록하기"],
      evidence: [`현재 대운 ${pillarName(dw.pillar)}(${dw.startAge}~${dw.endAge}세)의 지지 ${BRANCHES[dw.pillar.branch]}와 일지 ${BRANCHES[chart.day.branch]}가 충`],
    });
  }
  if (isChung(chart.year.branch, yf.yearPillar.branch)) {
    cards.push({
      id: "year-chung", kind: "crisis", title: "환경이 흔들리는 해(세운 충)",
      signal: `${yf.year}년 ${pillarName(yf.yearPillar)}년의 지지가 태어난 해의 띠와 충합니다.`,
      mistake: "이사·이직·인간관계 변동을 불안으로만 받아들이고 준비 없이 휩쓸립니다.",
      flip: ["상반기에 큰 변화(이동·이직)를 계획적으로 정리하기", "비상 자금 3개월치 확보", "새 환경에서 쓸 기술 하나를 미리 배우기"],
      evidence: [`세운 ${BRANCHES[yf.yearPillar.branch]}와 연지 ${BRANCHES[chart.year.branch]}가 충`],
    });
  }
  const yearCard = GOD_CARD[yf.god];
  if (yearCard) {
    cards.push({
      id: `year-${yf.god}`, ...yearCard,
      signal: `${yf.year}년은 나에게 ${yf.god}의 해입니다.`,
      evidence: [`일간 ${STEMS[an.dm]} 기준 세운 천간이 ${yf.god}`],
    });
  }
  if (dw) {
    const dwCard = GOD_CARD[dw.god];
    if (dwCard && dw.god !== yf.god) {
      cards.push({
        id: `dw-${dw.god}`, ...dwCard,
        signal: `지금 10년 대운(${dw.startAge}~${dw.endAge}세)은 ${dw.god}의 흐름입니다.`,
        evidence: [`현재 대운 ${pillarName(dw.pillar)} — 일간 기준 ${dw.god}`],
      });
    }
  }
  if (!cards.some((c) => c.kind === "opportunity")) {
    cards.push({
      id: "yongsin", kind: "opportunity", title: `용신 ${ELEMENTS[an.yongsin]}의 기운 채우기`,
      signal: "특별한 충돌이 적은 안정적인 시기입니다. 부족한 오행을 채워 균형을 키우세요.",
      mistake: "평온함에 안주해 성장 기회를 놓칩니다.",
      flip: [`${ELEMENTS[an.yongsin]}과 관련된 색·방향·활동을 일상에 한 가지 넣기`, "6개월 안에 이룰 목표 하나를 정하고 공개하기", "새로운 사람을 한 달에 한 명 만나기"],
      evidence: [`용신 후보 ${ELEMENTS[an.yongsin]}(오행 분포에서 부족한 기운)`],
    });
  }
  return cards.slice(0, 4);
}

// ───────── 분기별 로드맵 ─────────
const GOD_ACTION: Record<TenGod, { todo: string; avoid: string }> = {
  비견: { todo: "협력·동업 제안 검토, 독립 준비", avoid: "고집으로 인한 충돌" },
  겁재: { todo: "지출 통제, 자산 방어", avoid: "보증·동업·충동 투자" },
  식신: { todo: "창작·발표·건강 루틴", avoid: "게으름과 과식" },
  상관: { todo: "아이디어 실행, 콘텐츠 제작", avoid: "직설적 발언, 규칙 위반" },
  편재: { todo: "영업·네트워킹·투자 공부", avoid: "분산과 무기록 지출" },
  정재: { todo: "수입 안정, 저축·계약", avoid: "안주와 소심한 투자" },
  편관: { todo: "어려운 과제 도전, 체력 관리", avoid: "과로와 무리한 약속" },
  정관: { todo: "승진·지원·공식 평가", avoid: "겸손이 과한 사양" },
  편인: { todo: "공부·자격·내면 정리", avoid: "시작 미루기, 고립" },
  정인: { todo: "멘토·문서·시험 준비", avoid: "도움받고 연락 끊기" },
};

export interface Quarter {
  label: string;
  months: string;
  score: number;
  headline: string;
  todo: string;
  avoid: string;
  evidence: string;
}

export function quarterRoadmap(yf: YearFortune): Quarter[] {
  return [0, 1, 2, 3].map((q) => {
    const ms = yf.months.slice(q * 3, q * 3 + 3);
    const score = Math.round(ms.reduce((a, m) => a + m.score, 0) / 3);
    const top = [...ms].sort((a, b) => b.score - a.score)[0];
    const low = [...ms].sort((a, b) => a.score - b.score)[0];
    const act = GOD_ACTION[top.god];
    return {
      label: `${q + 1}분기`,
      months: `${q * 3 + 1}~${q * 3 + 3}월`,
      score,
      headline: `${top.month}월(${top.keyword})에 힘이 실리고, ${low.month}월(${low.keyword})은 속도 조절`,
      todo: act.todo,
      avoid: GOD_ACTION[low.god].avoid,
      evidence: ms.map((m) => `${m.month}월 ${pillarName(m.pillar)}(${m.god} ${m.score})`).join(" · "),
    };
  });
}

// ───────── 달도령의 한마디 ─────────
export function dodlyeongSay(chart: SajuChart, an: Analysis, lenses: Lens[]): string {
  const dm = DAY_MASTER[an.dm];
  const name = chart.input.name || "그대";
  const lens = lenses[0];
  return `${name}의 일간은 ${dm.title}이로군요. ${lens ? lens.insight.split(". ")[0] + "." : ""} 이 근거가 궁금하다면 아래 풀이를 차근히 보시지요.`;
}

export function targetYear(now = new Date()): number {
  return now.getMonth() >= 9 ? now.getFullYear() + 1 : now.getFullYear();
}

export { yearFortune, tenGod };
