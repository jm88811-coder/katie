"use client";

import { ChartGate } from "@/components/saju/Gate";
import { AdSlot, Card, H2, ScoreBar, StreakBadge } from "@/components/saju/ui";
import { analyze, pillarName, ELEMENT_COLORS } from "@/lib/saju/core";
import { dailyFortune } from "@/lib/saju/fortune";

export default function TodayPage() {
  return (
    <ChartGate to="/saju/today" title="오늘의 운세">
      {(chart) => {
        const an = analyze(chart);
        const f = dailyFortune(chart, an, new Date());
        return (
          <>
            <p className="text-sm text-[var(--ink-soft)]">{f.dateLabel} · {pillarName(f.dayPillar)}일 · 나에게 {f.god}의 날</p>
            <h1 className="serif mt-1 text-2xl font-bold">{chart.input.name || "당신"}의 오늘 운세</h1>
            <div className="mt-3"><StreakBadge record /></div>

            <Card className="mt-5 text-center">
              <div className="text-sm text-[var(--ink-soft)]">종합 운세</div>
              <div className="serif my-1 text-5xl font-bold text-[var(--seal)]">{f.total}<span className="text-xl">점</span></div>
              <p className="text-sm leading-relaxed">{f.advice}</p>
              {f.relation && <p className="mt-2 text-sm text-[var(--ink-soft)]">{f.relation}</p>}
            </Card>

            <H2>분야별 운세</H2>
            <div className="grid gap-3 sm:grid-cols-2">
              {f.categories.map((c) => (
                <Card key={c.key}>
                  <div className="mb-2 flex items-baseline justify-between"><b>{c.label}</b><span className="serif text-xl">{c.score}</span></div>
                  <ScoreBar score={c.score} />
                  <p className="mt-2 text-sm text-[var(--ink-soft)]">{c.text}</p>
                </Card>
              ))}
            </div>

            <H2>오늘의 행운</H2>
            <Card className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div><div className="text-xs text-[var(--ink-soft)]">행운 색</div><b style={{ color: ELEMENT_COLORS[an.yongsin] }}>{f.lucky.color}</b></div>
              <div><div className="text-xs text-[var(--ink-soft)]">행운 숫자</div><b>{f.lucky.number}</b></div>
              <div><div className="text-xs text-[var(--ink-soft)]">행운 방향</div><b>{f.lucky.direction}</b></div>
              <div><div className="text-xs text-[var(--ink-soft)]">좋은 시간</div><b>{f.lucky.time}</b></div>
            </Card>
            <AdSlot />
            <p className="text-xs text-[var(--ink-soft)]">내일도 방문하면 연속 방문 보상으로 심층 리포트가 무료로 열립니다.</p>
          </>
        );
      }}
    </ChartGate>
  );
}
