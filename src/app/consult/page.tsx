"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { matchConsultAdvice } from "@/lib/engine";
import { getStepById } from "@/lib/data/steps";
import { useLocalState, STORAGE_KEYS } from "@/lib/storage";
import { ConsultEntry } from "@/lib/types";

export default function ConsultPage() {
  const { value: log, setValue: setLog } = useLocalState<ConsultEntry[]>(
    STORAGE_KEYS.consultLog,
    []
  );
  const [problem, setProblem] = useState("");

  function submit() {
    if (!problem.trim()) return;
    const match = matchConsultAdvice(problem);
    const entry: ConsultEntry = {
      id: `consult-${Date.now()}`,
      problemText: problem.trim(),
      matchedStepIds: match.matchedStepIds,
      advices: match.advices,
      createdAt: new Date().toISOString(),
    };
    setLog((prev) => [entry, ...prev]);
    setProblem("");
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">🧭 고민상담</h1>
        <p className="mt-2 text-sm text-foreground/60">
          사업하다 막히는 순간마다 털어놓으세요. 코치가 관련 챕터와 실행 조언을 드립니다.
        </p>
      </div>

      <Card>
        <textarea
          rows={4}
          className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50 dark:border-white/15"
          placeholder="예: 아이템은 정했는데 마케팅을 어떻게 해야 할지 모르겠어요"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />
        <button
          onClick={submit}
          className="mt-3 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
        >
          상담 요청하기
        </button>
      </Card>

      <div className="flex flex-col gap-4">
        {log.map((entry) => (
          <Card key={entry.id}>
            <p className="text-sm font-medium text-foreground/50">
              {new Date(entry.createdAt).toLocaleString("ko-KR")}
            </p>
            <p className="mt-1 font-semibold">&quot;{entry.problemText}&quot;</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-foreground/70">
              {entry.advices.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
            {entry.matchedStepIds.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {entry.matchedStepIds.map((id) => {
                  const step = getStepById(id);
                  if (!step) return null;
                  return (
                    <Link
                      key={id}
                      href={`/journey/${id}`}
                      className="rounded-full bg-foreground/10 px-3 py-1 text-xs font-medium hover:bg-foreground/20"
                    >
                      {step.title} 보러가기 →
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
