"use client";

import Link from "next/link";
import { useMemo } from "react";
import { MCard, PageTitle } from "@/components/mind/ui";
import { MOODS } from "@/lib/mind/data";
import { buildCoachMessages, dayKey, streakDays } from "@/lib/mind/engine";
import { useCheckIns, useMeditations, useRecords, useValues } from "@/lib/mind/store";
import { useHydrated } from "@/lib/storage";

const TOOLS = [
  { href: "/mind/checkin", icon: "🌤️", title: "마음 날씨", desc: "30초 체크인" },
  { href: "/mind/record", icon: "📝", title: "생각기록지", desc: "생각과 거리두기" },
  { href: "/mind/pie", icon: "🥧", title: "책임 파이", desc: "내 탓 나누기" },
  { href: "/mind/values", icon: "🧭", title: "가치 나침반", desc: "방향 찾기" },
  { href: "/mind/meditate", icon: "🍃", title: "명상 훈련", desc: "3분 연습" },
  { href: "/mind/report", icon: "📄", title: "상담사 리포트", desc: "요약 공유" },
];

const toneStyle = {
  warm: "bg-amber-50 border-amber-200",
  nudge: "bg-blue-50 border-blue-200",
  celebrate: "bg-emerald-50 border-emerald-200",
} as const;

export default function MindHome() {
  const hydrated = useHydrated();
  const { value: checkIns } = useCheckIns();
  const { value: records } = useRecords();
  const { value: values } = useValues();
  const { value: meditations } = useMeditations();

  const messages = useMemo(
    () => buildCoachMessages({ checkIns, records, meditations, values }),
    [checkIns, records, meditations, values]
  );
  const streak = useMemo(
    () =>
      streakDays([
        ...checkIns.map((c) => c.createdAt),
        ...records.map((r) => r.createdAt),
        ...meditations.map((m) => m.createdAt),
      ]),
    [checkIns, records, meditations]
  );
  const todayCheckIn = checkIns.find((c) => dayKey(c.createdAt) === dayKey());
  const mood = MOODS.find((m) => m.key === todayCheckIn?.mood);

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title="오늘의 마음" sub="생각을 없애는 게 아니라, 생각과 거리를 두는 연습이에요." />

      <MCard className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">오늘 마음 날씨</p>
          <p className="mt-1 text-lg font-bold">
            {hydrated && mood ? `${mood.emoji} ${mood.label}` : "아직 기록 전"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">연속 실천</p>
          <p className="mt-1 text-lg font-bold text-blue-700">{hydrated ? streak : 0}일</p>
        </div>
      </MCard>

      <div className="flex flex-col gap-2" aria-label="코치 리딩">
        <h2 className="px-1 text-sm font-semibold text-slate-600">🧑‍⚕️ 코치 리딩</h2>
        {(hydrated ? messages : []).map((m) => (
          <div key={m.id} className={`rounded-3xl border p-4 text-sm leading-relaxed ${toneStyle[m.tone]}`}>
            <p>{m.text}</p>
            {m.href && (
              <Link href={m.href} className="mt-2 inline-block font-semibold text-blue-700 underline">
                {m.cta} →
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {TOOLS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300"
          >
            <span className="text-2xl">{t.icon}</span>
            <p className="mt-2 font-semibold">{t.title}</p>
            <p className="text-xs text-slate-500">{t.desc}</p>
          </Link>
        ))}
      </div>

      <p className="px-2 text-center text-xs leading-relaxed text-slate-400">
        🔒 모든 기록은 이 기기에만 저장되며 서버로 전송되지 않아요.
        <br />
        마음결은 의료 서비스가 아니며 진단·치료를 대신하지 않아요.
      </p>
    </div>
  );
}
