import { bankFor } from "./templates";
import {
  SPCL_KEYS,
  SPCL_META,
  type CalendarItem,
  type Idea,
  type PlanResult,
  type PlannerInput,
  type SpclKey,
  type Warning,
} from "./types";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const IDEAS_PER_KEY = 5;

function fill(text: string, input: PlannerInput): string {
  return text
    .replaceAll("{t}", input.target.trim() || "내 고객")
    .replaceAll("{x}", firstLine(input.experience) || "내가 해본 일")
    .replaceAll("{p}", firstLine(input.proof) || "확인 가능한 숫자")
    .replaceAll("{v}", firstLine(input.values) || "나는 이런 기준으로 일합니다");
}

function firstLine(s: string): string {
  return s.trim().split("\n")[0]?.trim() ?? "";
}

export function generatePlan(input: PlannerInput): PlanResult {
  const bank = bankFor(input.industry);
  const ideas = {} as Record<SpclKey, Idea[]>;
  for (const key of SPCL_KEYS) {
    ideas[key] = bank[key].slice(0, IDEAS_PER_KEY).map((t) => ({
      key,
      title: fill(t.title, input),
      hook: fill(t.hook, input),
      steps: t.steps.map((s) => fill(s, input)),
      cta: fill(t.cta, input),
    }));
  }

  return { ideas, calendar: buildCalendar(ideas, input.perWeek), warnings: checkGaps(input) };
}

// 주간 발행 수에 맞춰 S/P/C/L을 번갈아 배치합니다. Power(따라하기)를 가장 먼저 채워 비중을 높입니다.
const ORDER: SpclKey[] = ["P", "S", "P", "C", "L", "P", "S"];

function buildCalendar(ideas: Record<SpclKey, Idea[]>, perWeek: number): CalendarItem[] {
  const count = Math.min(Math.max(perWeek, 1), 21);
  const used: Record<SpclKey, number> = { S: 0, P: 0, C: 0, L: 0 };
  const items: CalendarItem[] = [];
  for (let i = 0; i < count; i++) {
    const key = ORDER[i % ORDER.length];
    const pool = ideas[key];
    items.push({ day: DAYS[i % 7], idea: pool[used[key]++ % pool.length] });
  }
  return items;
}

function checkGaps(input: PlannerInput): Warning[] {
  const w: Warning[] = [];
  if (input.experience.trim().length < 10)
    w.push({ key: "S", message: "실제로 해본 일·성과를 더 구체적으로 적어주세요. 전문성 설명보다 경험 사례가 Status를 만듭니다." });
  if (input.proof.trim().length < 5)
    w.push({ key: "C", message: "후기·수치·전후 비교 같은 증거가 비어 있습니다. 주장은 줄이고 증거를 먼저 모으세요." });
  if (input.values.trim().length < 5)
    w.push({ key: "L", message: "가치관·실패담이 비어 있습니다. 정보 뒤에 숨지 말고 '나'를 보여주세요." });
  if (input.target.trim().length < 2)
    w.push({ key: "P", message: "타깃 고객이 비어 있습니다. 콘텐츠 자체가 타겟팅이므로 고객을 먼저 정하세요." });
  return w;
}

export function planToText(plan: PlanResult): string {
  const lines: string[] = ["# SPCL 콘텐츠 플랜", ""];
  for (const key of SPCL_KEYS) {
    lines.push(`## ${SPCL_META[key].name} (${SPCL_META[key].ko})`);
    for (const idea of plan.ideas[key]) {
      lines.push(`- ${idea.title}`, `  훅: ${idea.hook}`, `  구성: ${idea.steps.join(" → ")}`, `  CTA: ${idea.cta}`);
    }
    lines.push("");
  }
  lines.push("## 주간 캘린더");
  for (const c of plan.calendar) lines.push(`- ${c.day} [${c.idea.key}] ${c.idea.title}`);
  return lines.join("\n");
}
