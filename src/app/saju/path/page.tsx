"use client";

import Link from "next/link";
import { ChartGate } from "@/components/saju/Gate";
import { DodlyeongSays, Reveal } from "@/components/saju/motion";
import { AdSlot, Card, H2, ScoreBar, ShareButton } from "@/components/saju/ui";
import { analyze, pillarName } from "@/lib/saju/core";
import { PARTNERS } from "@/lib/saju/content";
import { yearFortune } from "@/lib/saju/fortune";
import { crisisCards, dodlyeongSay, pickLenses, quarterRoadmap, seasonMap, targetYear } from "@/lib/saju/wisdom";

function Evidence({ items }: { items: string[] }) {
  return (
    <details className="mt-3 text-xs text-[var(--ink-soft)]">
      <summary className="cursor-pointer">이 풀이의 근거 보기</summary>
      <ul className="mt-1 list-disc pl-5">{items.map((e) => <li key={e}>{e}</li>)}</ul>
    </details>
  );
}

export default function PathPage() {
  return (
    <ChartGate to="/saju/path" title="인생 전략서">
      {(chart) => {
        const now = new Date();
        const an = analyze(chart);
        const year = targetYear(now);
        const yf = yearFortune(chart, an, year);
        const lenses = pickLenses(chart, an, now);
        const seasons = seasonMap(chart, now);
        const cards = crisisCards(chart, an, yf, now);
        const quarters = quarterRoadmap(yf);
        const cur = seasons.find((s) => s.current);
        return (
          <>
            <p className="text-sm text-[var(--ink-soft)]">달도령의 인생 전략서 · {year}년 기준</p>
            <h1 className="serif mt-1 text-2xl font-bold">{chart.input.name || "당신"}의 다음 한 수</h1>
            <div className="mt-3"><ShareButton /></div>
            <div className="mt-5"><DodlyeongSays mood="divine" text={dodlyeongSay(chart, an, lenses)} /></div>

            <H2 sub="사주 속 힘의 균형에서 지금 필요한 지혜를 골랐습니다">철학 렌즈</H2>
            <div className="flex flex-col gap-3">
              {lenses.map((l, i) => (
                <Reveal key={l.id + i} delay={i * 0.08}>
                  <Card>
                    <h3 className="serif text-lg font-bold">{l.name}</h3>
                    <p className="mt-2 border-l-2 border-[var(--seal)] pl-3 text-sm italic">{l.quote}<span className="ml-2 text-xs not-italic text-[var(--ink-soft)]">— {l.source}</span></p>
                    <p className="mt-3 text-sm leading-relaxed">{l.insight}</p>
                    <p className="mt-2 text-sm font-semibold text-[var(--seal)]">실천: <span className="font-normal text-[var(--ink)]">{l.practice}</span></p>
                    <Evidence items={l.evidence} />
                  </Card>
                </Reveal>
              ))}
            </div>

            <H2 sub={cur ? `지금은 「${cur.season.emoji} ${cur.season.name}」의 시기입니다` : "10년 대운을 사계절로 나눈 지도"}>인생 시즌 지도</H2>
            <div className="-mx-4 overflow-x-auto px-4 pb-2">
              <ol className="flex gap-2">
                {seasons.map((s) => (
                  <li key={s.daewoon.startAge} className={`card w-40 shrink-0 p-3 ${s.current ? "!border-[var(--seal)] ring-1 ring-[var(--seal)]" : ""}`}>
                    <div className="text-xs text-[var(--ink-soft)]">{s.daewoon.startAge}~{s.daewoon.endAge}세 · {pillarName(s.daewoon.pillar)}</div>
                    <div className="serif mt-1 text-lg font-bold">{s.season.emoji} {s.season.name}</div>
                    <div className="mt-1 text-xs text-[var(--ink-soft)]">{s.season.theme}</div>
                    {s.current && <div className="mt-1 text-[10px] text-[var(--seal)]">현재</div>}
                  </li>
                ))}
              </ol>
            </div>
            {cur && (
              <Card className="mt-3 text-sm leading-relaxed">
                <b>{cur.season.emoji} {cur.season.name} — 지금 할 일</b>
                <ul className="mt-1 list-disc pl-5">{cur.season.todo.map((t) => <li key={t}>{t}</li>)}</ul>
                <b className="mt-3 block">피할 일</b>
                <ul className="mt-1 list-disc pl-5">{cur.season.avoid.map((t) => <li key={t}>{t}</li>)}</ul>
                <Evidence items={[cur.evidence]} />
              </Card>
            )}

            <H2 sub="흔들림의 신호를 읽고, 뒤집는 행동 3가지를 정리했습니다">위기 → 기회 카드</H2>
            <div className="flex flex-col gap-3">
              {cards.map((c, i) => (
                <Reveal key={c.id} delay={i * 0.08}>
                  <Card>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs text-white ${c.kind === "crisis" ? "bg-[#d9483b]" : "bg-[#2f8f5b]"}`}>{c.kind === "crisis" ? "위기 신호" : "기회 신호"}</span>
                    <h3 className="serif mt-2 text-lg font-bold">{c.title}</h3>
                    <p className="mt-1 text-sm text-[var(--ink-soft)]">{c.signal}</p>
                    <p className="mt-2 text-sm"><b>흔한 실수</b> {c.mistake}</p>
                    <p className="mt-2 text-sm font-semibold">뒤집는 행동</p>
                    <ol className="list-decimal pl-5 text-sm leading-relaxed">{c.flip.map((f) => <li key={f}>{f}</li>)}</ol>
                    <Evidence items={c.evidence} />
                  </Card>
                </Reveal>
              ))}
            </div>

            <H2 sub={`${year}년 월운 점수를 분기로 묶었습니다`}>올해 분기 로드맵</H2>
            <div className="grid gap-3 sm:grid-cols-2">
              {quarters.map((q) => (
                <Card key={q.label}>
                  <div className="mb-1 flex items-baseline justify-between"><b>{q.label} <span className="text-xs font-normal text-[var(--ink-soft)]">{q.months}</span></b><span className="serif text-xl">{q.score}</span></div>
                  <ScoreBar score={q.score} />
                  <p className="mt-2 text-sm">{q.headline}</p>
                  <p className="mt-2 text-sm"><b className="text-[#2f8f5b]">할 일</b> {q.todo}</p>
                  <p className="mt-1 text-sm"><b className="text-[#d9483b]">피할 일</b> {q.avoid}</p>
                  <Evidence items={[q.evidence]} />
                </Card>
              ))}
            </div>

            <AdSlot />
            <H2>더 깊이 상의하고 싶다면</H2>
            <div className="grid gap-3 sm:grid-cols-3">
              {PARTNERS.map((p) => (
                <Link key={p.id} href={p.href} className="card block p-4 text-sm"><b>{p.title}</b><br /><span className="text-[var(--ink-soft)]">{p.desc}</span></Link>
              ))}
            </div>
            <p className="mt-6 text-xs text-[var(--ink-soft)]">고전 인용은 취지를 요약한 것이며, 풀이는 계산값에 따라 미리 작성된 해석을 조합한 오락·참고용 자료입니다.</p>
          </>
        );
      }}
    </ChartGate>
  );
}
