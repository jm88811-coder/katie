"use client";

import { Card } from "@/components/Card";
import { AI_JOBS } from "@/lib/data/aiJobs";

export default function AiJobsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">🤖 AI 시대의 새로운 직업군</h1>
        <p className="mt-2 text-sm text-foreground/60">
          AI 확산으로 새롭게 떠오르는 역할들입니다. 내 사업 아이템(서비스화) 또는 커리어 전환의
          힌트로 활용해보세요.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {AI_JOBS.map((job) => (
          <Card key={job.id}>
            <h3 className="font-semibold">{job.title}</h3>
            <p className="mt-2 text-sm text-foreground/70">
              <span className="font-medium text-foreground/50">왜 뜨는가 · </span>
              {job.why}
            </p>
            <p className="mt-1.5 text-sm text-foreground/70">
              <span className="font-medium text-foreground/50">지금 준비할 것 · </span>
              {job.prepare}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
