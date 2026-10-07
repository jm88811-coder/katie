"use client";

import Link from "next/link";
import { ChartGate } from "@/components/saju/Gate";
import { AdSlot, Card, DaewoonTimeline, ElementChart, H2, LockedReport, PillarsTable, ShareButton, StreakBadge } from "@/components/saju/ui";
import { ageOf, analyze, daewoon, ANIMALS, ELEMENTS, STEMS } from "@/lib/saju/core";
import { DodlyeongSays } from "@/components/saju/motion";
import { dodlyeongSay, pickLenses } from "@/lib/saju/wisdom";
import { PARTNERS, deepSections, freeSummary, godSummary } from "@/lib/saju/content";

export default function ResultPage() {
  return (
    <ChartGate to="/saju/result" title="종합 사주">
      {(chart) => {
        const an = analyze(chart);
        const sum = freeSummary(chart, an);
        const dw = daewoon(chart);
        const age = ageOf(chart, new Date().getFullYear());
        const gs = godSummary(an);
        const l = chart.lunar;
        return (
          <>
            <p className="text-sm text-[var(--ink-soft)]">
              양력 {chart.solar.year}.{chart.solar.month}.{chart.solar.day}
              {l && ` (음력 ${l.year}.${l.leap ? "윤" : ""}${l.month}.${l.day})`}
              {chart.input.hour !== null ? ` ${String(chart.input.hour).padStart(2, "0")}:${String(chart.input.minute).padStart(2, "0")}` : " · 시간 모름"}
              {" · "}{ANIMALS[chart.year.branch]}띠 · {chart.input.gender === "M" ? "남" : "여"}
            </p>
            <h1 className="serif mt-1 text-2xl font-bold leading-snug">{sum.headline}</h1>
            <div className="mt-3 flex flex-wrap gap-2"><ShareButton /><StreakBadge record /></div>
            <div className="mt-5"><DodlyeongSays mood="divine" text={dodlyeongSay(chart, an, pickLenses(chart, an))} /></div>
            <Link href={`/saju/path?${new URLSearchParams(location.search)}`} className="mt-3 block rounded-xl bg-[var(--seal)] px-5 py-3 text-center font-semibold text-[var(--on-seal)]">서사형 인생 전략서 보기 →</Link>

            <H2>사주팔자 (만세력)</H2>
            <PillarsTable chart={chart} />

            <H2>성향 요약</H2>
            <Card className="flex flex-col gap-3 text-sm leading-relaxed">
              <p>{sum.personality}</p>
              <p>{sum.balance}</p>
              <p>{sum.strengthTxt}</p>
              <p>{sum.cautionTxt}</p>
              <p className="font-semibold text-[var(--seal)]">{sum.lucky}</p>
            </Card>

            <H2 sub="일간 힘(신강·신약)과 용신 후보">오행 분포</H2>
            <ElementChart counts={an.counts} />
            <Card className="mt-3 text-sm leading-relaxed">
              <b>용신 후보: {ELEMENTS[an.yongsin]}</b> — {an.yongsinReason}
              <div className="mt-2 text-xs text-[var(--ink-soft)]">※ 격국·조후를 모두 반영한 전문가 용신과 다를 수 있는 간이 판정입니다.</div>
            </Card>

            <H2 sub="사주에서 어떤 힘이 강한지">십성 분석</H2>
            <Card>
              <ul className="grid gap-2 text-sm sm:grid-cols-2">
                {gs.map((g) => (
                  <li key={g.key} className="flex gap-3"><b className="w-6 text-right text-[var(--seal)]">{g.count}</b><span><b>{g.title}</b><br /><span className="text-[var(--ink-soft)]">{g.text}</span></span></li>
                ))}
              </ul>
            </Card>

            <H2 sub={`${dw.forward ? "순행" : "역행"} · ${dw.startAge}세부터 10년 단위 (현재 ${age}세)`}>대운</H2>
            <DaewoonTimeline list={dw.list} currentAge={age} />

            <AdSlot />

            <H2 sub="매일 방문하면 무료로 열립니다">심층 리포트</H2>
            <div className="flex flex-col gap-3">
              {deepSections(chart, an).map((s) => <LockedReport key={s.id} {...s} />)}
            </div>

            <H2>이어서 보기</H2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link className="card p-4 text-sm" href={`/saju/path?${new URLSearchParams(location.search)}`}>인생 전략서 →</Link>
              <Link className="card p-4 text-sm" href={`/saju/today?${new URLSearchParams(location.search)}`}>오늘의 운세 →</Link>
              <Link className="card p-4 text-sm" href={`/saju/year?${new URLSearchParams(location.search)}`}>2027 신년운세 →</Link>
              <Link className="card p-4 text-sm" href={`/saju/match`}>궁합 보기 →</Link>
            </div>

            <H2>전문가·제휴</H2>
            <div className="grid gap-3 sm:grid-cols-3">
              {PARTNERS.map((p) => (
                <Link key={p.id} href={p.href} className="card block p-4 text-sm">
                  <b>{p.title}</b><br /><span className="text-[var(--ink-soft)]">{p.desc}</span>
                </Link>
              ))}
            </div>
            <p className="mt-6 text-xs text-[var(--ink-soft)]">일간 {STEMS[an.dm]} 기준 · 절기(태양황경) 계산 · 지장간은 본기만 반영</p>
          </>
        );
      }}
    </ChartGate>
  );
}
