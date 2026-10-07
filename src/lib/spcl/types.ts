export type SpclKey = "S" | "P" | "C" | "L";

export const SPCL_META: Record<SpclKey, { name: string; ko: string; question: string; color: string }> = {
  S: { name: "Status", ko: "자격", question: "이 콘텐츠는 내가 왜 이 이야기를 할 자격이 있는지 보여주는가?", color: "bg-violet-600" },
  P: { name: "Power", ko: "따라하기", question: "이걸 본 사람이 실제로 따라 해서 결과를 얻을 수 있는가?", color: "bg-emerald-600" },
  C: { name: "Credibility", ko: "증거", question: "내 말을 뒷받침할 증거가 있는가?", color: "bg-sky-600" },
  L: { name: "Likeness", ko: "나다움", question: "이 콘텐츠를 보고 사람들이 나라는 사람을 조금 더 알게 되는가?", color: "bg-rose-600" },
};

export const SPCL_KEYS: SpclKey[] = ["S", "P", "C", "L"];

export type Industry = "tax" | "medical" | "consulting" | "other";

export const INDUSTRY_LABEL: Record<Industry, string> = {
  tax: "세무사·회계사",
  medical: "의사·병원",
  consulting: "컨설턴트·교육",
  other: "기타 전문직·사업가",
};

export interface PlannerInput {
  industry: Industry;
  target: string; // 내 고객
  experience: string; // 내가 해본 일·성과
  proof: string; // 보유 증거(후기·수치)
  values: string; // 가치관·실패담
  perWeek: number; // 주간 발행 수
}

export interface Idea {
  key: SpclKey;
  title: string;
  hook: string;
  steps: string[];
  cta: string;
}

export interface CalendarItem {
  day: string;
  idea: Idea;
}

export interface Warning {
  key: SpclKey;
  message: string;
}

export interface PlanResult {
  ideas: Record<SpclKey, Idea[]>;
  calendar: CalendarItem[];
  warnings: Warning[];
}

export const DEFAULT_INPUT: PlannerInput = {
  industry: "tax",
  target: "",
  experience: "",
  proof: "",
  values: "",
  perWeek: 7,
};
