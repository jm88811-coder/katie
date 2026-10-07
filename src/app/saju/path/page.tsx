"use client";

import Link from "next/link";
import { ChartGate } from "@/components/saju/Gate";
import { AiLetter } from "@/components/saju/AiLetter";
import { Chapter, DodlyeongSays, Reveal, ScrollProgress } from "@/components/saju/motion";
import { AdSlot, Card, LockedReport, PillarsTable, ScoreBar, ShareButton, StreakBadge } from "@/components/saju/ui";
import { analyze, pillarName } from "@/lib/saju/core";
import { PARTNERS, deepSections } from "@/lib/saju/content";
import { yearFortune } from "@/lib/saju/fortune";
import {
  crisisCards, dayPicks, dodlyeongSay, pickLenses, quarterRoadmap, retrospective, seasonMap, targetYear,
  type DayPick,
} from "@/lib/saju/wisdom";

function Evidence({ items }: { items: string[] }) {
  return (
    <details className="mt-3 text-xs text-[var(--ink-soft)]">
      <summary className="cursor-pointer">이 풀이의 근거 보기</summary>
      <ul className="mt-1 list-disc pl-5">{items.map((e) => <li key={e}>{e}</li>)}</ul>
    </details>
  );
}

function DayList({ title, tone, picks, mode }: { title: string; tone: string; picks: DayPick[]; mode: "good" | "caution" }) {
  return (
    <Card>
      <h3 className="serif mb-3 text-lg font-bold" style={{ color: tone }}>{title}</h3>
      <ol className="flex flex-col gap-3">
        {picks.map((p) => (
          <li key={p.label} className="border-b border-[var(--line)] pb-3 last:border-0 last:pb-0">
            <div className="flex items-baseline justify-between gap-2">
              <b>{p.label}</b>
              <span className="text-xs text-[var(--ink-soft)]">{p.pillar}일 · {p.god} · {p.score}점</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed">
              {mode === "good" ? p.advice : <>피할 일: {p.avoid}. <span className="text-[var(--ink-soft)]">{p.advice}</span></>}
            </p>
            <Evidence items={p.evidence} />
          </li>
        ))}
      </ol>
    </Card>
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
        const retro = retrospective(chart, an, now);
        const picks = dayPicks(chart, an, now, 90);
        const cur = seasons.find((s) => s.current);
        const name = chart.input.name || "당신";

        return (
          <>
            <ScrollProgress />

            <Chapter no={1} kicker="서장" title={`${name}의 사주를 펼쳐 봅니다`}>
              <DodlyeongSays mood="divine" text={dodlyeongSay(chart, an, lenses)} />
              <div className="mt-5"><PillarsTable chart={chart} /></div>
              <div className="mt-3 flex flex-wrap gap-2"><ShareButton /><StreakBadge record /></div>
            </Chapter>

            <Chapter no={2} kicker="지난 이야기" title="먼저, 지나온 길부터 짚어 보겠습니다">
              <p className="mb-3 text-sm text-[var(--ink-soft)]">맞고 틀림은 그대가 판단하세요. 각 질문 아래에 어떤 계산에서 나왔는지 적어 두었습니다.</p>
              <div className="flex flex-col gap-3">
                {retro.map((r, i) => (
                  <Reveal key={r.title} delay={i * 0.06}>
                    <Card>
                      <h3 className="serif font-bold">{r.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed">{r.question}</p>
                      <Evidence items={r.evidence} />
                    </Card>
                  </Reveal>
                ))}
              </div>
            </Chapter>

            <Chapter
              no={3} kicker="지금의 계절"
              title={cur ? `지금은 「${cur.season.emoji} ${cur.season.name}」의 시기입니다` : "10년 대운을 사계절로 나눈 지도"}
            >
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
                  <b>지금 할 일</b>
                  <ul className="mt-1 list-disc pl-5">{cur.season.todo.map((t) => <li key={t}>{t}</li>)}</ul>
                  <b className="mt-3 block">피할 일</b>
                  <ul className="mt-1 list-disc pl-5">{cur.season.avoid.map((t) => <li key={t}>{t}</li>)}</ul>
                  <Evidence items={[cur.evidence]} />
                </Card>
              )}
            </Chapter>

            <Chapter no={4} kicker="흔들림과 기회" title="위기의 신호를 기회로 뒤집는 법">
              <div className="flex flex-col gap-3">
                {cards.map((c, i) => (
                  <Reveal key={c.id} delay={i * 0.06}>
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
            </Chapter>

            <Chapter no={5} kicker="앞으로 90일" title="움직일 날과 아낄 날을 날짜로 짚었습니다">
              <div className="grid gap-3 lg:grid-cols-2">
                <DayList title="좋은 날 TOP 10" tone="#2f8f5b" picks={picks.good} mode="good" />
                <DayList title="조심할 날 TOP 10" tone="#d9483b" picks={picks.caution} mode="caution" />
              </div>
              <p className="mt-2 text-xs text-[var(--ink-soft)]">오늘부터 90일간 매일의 일진을 내 일간과 비교해 점수를 낸 결과입니다.</p>
            </Chapter>

            <Chapter no={6} kicker="올해의 길" title={`${year}년, 분기마다 이렇게 걸어 보세요`}>
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
              <h3 className="serif mb-3 mt-8 text-lg font-bold">마음에 새길 철학</h3>
              <div className="flex flex-col gap-3">
                {lenses.map((l, i) => (
                  <Reveal key={l.id + i} delay={i * 0.06}>
                    <Card>
                      <h4 className="serif font-bold">{l.name}</h4>
                      <p className="mt-2 border-l-2 border-[var(--seal)] pl-3 text-sm italic">{l.quote}<span className="ml-2 text-xs not-italic text-[var(--ink-soft)]">— {l.source}</span></p>
                      <p className="mt-3 text-sm leading-relaxed">{l.insight}</p>
                      <p className="mt-2 text-sm font-semibold text-[var(--seal)]">실천: <span className="font-normal text-[var(--ink)]">{l.practice}</span></p>
                      <Evidence items={l.evidence} />
                    </Card>
                  </Reveal>
                ))}
              </div>
            </Chapter>

            <Chapter no={7} kicker="달도령의 편지" title="지금까지의 풀이를 한 통의 편지로 엮어 드립니다">
              <AiLetter birth={chart.input} />
            </Chapter>

            <Chapter no={8} kicker="마무리" title="매일 찾아오면, 더 깊은 이야기가 열립니다">
              <div className="flex flex-col gap-3">
                {deepSections(chart, an).map((s) => <LockedReport key={s.id} {...s} />)}
              </div>
              <AdSlot />
              <div className="grid gap-3 sm:grid-cols-3">
                {PARTNERS.map((p) => (
                  <Link key={p.id} href={p.href} className="card block p-4 text-sm"><b>{p.title}</b><br /><span className="text-[var(--ink-soft)]">{p.desc}</span></Link>
                ))}
              </div>
              <p className="mt-6 text-xs text-[var(--ink-soft)]">고전 인용은 취지를 요약한 것이며, 풀이는 계산값에 따라 미리 작성된 해석을 조합한 오락·참고용 자료입니다.</p>
            </Chapter>
          </>
        );
      }}
    </ChartGate>
  );
}
