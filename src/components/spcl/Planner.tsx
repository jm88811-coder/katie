"use client";

import { useMemo, useState } from "react";
import { useLocalState } from "@/lib/storage";
import { generatePlan, planToText } from "@/lib/spcl/engine";
import SpclBadge from "./SpclBadge";
import {
  DEFAULT_INPUT,
  INDUSTRY_LABEL,
  SPCL_KEYS,
  SPCL_META,
  type Industry,
  type PlannerInput,
} from "@/lib/spcl/types";

const KEY = "spcl:planner-input";
const field =
  "w-full rounded-lg border border-black/15 bg-background px-3 py-2.5 text-sm outline-none focus:border-violet-500 dark:border-white/15";

export default function Planner() {
  const { value: input, setValue: setInput, hydrated } = useLocalState<PlannerInput>(KEY, DEFAULT_INPUT);
  const [copied, setCopied] = useState(false);
  const plan = useMemo(() => generatePlan(input), [input]);

  const set = <K extends keyof PlannerInput>(k: K, v: PlannerInput[K]) => setInput((p) => ({ ...p, [k]: v }));

  async function copy() {
    try {
      await navigator.clipboard.writeText(planToText(plan));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  if (!hydrated) return <p className="text-sm text-foreground/50">불러오는 중…</p>;

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
        <label className="flex flex-col gap-1 text-sm">업종
          <select className={field} value={input.industry} onChange={(e) => set("industry", e.target.value as Industry)}>
            {(Object.keys(INDUSTRY_LABEL) as Industry[]).map((i) => (
              <option key={i} value={i}>{INDUSTRY_LABEL[i]}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">타깃 고객
          <input className={field} placeholder="예: 연매출 5억 이하 개인사업자" value={input.target} onChange={(e) => set("target", e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-sm">내가 해본 일·성과 (Status)
          <textarea className={`${field} min-h-20`} placeholder="예: 3년간 사업자 200명 절세 상담" value={input.experience} onChange={(e) => set("experience", e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-sm">가진 증거 (Credibility)
          <textarea className={`${field} min-h-20`} placeholder="후기, 수치, 전후 비교, 언론" value={input.proof} onChange={(e) => set("proof", e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-sm">가치관·실패담 (Likeness)
          <textarea className={`${field} min-h-20`} placeholder="내가 중요하게 여기는 기준, 겪은 실패" value={input.values} onChange={(e) => set("values", e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-sm">주간 발행 수: {input.perWeek}개
          <input type="range" min={1} max={14} value={input.perWeek} onChange={(e) => set("perWeek", Number(e.target.value))} />
        </label>
        <button type="button" onClick={() => setInput(DEFAULT_INPUT)} className="self-start text-xs text-foreground/60 underline">
          입력 초기화
        </button>
      </form>

      <div className="flex flex-col gap-8">
        {plan.warnings.length > 0 && (
          <section className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
            <h2 className="mb-2 text-sm font-bold">보완하면 좋아요</h2>
            <ul className="space-y-1 text-sm">
              {plan.warnings.map((w) => (
                <li key={w.key}><SpclBadge k={w.key} /> <span className="ml-1">{w.message}</span></li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold">주간 발행 캘린더</h2>
            <div className="flex gap-2">
              <button onClick={copy} className="rounded-full border border-black/15 px-3 py-1 text-xs dark:border-white/15">
                {copied ? "복사됨" : "전체 복사"}
              </button>
              <button onClick={() => window.print()} className="rounded-full border border-black/15 px-3 py-1 text-xs dark:border-white/15">
                인쇄
              </button>
            </div>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {plan.calendar.map((c, i) => (
              <li key={i} className="rounded-lg border border-black/10 p-3 text-sm dark:border-white/10">
                <span className="mr-2 font-bold">{c.day}</span>
                <SpclBadge k={c.idea.key} />
                <p className="mt-1">{c.idea.title}</p>
              </li>
            ))}
          </ul>
        </section>

        {SPCL_KEYS.map((k) => (
          <section key={k}>
            <div className="mb-1 flex items-center gap-2"><SpclBadge k={k} /></div>
            <p className="mb-3 text-xs text-foreground/60">{SPCL_META[k].question}</p>
            <ul className="space-y-3">
              {plan.ideas[k].map((idea) => (
                <li key={idea.title} className="rounded-xl border border-black/10 p-4 text-sm dark:border-white/10">
                  <p className="font-semibold">{idea.title}</p>
                  <p className="mt-1 text-foreground/80">훅: “{idea.hook}”</p>
                  <p className="text-foreground/70">구성: {idea.steps.join(" → ")}</p>
                  <p className="text-foreground/70">CTA: {idea.cta}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
