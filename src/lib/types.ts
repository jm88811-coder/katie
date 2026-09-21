export type MBTI =
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP"
  | "모름";

export interface FounderProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm, optional
  mbti: MBTI;
  failureStory: string;
  successStory: string;
  direction: string; // 지향점
  purpose: string; // 목적
  goal: string; // 목표
  createdAt: string;
}

export interface StepTask {
  id: string;
  label: string;
}

export interface JourneyStep {
  id: string; // e.g. "step1"
  order: number;
  title: string;
  subtitle: string;
  summary: string;
  keyPoints: string[];
  tasks: StepTask[];
  reflectionPrompt: string;
  relatedInspirationTags: string[];
}

export interface InspirationItem {
  id: string;
  category: string;
  title: string;
  description: string;
  relatedStepIds: string[];
  tags: string[];
}

export interface UserInspirationNote {
  id: string;
  text: string;
  isIdeaCandidate: boolean;
  createdAt: string;
}

export interface TaxLegalItem {
  id: string;
  stage: string;
  title: string;
  description: string;
  caution: string;
}

export interface StudyTopic {
  id: string;
  label: string;
  detail: string;
}

export interface StudyCategory {
  id: string;
  title: string;
  description: string;
  topics: StudyTopic[];
}

export interface AiJob {
  id: string;
  title: string;
  why: string;
  prepare: string;
}

export interface ConsultEntry {
  id: string;
  problemText: string;
  matchedStepIds: string[];
  advices: string[];
  createdAt: string;
}

export interface JourneyProgress {
  [stepId: string]: {
    completedTaskIds: string[];
    reflectionNote: string;
  };
}
