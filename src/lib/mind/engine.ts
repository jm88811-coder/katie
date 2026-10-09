import { CRISIS_KEYWORDS, DISTORTIONS, MOODS, VALUE_AREAS } from "./data";
import type {
  CheckIn,
  CoachMessage,
  MeditationLog,
  ThoughtRecord,
  ValueItem,
} from "./types";

const squash = (s: string) => s.replace(/\s+/g, "");

/** 자유 서술에서 인지왜곡 후보를 찾아 id 목록으로 반환 (규칙 기반). */
export function detectDistortions(text: string): string[] {
  const flat = squash(text);
  if (!flat) return [];
  return DISTORTIONS.filter((d) =>
    d.keywords.some((k) => flat.includes(squash(k)))
  ).map((d) => d.id);
}

/** 위기 신호 키워드 포함 여부. 어디서든 입력 즉시 안전망을 띄우는 데 사용. */
export function detectCrisis(...texts: string[]): boolean {
  const flat = squash(texts.join(" "));
  return CRISIS_KEYWORDS.some((k) => flat.includes(squash(k)));
}

export function dayKey(d: Date | string = new Date()): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 월요일 시작 기준 주 키 (해당 주 월요일 날짜). */
export function weekKey(d: Date = new Date()): string {
  const date = new Date(d);
  const diff = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - diff);
  return dayKey(date);
}

export function moodScore(mood: CheckIn["mood"]): number {
  return MOODS.find((m) => m.key === mood)?.score ?? 3;
}

export function streakDays(dates: string[]): number {
  const days = new Set(dates.map((d) => dayKey(d)));
  let streak = 0;
  const cursor = new Date();
  // 오늘 기록이 없어도 어제까지 이어진 연속은 인정
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function topCounts(items: string[], limit = 3) {
  const map = new Map<string, number>();
  items.forEach((i) => map.set(i, (map.get(i) ?? 0) + 1));
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

export interface Insights {
  recordCount: number;
  avgRelief: number | null;
  topDistortions: { id: string; name: string; count: number }[];
  topEmotions: { label: string; count: number }[];
  hardestSlot: string | null;
  bodyHotspot: string | null;
}

const slotOf = (iso: string) => {
  const h = new Date(iso).getHours();
  if (h < 6) return "새벽";
  if (h < 12) return "오전";
  if (h < 18) return "오후";
  return "저녁·밤";
};

/** 기록 전체에서 나만의 패턴을 뽑아내는 인사이트. */
export function buildInsights(records: ThoughtRecord[], checkIns: CheckIn[]): Insights {
  const relief = records
    .filter((r) => r.intensityBefore > 0)
    .map((r) => r.intensityBefore - r.intensityAfter);
  const avgRelief = relief.length
    ? Math.round((relief.reduce((a, b) => a + b, 0) / relief.length) * 10) / 10
    : null;

  const topDistortions = topCounts(records.flatMap((r) => r.distortionIds)).map(
    ([id, count]) => ({
      id,
      name: DISTORTIONS.find((d) => d.id === id)?.name ?? id,
      count,
    })
  );
  const topEmotions = topCounts(records.flatMap((r) => r.emotions)).map(
    ([label, count]) => ({ label, count })
  );

  const hard = checkIns.filter((c) => moodScore(c.mood) <= 2 || c.anxiety >= 7);
  const hardestSlot = hard.length ? topCounts(hard.map((c) => slotOf(c.createdAt)), 1)[0][0] : null;
  const body = topCounts(checkIns.flatMap((c) => c.bodyParts), 1);
  const bodyHotspot = body.length && body[0][1] >= 2 ? body[0][0] : null;

  return {
    recordCount: records.length,
    avgRelief,
    topDistortions,
    topEmotions,
    hardestSlot,
    bodyHotspot,
  };
}

/** 데이터 기반 코치 메시지 (LLM 연동 전 규칙 기반 코치). */
export function buildCoachMessages(input: {
  checkIns: CheckIn[];
  records: ThoughtRecord[];
  meditations: MeditationLog[];
  values: ValueItem[];
}): CoachMessage[] {
  const { checkIns, records, meditations, values } = input;
  const out: CoachMessage[] = [];
  const today = dayKey();
  const todayCheckIn = checkIns.find((c) => dayKey(c.createdAt) === today);

  if (!checkIns.length && !records.length) {
    out.push({
      id: "welcome",
      tone: "warm",
      text: "처음 오셨네요. 부담 갖지 말고, 오늘 마음 날씨부터 30초만 기록해 볼까요?",
      href: "/mind/checkin",
      cta: "체크인 하기",
    });
    return out;
  }

  if (!todayCheckIn) {
    out.push({
      id: "checkin",
      tone: "nudge",
      text: "오늘의 마음 날씨를 아직 기록하지 않았어요. 30초면 충분해요.",
      href: "/mind/checkin",
      cta: "체크인 하기",
    });
  } else if (moodScore(todayCheckIn.mood) <= 2 || todayCheckIn.anxiety >= 7) {
    out.push({
      id: "hard-day",
      tone: "warm",
      text: "오늘은 마음이 무거운 날이네요. 해결하려 하지 말고 먼저 호흡으로 몸을 가라앉혀 볼까요?",
      href: "/mind/sos",
      cta: "1분 호흡",
    });
  }

  const last = records[0];
  if (last && last.intensityBefore - last.intensityAfter >= 2) {
    out.push({
      id: "relief",
      tone: "celebrate",
      text: `최근 기록에서 감정 강도가 ${last.intensityBefore}에서 ${last.intensityAfter}로 낮아졌어요. 생각을 한 발 떨어져 본 덕분이에요.`,
    });
  }

  const insights = buildInsights(records, checkIns);
  const top = insights.topDistortions[0];
  if (top && top.count >= 2) {
    out.push({
      id: "pattern",
      tone: "nudge",
      text: `'${top.name}' 패턴이 ${top.count}번 나타났어요. 같은 생각 습관일 수 있어요. 다음엔 이름부터 붙여 보세요.`,
      href: "/mind/progress",
      cta: "패턴 보기",
    });
  }

  const week = weekKey();
  const thisWeek = values.filter((v) => v.weekKey === week);
  if (!values.length) {
    out.push({
      id: "values-start",
      tone: "nudge",
      text: "생각이 흔들릴 때 방향을 잡아 주는 건 '가치'예요. 나침반에서 소중한 영역을 골라 보세요.",
      href: "/mind/values",
      cta: "가치 나침반",
    });
  } else if (thisWeek.length && thisWeek.every((v) => v.done === 0)) {
    out.push({
      id: "values-act",
      tone: "nudge",
      text: "이번 주 가치 행동이 아직 0회예요. 가장 작은 행동 하나만 해 볼까요?",
      href: "/mind/values",
      cta: "행동 체크",
    });
  }

  const recentMed = meditations.some(
    (m) => Date.now() - new Date(m.createdAt).getTime() < 3 * 86400000
  );
  if (!recentMed) {
    out.push({
      id: "meditate",
      tone: "nudge",
      text: "최근 3일간 명상 훈련이 없었어요. 3분짜리 '생각의 하늘'은 어떨까요?",
      href: "/mind/meditate",
      cta: "명상하기",
    });
  }

  if (!out.length) {
    out.push({
      id: "steady",
      tone: "celebrate",
      text: "꾸준히 마음을 돌보고 계시네요. 지금 흐름 그대로 충분히 잘하고 있어요.",
    });
  }
  return out.slice(0, 3);
}

/** 상담사에게 보여줄 수 있는 텍스트 리포트. */
export function buildReport(input: {
  checkIns: CheckIn[];
  records: ThoughtRecord[];
  meditations: MeditationLog[];
  values: ValueItem[];
  days: number;
}): string {
  const since = Date.now() - input.days * 86400000;
  const inRange = <T extends { createdAt: string }>(xs: T[]) =>
    xs.filter((x) => new Date(x.createdAt).getTime() >= since);
  const checkIns = inRange(input.checkIns);
  const records = inRange(input.records);
  const meds = inRange(input.meditations);
  const insights = buildInsights(records, checkIns);

  const avg = (xs: number[]) =>
    xs.length ? (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1) : "-";

  const lines: string[] = [];
  lines.push(`[마음결 요약 리포트] 최근 ${input.days}일 · 작성일 ${dayKey()}`);
  lines.push("");
  lines.push(`■ 마음 날씨 체크인: ${checkIns.length}회`);
  lines.push(`  - 평균 우울 ${avg(checkIns.map((c) => c.depression))}/10 · 평균 불안 ${avg(checkIns.map((c) => c.anxiety))}/10`);
  if (insights.hardestSlot) lines.push(`  - 힘들었던 시간대: ${insights.hardestSlot}`);
  if (insights.bodyHotspot) lines.push(`  - 자주 느낀 신체 부위: ${insights.bodyHotspot}`);
  lines.push("");
  lines.push(`■ 생각기록지: ${records.length}건`);
  if (insights.avgRelief !== null) lines.push(`  - 기록 후 감정 강도 평균 ${insights.avgRelief}점 감소`);
  if (insights.topDistortions.length)
    lines.push(`  - 반복된 생각 패턴: ${insights.topDistortions.map((d) => `${d.name}(${d.count})`).join(", ")}`);
  if (insights.topEmotions.length)
    lines.push(`  - 주된 감정: ${insights.topEmotions.map((e) => `${e.label}(${e.count})`).join(", ")}`);
  records.slice(0, 3).forEach((r, i) => {
    lines.push(`  ${i + 1}) 상황: ${r.situation || "-"} / 생각: ${r.thought || "-"} / 대안: ${r.reframe || "-"}`);
  });
  lines.push("");
  const medMin = Math.round(meds.reduce((a, m) => a + m.seconds, 0) / 60);
  lines.push(`■ 명상 훈련: ${meds.length}회 · 총 ${medMin}분`);
  lines.push("");
  lines.push("■ 가치 행동 (이번 주)");
  const week = weekKey();
  const wv = input.values.filter((v) => v.weekKey === week);
  if (!wv.length) lines.push("  - 설정된 가치 없음");
  wv.forEach((v) => {
    const area = VALUE_AREAS.find((a) => a.id === v.areaId)?.label ?? "";
    lines.push(`  - [${area}] ${v.text}: ${v.done}/${v.goal}`);
  });
  lines.push("");
  lines.push("※ 본 요약은 자가 기록이며 진단이 아닙니다. 상담·치료 참고용으로만 활용하세요.");
  return lines.join("\n");
}
