"use client";

import { Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { buildChart, birthFromQuery, type SajuChart } from "@/lib/saju/core";
import { useProfiles } from "@/lib/saju/store";
import { BirthForm, Card, SavedProfiles } from "./ui";

function Inner({ to, title, children }: { to: string; title: string; children: (chart: SajuChart) => ReactNode }) {
  const q = useSearchParams();
  const { profiles, hydrated } = useProfiles();
  let input = birthFromQuery(q);
  if (!input && hydrated && profiles[0]) input = profiles[0];
  const chart = input ? buildChart(input) : null;

  if (chart) return <>{children(chart)}</>;
  if (!hydrated && !input) return <p className="text-sm text-[var(--ink-soft)]">불러오는 중…</p>;
  return (
    <Card>
      <h1 className="serif mb-1 text-xl font-bold">{title}</h1>
      <p className="mb-4 text-sm text-[var(--ink-soft)]">
        {input ? "입력한 날짜가 올바르지 않습니다. 다시 확인해 주세요." : "생년월일시를 입력하면 바로 확인할 수 있어요."}
      </p>
      <BirthForm to={to} initial={input ?? undefined} />
      <SavedProfiles to={to} />
    </Card>
  );
}

/** URL 쿼리(공유 링크) → 저장된 첫 프로필 순으로 사주를 찾고, 없으면 입력 폼을 보여줍니다. */
export function ChartGate(props: { to: string; title: string; children: (chart: SajuChart) => ReactNode }) {
  return (
    <Suspense fallback={<p className="text-sm text-[var(--ink-soft)]">불러오는 중…</p>}>
      <Inner {...props} />
    </Suspense>
  );
}
