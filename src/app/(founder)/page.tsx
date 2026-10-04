"use client";

import Link from "next/link";
import { useProfile } from "@/components/RequireProfile";
import { Card } from "@/components/Card";
import { analyzeProfile } from "@/lib/engine";
import { JOURNEY_STEPS } from "@/lib/data/steps";
import { useLocalState, STORAGE_KEYS } from "@/lib/storage";
import { JourneyProgress } from "@/lib/types";

export default function Home() {
  const { value: profile, hydrated } = useProfile();
  const { value: progress } = useLocalState<JourneyProgress>(STORAGE_KEYS.journeyProgress, {});

  if (!hydrated) return null;

  if (!profile) {
    return (
      <div className="flex flex-col items-center gap-8 py-12 text-center">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-medium text-foreground/50">
            당신의 이야기가 사업이 됩니다
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            파운더스토리
          </h1>
          <p className="mt-5 text-balance text-lg text-foreground/70">
            이름·생년월일·MBTI·실패담·성공담·목표를 입력하면, 마치 성공 스토리 영화의
            주인공처럼 Step 1부터 사업가로 성장하는 나만의 여정을 설계해드립니다.
          </p>
        </div>
        <Link
          href="/onboarding"
          className="rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background hover:opacity-90"
        >
          내 이야기로 여정 시작하기
        </Link>

        <div className="mt-6 grid w-full max-w-3xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
          <Card>
            <h3 className="mb-1 font-semibold">사주처럼 개인화</h3>
            <p className="text-sm text-foreground/60">
              성향과 경험담을 분석해 나에게 맞는 챕터 순서와 코치 조언을 제공합니다.
            </p>
          </Card>
          <Card>
            <h3 className="mb-1 font-semibold">영화 같은 7단계 여정</h3>
            <p className="text-sm text-foreground/60">
              자의식 해체부터 부의 그릇 확장까지, 챕터별 과제로 실제 실행을 이끕니다.
            </p>
          </Card>
          <Card>
            <h3 className="mb-1 font-semibold">실무까지 준비</h3>
            <p className="text-sm text-foreground/60">
              세금·법률 체크리스트, 스터디 카테고리, AI 시대 신직업까지 함께 안내합니다.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  const analysis = analyzeProfile(profile);
  const totalTasks = JOURNEY_STEPS.reduce((sum, s) => sum + s.tasks.length, 0);
  const doneTasks = JOURNEY_STEPS.reduce(
    (sum, s) => sum + (progress[s.id]?.completedTaskIds.length ?? 0),
    0
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm text-foreground/50">환영합니다,</p>
        <h1 className="text-3xl font-bold">{profile.name}님의 파운더스토리</h1>
        <p className="mt-2 text-foreground/70">
          당신의 사업가 원형: <span className="font-semibold">{analysis.archetypeName}</span>
        </p>
      </div>

      <Card>
        <h2 className="mb-2 font-semibold">전체 진행률</h2>
        <p className="mb-2 text-sm text-foreground/60">
          {doneTasks} / {totalTasks} 과제 완료
        </p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full rounded-full bg-foreground"
            style={{ width: `${totalTasks ? (doneTasks / totalTasks) * 100 : 0}%` }}
          />
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h3 className="mb-1 font-semibold">💪 강점</h3>
          <p className="text-sm text-foreground/70">{analysis.strength}</p>
        </Card>
        <Card>
          <h3 className="mb-1 font-semibold">⚠️ 주의할 점</h3>
          <p className="text-sm text-foreground/70">{analysis.watchout}</p>
        </Card>
      </div>

      <Card>
        <h3 className="mb-2 font-semibold">🎯 오늘의 코치 노트</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/70">
          {analysis.coachNotes.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
        <Link
          href={`/journey/${analysis.recommendedStepIds[0]}`}
          className="mt-4 inline-block rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
        >
          추천 챕터로 이동
        </Link>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/consult">
          <Card className="h-full transition hover:border-foreground/30">
            <h3 className="mb-1 font-semibold">🧭 고민상담</h3>
            <p className="text-sm text-foreground/60">막힐 때마다 코치에게 고민을 털어놓으세요.</p>
          </Card>
        </Link>
        <Link href="/inspiration">
          <Card className="h-full transition hover:border-foreground/30">
            <h3 className="mb-1 font-semibold">💡 영감 노트</h3>
            <p className="text-sm text-foreground/60">이슈·불편·불만에서 아이템 아이디어를 찾아보세요.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
