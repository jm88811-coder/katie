"use client";

import Link from "next/link";
import RequireProfile from "@/components/RequireProfile";
import { Card } from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import { JOURNEY_STEPS } from "@/lib/data/steps";
import { analyzeProfile } from "@/lib/engine";
import { useLocalState, STORAGE_KEYS } from "@/lib/storage";
import { JourneyProgress } from "@/lib/types";

export default function JourneyPage() {
  const { value: progress } = useLocalState<JourneyProgress>(STORAGE_KEYS.journeyProgress, {});

  return (
    <RequireProfile>
      {(profile) => {
        const analysis = analyzeProfile(profile);
        return (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-bold">나의 사업가 여정 — 7장</h1>
              <p className="mt-1 text-sm text-foreground/60">
                {profile.name}님을 위한 추천 순서:{" "}
                {analysis.recommendedStepIds
                  .map((id) => JOURNEY_STEPS.find((s) => s.id === id)?.title)
                  .filter(Boolean)
                  .join(" → ")}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {JOURNEY_STEPS.map((step) => {
                const done = progress[step.id]?.completedTaskIds.length ?? 0;
                const total = step.tasks.length;
                const recommended = analysis.recommendedStepIds.includes(step.id);
                return (
                  <Link key={step.id} href={`/journey/${step.id}`}>
                    <Card className="transition hover:border-foreground/30">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{step.title}</h3>
                            {recommended && (
                              <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium">
                                추천
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-sm text-foreground/60">{step.subtitle}</p>
                        </div>
                        <span className="shrink-0 text-sm text-foreground/50">
                          {done}/{total}
                        </span>
                      </div>
                      <div className="mt-3">
                        <ProgressBar ratio={total ? done / total : 0} />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      }}
    </RequireProfile>
  );
}
