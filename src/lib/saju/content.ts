import type { Analysis, SajuChart, TenGod } from "./core";
import { BRANCHES, BRANCHES_HANJA, ELEMENTS, ELEMENT_COLOR_NAMES, ELEMENT_DIRECTIONS, STEMS, STEMS_HANJA, godGroup } from "./core";

export const BRAND = {
  name: "운명서랍",
  tagline: "가입 없이, 결제 없이, 만세력부터 대운까지 무료로",
  // TODO(사용자 확인 필요): 실제 상담 연락처/브랜드명
  consultPhone: "010-0000-0000",
};

/** 일간별 기본 성향 (10천간) */
export const DAY_MASTER: { title: string; image: string; text: string }[] = [
  { title: "큰 나무 갑목", image: "곧게 뻗은 아름드리 나무", text: "리더십과 추진력이 강하고 정직합니다. 굽히기 싫어하는 자존심이 장점이자 약점이며, 목표가 서면 끝까지 밀고 나갑니다." },
  { title: "풀꽃 을목", image: "바위틈에서도 피는 덩굴과 꽃", text: "유연하고 적응력이 뛰어납니다. 부드러운 인간관계로 길을 열지만, 눈치를 보다 속마음을 숨기기도 합니다." },
  { title: "태양 병화", image: "모두를 비추는 한낮의 태양", text: "밝고 열정적이며 숨김이 없습니다. 사람을 끌어당기는 에너지가 있으나 성급함과 식기 쉬운 열정을 관리해야 합니다." },
  { title: "촛불 정화", image: "어둠 속 따뜻한 촛불", text: "섬세하고 따뜻하며 집중력이 깊습니다. 헌신적이고 예민해서 감정 소모가 크니 스스로를 돌보는 시간이 필요합니다." },
  { title: "큰 산 무토", image: "묵직하게 자리를 지키는 산", text: "믿음직하고 포용력이 큽니다. 한번 마음먹으면 변하지 않는 신중함이 강점이며, 변화에 느린 점을 의식하세요." },
  { title: "논밭 기토", image: "모든 것을 키워내는 기름진 흙", text: "현실적이고 실속 있으며 사람을 잘 챙깁니다. 속으로 걱정을 많이 하니 결정을 미루지 않는 연습이 도움이 됩니다." },
  { title: "바위·쇠 경금", image: "단단한 원석과 칼", text: "의리와 결단력이 강하고 정의감이 뚜렷합니다. 직설적인 표현이 상처를 줄 수 있으니 부드러운 말투가 운을 키웁니다." },
  { title: "보석 신금", image: "다듬어진 보석", text: "예리하고 완벽주의적이며 감각이 뛰어납니다. 자존심이 강하고 상처를 오래 간직하니 인정받는 환경을 찾으세요." },
  { title: "큰 강물 임수", image: "넓게 흐르는 강과 바다", text: "지혜롭고 스케일이 큽니다. 자유로운 영혼으로 아이디어와 적응력이 좋지만 마무리와 일관성을 챙기면 크게 성공합니다." },
  { title: "이슬·비 계수", image: "스며드는 이슬과 봄비", text: "직관과 감수성이 뛰어나고 조용히 깊이 파고듭니다. 생각이 많아 걱정이 늘 수 있으니 실행으로 옮기는 습관이 중요합니다." },
];

export const ELEMENT_TRAIT = [
  "성장·계획·시작의 기운. 부족하면 추진력이 약하고, 넘치면 고집이 세집니다.",
  "열정·표현·인기의 기운. 부족하면 의욕이 식고, 넘치면 성급하고 감정 기복이 큽니다.",
  "신뢰·중재·안정의 기운. 부족하면 중심이 흔들리고, 넘치면 변화가 둔해집니다.",
  "결단·원칙·마무리의 기운. 부족하면 우유부단하고, 넘치면 날카롭고 냉정해집니다.",
  "지혜·유연·저장의 기운. 부족하면 융통성과 휴식이 모자라고, 넘치면 생각이 많아집니다.",
];

const GROUP_TEXT = {
  peer: ["자립심·주관", "형제·동료 인연, 독립적인 성향이 강합니다."],
  output: ["표현·재능·기술", "말과 재주로 먹고사는 힘, 창의성과 서비스 감각이 있습니다."],
  wealth: ["재물·현실감각", "돈의 흐름을 읽고 현실적 성과를 만드는 힘입니다."],
  officer: ["직장·명예·책임", "조직 안에서 인정받고 책임을 지는 힘입니다."],
  resource: ["학문·귀인·안정", "배움과 윗사람의 도움, 정서적 안정의 힘입니다."],
} as const;

export function godSummary(an: Analysis) {
  const groups: Record<keyof typeof GROUP_TEXT, number> = { peer: 0, output: 0, wealth: 0, officer: 0, resource: 0 };
  for (const [g, n] of Object.entries(an.godCounts)) groups[godGroup(g as TenGod)] += n;
  return (Object.keys(groups) as (keyof typeof GROUP_TEXT)[])
    .map((k) => ({ key: k, count: groups[k], title: GROUP_TEXT[k][0], text: GROUP_TEXT[k][1] }))
    .sort((a, b) => b.count - a.count);
}

export function freeSummary(chart: SajuChart, an: Analysis) {
  const dm = DAY_MASTER[an.dm];
  const gs = godSummary(an);
  const top = gs[0], low = gs[gs.length - 1];
  return {
    headline: `${chart.input.name || "당신"}은(는) ${dm.title}(${STEMS[an.dm]}·${STEMS_HANJA[an.dm]}) — ${dm.image}`,
    personality: dm.text,
    balance: `오행은 ${ELEMENTS[an.strongest]}이(가) 가장 강하고 ${ELEMENTS[an.weakest]}이(가) 가장 약합니다. 일간 힘은 ${an.strength}점으로 ${an.strong ? "신강(身強)" : "신약(身弱)"} 쪽입니다.`,
    strengthTxt: `가장 두드러진 힘은 「${top.title}」: ${top.text}`,
    cautionTxt: `상대적으로 약한 힘은 「${low.title}」: 의식적으로 보완하면 운의 균형이 좋아집니다.`,
    lucky: `행운 오행은 ${ELEMENTS[an.yongsin]} — ${ELEMENT_COLOR_NAMES[an.yongsin]} 계열 색, ${ELEMENT_DIRECTIONS[an.yongsin]} 방향이 도움이 됩니다.`,
  };
}

/** 잠금 해제형 심층 섹션 (스트릭 또는 상담 신청으로 열림) */
export function deepSections(chart: SajuChart, an: Analysis) {
  const gs = godSummary(an);
  const c = (k: keyof typeof GROUP_TEXT) => gs.find((g) => g.key === k)!.count;
  const dm = DAY_MASTER[an.dm];
  return [
    {
      id: "money", title: "재물운 심층", unlockStreak: 3,
      body: `재성(재물) 기운 ${c("wealth")}점, 식상(재능→돈) ${c("output")}점. ${
        c("wealth") >= 3 ? "돈이 들어오는 길은 넓지만 새기 쉬우니 자동이체 저축 구조가 핵심입니다."
        : c("output") >= 3 ? "재능과 기술로 수입을 만드는 타입입니다. 개인 브랜딩·프리랜스·콘텐츠에 유리합니다."
        : "월급형 안정 수입이 맞고, 큰 한 방보다 복리형 축적이 유리합니다."} 용신 ${ELEMENTS[an.yongsin]} 업종(${["교육·출판·의류", "미디어·외식·뷰티", "부동산·농업·중개", "금융·기계·IT", "유통·물류·여행"][an.yongsin]})이 잘 맞습니다.`,
    },
    {
      id: "love", title: "연애·결혼운 심층", unlockStreak: 7,
      body: `배우자궁(일지)은 ${BRANCHES[chart.day.branch]}(${BRANCHES_HANJA[chart.day.branch]})이며 ${dm.title} 성향상 ${an.strong ? "주도권을 쥐려는 경향이 있어 상대의 속도를 존중하는 것이 관건" : "상대에게 많이 맞춰주는 경향이 있어 내 의사를 분명히 말하는 것이 관건"}입니다. ${
        chart.input.gender === "M" ? "남성 사주에서 재성은 배우자 인연" : "여성 사주에서 관성은 배우자 인연"
      }을 뜻하며 현재 해당 기운은 ${chart.input.gender === "M" ? c("wealth") : c("officer")}점입니다.`,
    },
    {
      id: "career", title: "직업·적성 심층", unlockStreak: 14,
      body: `관성 ${c("officer")}점, 식상 ${c("output")}점, 인성 ${c("resource")}점. ${
        c("officer") >= 3 ? "조직·공직·전문직에서 직함을 쌓는 길이 맞습니다."
        : c("output") >= 3 ? "창작·기획·교육·서비스처럼 결과물을 보여주는 직업이 맞습니다."
        : c("resource") >= 3 ? "연구·교육·자격 기반 직업에서 신뢰를 쌓습니다."
        : "사람과 일을 연결하는 영업·사업형 역할에서 힘이 납니다."}`,
    },
  ];
}

/** 제휴/광고 카드 — 실제 파트너 확정 시 데이터만 교체 */
export const PARTNERS = [
  { id: "name", title: "사주 기반 작명·개명", desc: "용신 오행을 반영한 이름 추천 (제휴 예정)", href: "/saju/book?topic=작명" },
  { id: "talisman", title: "행운 오행 소품", desc: "내 용신 색·소재로 고르는 팔찌·소품 (제휴 예정)", href: "/saju/book?topic=소품" },
  { id: "consult", title: "명리 상담사 1:1", desc: "리포트를 들고 전문가와 15분 상담", href: "/saju/book?topic=상담" },
];

export const FAQ = [
  { q: "정말 무료인가요? 가입이 필요한가요?", a: "만세력·오행·십성·대운·오늘의 운세·신년운세·궁합은 가입 없이 전부 무료입니다. 유료는 상담사가 직접 작성하는 심층 리포트와 1:1 상담뿐이며, 결제 연동 전까지는 신청만 받습니다." },
  { q: "내 생년월일이 서버에 저장되나요?", a: "아니요. 계산은 브라우저 안에서 이뤄지고 저장도 이 기기의 localStorage에만 됩니다. 공유 링크를 만들면 링크 안에 입력값이 들어가니 공유 범위에 유의하세요." },
  { q: "만세력은 어떤 기준으로 계산하나요?", a: "태양의 황경을 계산해 입춘(315°)을 연주, 12절기(節)를 월주 경계로 삼는 절기력 기준입니다. 23시 이후는 다음 날 자시로 봅니다. 진태양시 보정(−30분)을 선택할 수 있습니다." },
  { q: "토정비결은 어떻게 다른가요?", a: "전통 토정비결(144괘)의 원문은 사용하지 않습니다. 대신 올해 세운(歲運)과 월운(月運)을 내 일간 기준으로 풀어 12개월 흐름을 보여줍니다." },
  { q: "결과를 믿어도 되나요?", a: "명리학은 오락·자기이해 및 참고용입니다. 건강·법률·투자 같은 중요한 결정은 전문가와 상의하세요." },
];
