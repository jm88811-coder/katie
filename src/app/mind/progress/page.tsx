"use client";

import { useMemo } from "react";
import { LineChart, MCard, PageTitle } from "@/components/mind/ui";
import { buildInsights } from "@/lib/mind/engine";
import { useCheckIns, useRecords } from "@/lib/mind/store";

const md = (iso: string) => {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

export default function ProgressPage() {
  const { value: checkIns } = useCheckIns();
  const { value: records } = useRecords();

  const insights = useMemo(() => buildInsights(records, checkIns), [records, checkIns]);
  const recent = useMemo(() => [...checkIns].slice(0, 7).reverse(), [checkIns]);

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title="📈 나의 변화" sub="내가 반복하는 생각 패턴을 알아차리면 달라지기 쉬워요." />

      <MCard>
        <p className="font-semibold">우울</p>
        <LineChart label="우울 추이" points={recent.map((c) => ({ x: md(c.createdAt), y: c.depression }))} />
      </MCard>
      <MCard>
        <p className="font-semibold">불안</p>
        <LineChart label="불안 추이" points={recent.map((c) => ({ x: md(c.createdAt), y: c.anxiety }))} />
      </MCard>

      <MCard className="flex flex-col gap-4">
        <p className="font-semibold">🔎 나만의 패턴 인사이트</p>
        {insights.recordCount === 0 && checkIns.length === 0 ? (
          <p className="text-sm text-slate-400">체크인과 생각기록이 쌓이면 패턴을 분석해 드려요.</p>
        ) : (
          <>
            {insights.avgRelief !== null && (
              <p className="text-sm">
                생각기록 후 감정 강도가 평균{" "}
                <b className="text-blue-700">{insights.avgRelief}점</b> 달라졌어요.
              </p>
            )}
            {insights.topDistortions.length > 0 && (
              <div>
                <p className="mb-2 text-xs text-slate-500">자주 나타난 생각 습관</p>
                <ul className="space-y-1.5">
                  {insights.topDistortions.map((d) => (
                    <li key={d.id} className="flex justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                      <span>{d.name}</span>
                      <b>{d.count}회</b>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {insights.topEmotions.length > 0 && (
              <p className="text-sm">
                자주 느낀 감정: <b>{insights.topEmotions.map((e) => e.label).join(", ")}</b>
              </p>
            )}
            {insights.hardestSlot && (
              <p className="text-sm">
                마음이 가장 힘들었던 시간대는 <b>{insights.hardestSlot}</b>이에요. 이 시간대에 미리 호흡이나 산책을 계획해 보세요.
              </p>
            )}
            {insights.bodyHotspot && (
              <p className="text-sm">
                마음이 힘들 때 <b>{insights.bodyHotspot}</b>에 신호가 자주 나타나요.
              </p>
            )}
          </>
        )}
      </MCard>

      <MCard>
        <p className="mb-3 font-semibold">최근 생각기록</p>
        {records.length === 0 && <p className="text-sm text-slate-400">아직 기록이 없어요.</p>}
        <ul className="space-y-3">
          {records.slice(0, 5).map((r) => (
            <li key={r.id} className="rounded-2xl bg-slate-50 p-3 text-sm">
              <p className="text-xs text-slate-400">
                {md(r.createdAt)} · 강도 {r.intensityBefore} → {r.intensityAfter}
              </p>
              <p className="mt-1 font-medium">“{r.thought}”</p>
              {r.reframe && <p className="mt-1 text-blue-800">→ {r.reframe}</p>}
            </li>
          ))}
        </ul>
      </MCard>
    </div>
  );
}
