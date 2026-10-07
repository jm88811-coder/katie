"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import RequireProfile from "@/components/RequireProfile";
import { Card, Tag } from "@/components/Card";
import { getStepById, JOURNEY_STEPS } from "@/lib/data/steps";
import { getInspirationByStepId } from "@/lib/data/inspiration";
import { useLocalState, STORAGE_KEYS } from "@/lib/storage";
import { JourneyProgress } from "@/lib/types";

export default function JourneyStepPage() {
  const params = useParams<{ stepId: string }>();
  const step = getStepById(params.stepId);
  const { value: progress, setValue: setProgress } = useLocalState<JourneyProgress>(
    STORAGE_KEYS.journeyProgress,
    {}
  );

  if (!step) {
    notFound();
  }

  const stepProgress = progress[step.id] ?? { completedTaskIds: [], reflectionNote: "" };
  const inspirationItems = getInspirationByStepId(step.id);
  const currentIndex = JOURNEY_STEPS.findIndex((s) => s.id === step.id);
  const prevStep = JOURNEY_STEPS[currentIndex - 1];
  const nextStep = JOURNEY_STEPS[currentIndex + 1];

  function toggleTask(taskId: string) {
    setProgress((prev) => {
      const cur = prev[step!.id] ?? { completedTaskIds: [], reflectionNote: "" };
      const completed = cur.completedTaskIds.includes(taskId)
        ? cur.completedTaskIds.filter((id) => id !== taskId)
        : [...cur.completedTaskIds, taskId];
      return { ...prev, [step!.id]: { ...cur, completedTaskIds: completed } };
    });
  }

  function updateReflection(note: string) {
    setProgress((prev) => {
      const cur = prev[step!.id] ?? { completedTaskIds: [], reflectionNote: "" };
      return { ...prev, [step!.id]: { ...cur, reflectionNote: note } };
    });
  }

  return (
    <RequireProfile>
      {() => (
        <div className="flex flex-col gap-6">
          <Link href="/journey" className="text-sm text-foreground/50 hover:underline">
            ← 전체 여정으로
          </Link>

          <div>
            <p className="text-sm font-medium text-foreground/50">{step.subtitle}</p>
            <h1 className="text-2xl font-bold">{step.title}</h1>
            <p className="mt-3 text-foreground/70">{step.summary}</p>
            {step.pitfall && (
              <p className="mt-3 rounded-lg border border-black/10 px-3 py-2 text-sm text-foreground/70 dark:border-white/10">
                <b>멈춤 신호</b> · {step.pitfall}
              </p>
            )}
          </div>

          <Card>
            <h2 className="mb-3 font-semibold">핵심 포인트</h2>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-foreground/70">
              {step.keyPoints.map((kp, i) => (
                <li key={i}>{kp}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="mb-3 font-semibold">이번 챕터 과제</h2>
            <div className="flex flex-col gap-2">
              {step.tasks.map((task) => {
                const checked = stepProgress.completedTaskIds.includes(task.id);
                return (
                  <label
                    key={task.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-black/10 px-3 py-2.5 text-sm dark:border-white/10"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTask(task.id)}
                      className="h-4 w-4 accent-foreground"
                    />
                    <span className={checked ? "text-foreground/40 line-through" : ""}>
                      {task.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </Card>

          <Card>
            <h2 className="mb-2 font-semibold">코치 질문</h2>
            <p className="mb-3 text-sm text-foreground/70">{step.reflectionPrompt}</p>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50 dark:border-white/15"
              placeholder="생각을 적어보세요..."
              value={stepProgress.reflectionNote}
              onChange={(e) => updateReflection(e.target.value)}
            />
          </Card>

          {inspirationItems.length > 0 && (
            <Card>
              <h2 className="mb-3 font-semibold">💡 이 챕터와 관련된 영감 노트</h2>
              <div className="flex flex-col gap-3">
                {inspirationItems.map((item) => (
                  <div key={item.id} className="rounded-lg border border-black/10 p-3 dark:border-white/10">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">{item.title}</span>
                      <Tag>{item.category}</Tag>
                    </div>
                    <p className="text-sm text-foreground/60">{item.description}</p>
                  </div>
                ))}
              </div>
              <Link href="/inspiration" className="mt-3 inline-block text-sm font-medium underline">
                영감 노트 전체 보기 →
              </Link>
            </Card>
          )}

          <div className="flex items-center justify-between pt-4">
            {prevStep ? (
              <Link href={`/journey/${prevStep.id}`} className="text-sm text-foreground/60 hover:underline">
                ← {prevStep.title}
              </Link>
            ) : (
              <span />
            )}
            {nextStep ? (
              <Link
                href={`/journey/${nextStep.id}`}
                className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
              >
                다음 챕터: {nextStep.title} →
              </Link>
            ) : (
              <span className="text-sm font-medium text-foreground/60">🎉 마지막 챕터입니다</span>
            )}
          </div>
        </div>
      )}
    </RequireProfile>
  );
}
