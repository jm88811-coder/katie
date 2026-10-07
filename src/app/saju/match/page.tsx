"use client";

import { CountUp } from "@/components/saju/motion";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BirthForm, Card, H2, ScoreBar, AdSlot } from "@/components/saju/ui";
import { birthFromQuery, birthToQuery, buildChart, type BirthInput } from "@/lib/saju/core";
import { matchScore } from "@/lib/saju/fortune";

function Inner() {
  const q = useSearchParams();
  const router = useRouter();
  const [first, setFirst] = useState<BirthInput | null>(null);
  const a = birthFromQuery(q, "a_");
  const b = birthFromQuery(q, "b_");
  const ca = a && buildChart(a), cb = b && buildChart(b);

  if (ca && cb) {
    const r = matchScore(ca, cb);
    return (
      <>
        <h1 className="serif text-2xl font-bold">{a!.name || "나"} ♥ {b!.name || "상대"} 궁합</h1>
        <Card className="mt-5 text-center">
          <div className="serif text-5xl font-bold text-[var(--seal)]"><CountUp value={r.total} /><span className="text-xl">점</span></div>
          <p className="mt-2 text-sm">{r.verdict}</p>
        </Card>
        <H2>항목별 분석</H2>
        <div className="flex flex-col gap-3">
          {r.parts.map((p) => (
            <Card key={p.label}>
              <div className="mb-2 flex justify-between"><b>{p.label}</b><span className="serif">{p.score}</span></div>
              <ScoreBar score={p.score} />
              <p className="mt-2 text-sm text-[var(--ink-soft)]">{p.note}</p>
            </Card>
          ))}
        </div>
        <AdSlot />
      </>
    );
  }

  return (
    <Card>
      <h1 className="serif mb-1 text-xl font-bold">궁합 보기</h1>
      <p className="mb-4 text-sm text-[var(--ink-soft)]">{first ? "상대방 정보를 입력하세요." : "먼저 내 정보를 입력하세요."}</p>
      <BirthForm
        key={first ? "b" : "a"}
        submitLabel={first ? "궁합 결과 보기" : "다음: 상대방 입력"}
        onSubmit={(x) => {
          if (!first) return setFirst(x);
          const qa = new URLSearchParams(birthToQuery(first)), qb = new URLSearchParams(birthToQuery(x));
          const out = new URLSearchParams();
          qa.forEach((v, k) => out.set("a_" + k, v));
          qb.forEach((v, k) => out.set("b_" + k, v));
          router.push(`/saju/match?${out}`);
        }}
      />
    </Card>
  );
}

export default function MatchPage() {
  return <Suspense><Inner /></Suspense>;
}
