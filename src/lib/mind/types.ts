export type MoodKey = "great" | "good" | "okay" | "low" | "bad";

export interface CheckIn {
  id: string;
  mood: MoodKey;
  /** 0-10: 우울/가라앉음 */
  depression: number;
  /** 0-10: 불안/긴장 */
  anxiety: number;
  bodyParts: string[];
  note: string;
  createdAt: string;
}

export interface ThoughtRecord {
  id: string;
  situation: string;
  thought: string;
  emotions: string[];
  intensityBefore: number;
  distortionIds: string[];
  evidenceAgainst: string;
  reframe: string;
  intensityAfter: number;
  createdAt: string;
}

export interface ValueArea {
  id: string;
  label: string;
  emoji: string;
}

export interface ValueItem {
  id: string;
  areaId: string;
  text: string;
  /** 이번 주 가치 행동 횟수 / 목표 */
  done: number;
  goal: number;
  /** 0-10: 이 가치가 나에게 얼마나 중요한가 */
  importance: number;
  weekKey: string;
}

export interface MeditationLog {
  id: string;
  programId: string;
  seconds: number;
  createdAt: string;
}

export interface PieEntry {
  id: string;
  claim: string;
  factors: { label: string; percent: number }[];
  createdAt: string;
}

export interface Distortion {
  id: string;
  name: string;
  summary: string;
  question: string;
  keywords: string[];
}

export interface CoachMessage {
  id: string;
  tone: "warm" | "nudge" | "celebrate";
  text: string;
  href?: string;
  cta?: string;
}
