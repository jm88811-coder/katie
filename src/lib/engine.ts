import { FounderProfile, MBTI } from "@/lib/types";
import { JOURNEY_STEPS } from "@/lib/data/steps";

interface MbtiArchetype {
  label: string;
  strength: string;
  watchout: string;
  focusStepId: string;
}

const MBTI_ARCHETYPES: Record<MBTI, MbtiArchetype> = {
  INTJ: { label: "전략 설계형", strength: "장기 비전과 시스템 설계에 강하다.", watchout: "완벽한 계획을 기다리다 실행이 늦어질 수 있다.", focusStepId: "step1" },
  INTP: { label: "아이디어 탐구형", strength: "새로운 개념과 구조를 빠르게 이해한다.", watchout: "아이디어에 머물고 실행/영업으로 잘 넘어가지 않을 수 있다.", focusStepId: "step6" },
  ENTJ: { label: "추진 리더형", strength: "목표를 정하면 팀과 자원을 빠르게 조직한다.", watchout: "속도를 우선하다 현금흐름·리스크 점검을 놓칠 수 있다.", focusStepId: "step7" },
  ENTP: { label: "확산 실험형", strength: "새로운 기회를 빠르게 포착하고 실험한다.", watchout: "여러 아이템에 손대다 하나도 시스템화하지 못할 수 있다.", focusStepId: "step6" },
  INFJ: { label: "가치 중심형", strength: "고객의 숨은 문제를 깊이 공감해서 찾아낸다.", watchout: "완벽한 의미/가치를 좇다 출시가 늦어질 수 있다.", focusStepId: "step1" },
  INFP: { label: "스토리텔러형", strength: "브랜드에 진정성 있는 스토리를 담는 힘이 있다.", watchout: "숫자·현금흐름 관리를 소홀히 할 수 있다.", focusStepId: "step7" },
  ENFJ: { label: "커뮤니티 빌더형", strength: "사람을 모으고 동기부여하는 데 강하다.", watchout: "타인의 인정에 의사결정이 흔들릴 수 있다.", focusStepId: "step1" },
  ENFP: { label: "영감형 창시자", strength: "새로운 관계와 기회를 빠르게 만들어낸다.", watchout: "루틴·반복 업무 지속이 어려울 수 있다.", focusStepId: "step4" },
  ISTJ: { label: "시스템 운영형", strength: "체계와 절차를 꼼꼼히 지키고 실행한다.", watchout: "변화하는 시장에 대응이 늦을 수 있다.", focusStepId: "step3" },
  ISFJ: { label: "신뢰 기반형", strength: "고객 응대와 디테일 관리에 강하다.", watchout: "위임을 못 하고 혼자 다 떠안을 수 있다.", focusStepId: "step2" },
  ESTJ: { label: "운영 관리형", strength: "조직과 프로세스를 효율적으로 관리한다.", watchout: "새로운 시도보다 기존 방식을 고수할 수 있다.", focusStepId: "step3" },
  ESFJ: { label: "관계 영업형", strength: "고객·파트너와의 관계 구축이 자연스럽다.", watchout: "숫자보다 관계를 우선해 손해를 볼 수 있다.", focusStepId: "step7" },
  ISTP: { label: "문제 해결형", strength: "실용적인 해결책을 빠르게 만들어낸다.", watchout: "장기 브랜드/마케팅 전략에 소홀할 수 있다.", focusStepId: "step5" },
  ISFP: { label: "감각 장인형", strength: "제품/서비스의 완성도와 디테일에 강하다.", watchout: "확장·위임보다 혼자 만드는 것을 선호할 수 있다.", focusStepId: "step2" },
  ESTP: { label: "실행 스프린터형", strength: "빠른 실행과 현장 대응력이 강점이다.", watchout: "장기 계획과 리스크 관리가 약할 수 있다.", focusStepId: "step7" },
  ESFP: { label: "무대 위 크리에이터형", strength: "콘텐츠/퍼포먼스로 주목을 끄는 데 강하다.", watchout: "반복 업무 시스템화에 흥미를 잃기 쉽다.", focusStepId: "step4" },
  모름: { label: "탐색형", strength: "아직 강점이 명확히 드러나지 않았지만 그만큼 유연하다.", watchout: "먼저 자의식/정체성 단계부터 차근히 점검해야 한다.", focusStepId: "step1" },
};

interface KeywordRule {
  keywords: string[];
  stepId: string;
  note: string;
}

const KEYWORD_RULES: KeywordRule[] = [
  { keywords: ["완벽", "미루", "두려", "자신없", "실패할까"], stepId: "step1", note: "완벽주의/두려움 패턴이 보인다. 1장(자의식 해체)의 MVP 2주 출시 훈련이 먼저다." },
  { keywords: ["직장", "퇴사", "눈치", "상사", "월급"], stepId: "step2", note: "직장인 정체성이 강하게 남아있다. 2장(정체성 변화)에서 정체성 선언문부터 다시 써보자." },
  { keywords: ["돈", "투자", "손실", "빚", "자금"], stepId: "step7", note: "자금/현금흐름에 대한 경험이 두드러진다. 7장(부의 그릇)에서 현금흐름 관리부터 점검하자." },
  { keywords: ["팀", "직원", "혼자", "위임", "동업"], stepId: "step4", note: "협업/위임 경험이 중요한 축이다. 4장(뇌 자동화)과 위임 루틴을 함께 설계하자." },
  { keywords: ["마케팅", "고객", "안팔", "매출", "홍보"], stepId: "step5", note: "세일즈/마케팅 관련 이슈가 보인다. 5장(역행자의 지식) 중 설득/세일즈 영역을 먼저 학습하자." },
  { keywords: ["아이템", "아이디어", "뭘 팔", "아이템선정"], stepId: "step6", note: "아이템 선정이 핵심 과제다. 6장의 4대 기준으로 후보를 채점해보자." },
];

export interface ProfileAnalysis {
  archetypeName: string;
  strength: string;
  watchout: string;
  recommendedStepIds: string[];
  coachNotes: string[];
}

function extractText(profile: FounderProfile): string {
  return [profile.failureStory, profile.successStory, profile.direction, profile.purpose, profile.goal]
    .join(" ")
    .toLowerCase();
}

function directionModifier(profile: FounderProfile): string | null {
  const text = extractText(profile);
  if (/(세계|글로벌|해외|수출)/.test(text)) return "글로벌 확장형";
  if (/(동네|지역|로컬|골목)/.test(text)) return "로컬 밀착형";
  if (/(취미|좋아하는|덕후|덕업)/.test(text)) return "덕업일치형";
  if (/(가족|부모|자녀|육아)/.test(text)) return "가족 중심형";
  if (/(환경|지속가능|기후)/.test(text)) return "임팩트 지향형";
  return null;
}

export function analyzeProfile(profile: FounderProfile): ProfileAnalysis {
  const archetype = MBTI_ARCHETYPES[profile.mbti] ?? MBTI_ARCHETYPES["모름"];
  const modifier = directionModifier(profile);
  const archetypeName = modifier
    ? `${modifier} · ${archetype.label}`
    : archetype.label;

  const text = extractText(profile);
  const scores = new Map<string, number>();
  const coachNotes: string[] = [];

  for (const rule of KEYWORD_RULES) {
    const hit = rule.keywords.some((k) => text.includes(k));
    if (hit) {
      scores.set(rule.stepId, (scores.get(rule.stepId) ?? 0) + 1);
      coachNotes.push(rule.note);
    }
  }

  // MBTI 기본 추천 단계는 항상 포함(가중치 낮게)
  scores.set(archetype.focusStepId, (scores.get(archetype.focusStepId) ?? 0) + 0.5);

  const sortedStepIds = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([stepId]) => stepId);

  const recommendedStepIds =
    sortedStepIds.length > 0
      ? sortedStepIds.slice(0, 2)
      : [JOURNEY_STEPS[0].id];

  if (coachNotes.length === 0) {
    coachNotes.push(
      `${profile.name}님의 이야기를 더 채울수록 코칭이 정교해진다. 우선 ${archetype.label} 성향에 맞춰 1장부터 시작하자.`
    );
  }

  return {
    archetypeName,
    strength: archetype.strength,
    watchout: archetype.watchout,
    recommendedStepIds,
    coachNotes,
  };
}

export interface ConsultMatch {
  matchedStepIds: string[];
  advices: string[];
}

const FALLBACK_ADVICES = [
  "이 문제를 오늘 처음 겪는다면, 나는 어떤 첫 행동을 선택할까?",
  "이 문제는 감정 때문에 커 보이는가, 데이터로 봐도 심각한가?",
  "이 문제를 해결하지 않고 2주가 지나면 무슨 일이 생기는가? (급하지 않다면 다음으로 미뤄도 된다)",
];

export function matchConsultAdvice(problemText: string): ConsultMatch {
  const text = problemText.toLowerCase();
  const matchedStepIds = new Set<string>();
  const advices: string[] = [];

  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((k) => text.includes(k))) {
      matchedStepIds.add(rule.stepId);
      advices.push(rule.note);
    }
  }

  if (advices.length === 0) {
    return { matchedStepIds: [], advices: FALLBACK_ADVICES };
  }

  return { matchedStepIds: [...matchedStepIds], advices };
}
