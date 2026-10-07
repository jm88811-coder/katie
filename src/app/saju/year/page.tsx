"use client";

import { ChartGate } from "@/components/saju/Gate";
import { AdSlot, Card, H2, ScoreBar } from "@/components/saju/ui";
import { analyze, pillarName, pillarHanja } from "@/lib/saju/core";
import { yearFortune } from "@/lib/saju/fortune";

const YEAR = 2027;

export default function YearPage() {
  return (
    <ChartGate to="/saju/year" title={`${YEAR} 신년운세`}>
      {(chart) => {
        const an = analyze(chart);
        const y = yearFortune(chart, an, YEAR);
        return (
          <>
            <p className="text-sm text-[var(--ink-soft)]">{YEAR}년 {pillarName(y.yearPillar)}년({pillarHanja(y.yearPillar)}) · 나에게 {y.god}의 해</p>
            <h1 className="serif mt-1 text-2xl font-bold">{chart.input.name || "당신"}의 {YEAR} 신년운세</h1>
            <Card className="mt-5 text-center">
              <div className="serif text-5xl font-bold text-[var(--seal)]">{y.score}<span className="text-xl">점</span></div>
              <p className="mt-2 text-sm leading-relaxed">{y.summary}</p>
            </Card>

            <H2 sub="양력 월 기준 (절기에 따라 월운이 바뀝니다)">12개월 흐름</H2>
            <Card>
              <ul className="flex flex-col gap-2.5">
                {y.months.map((m) => (
                  <li key={m.month} className="grid grid-cols-[2.5rem_1fr_2rem] items-center gap-3 text-sm">
                    <b>{m.month}월</b>
                    <div>
                      <ScoreBar score={m.score} color={m === y.best ? "#2f8f5b" : m === y.worst ? "#d9483b" : "var(--seal)"} />
                      <span className="text-xs text-[var(--ink-soft)]">{pillarName(m.pillar)}월 · {m.keyword}</span>
                    </div>
                    <span className="text-right">{m.score}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <H2>올해의 조언</H2>
            <Card><ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">{y.tips.map((t) => <li key={t}>{t}</li>)}</ul></Card>
            <AdSlot />
          </>
        );
      }}
    </ChartGate>
  );
}
