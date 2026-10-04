"use client";

import { Card, Tag } from "@/components/Card";
import { STUDY_CATEGORIES } from "@/lib/data/study";

export default function StudyPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">📚 스터디 카테고리</h1>
        <p className="mt-2 text-sm text-foreground/60">
          사업가에게 필요한 지식을 분야별로 정리했습니다. 매주 1개 주제를 골라 학습 계획을
          세워보세요.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {STUDY_CATEGORIES.map((cat) => (
          <Card key={cat.id}>
            <h2 className="font-semibold">{cat.title}</h2>
            <p className="mt-1 text-sm text-foreground/60">{cat.description}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {cat.topics.map((topic) => (
                <li key={topic.id} className="rounded-lg border border-black/10 p-2.5 text-sm dark:border-white/10">
                  <div className="mb-1 flex items-center gap-2">
                    <Tag>{topic.label}</Tag>
                  </div>
                  <p className="text-foreground/60">{topic.detail}</p>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
