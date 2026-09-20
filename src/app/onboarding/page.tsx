"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/components/RequireProfile";
import { Card } from "@/components/Card";
import { FounderProfile, MBTI } from "@/lib/types";

const MBTI_OPTIONS: MBTI[] = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
  "모름",
];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground/80">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50 dark:border-white/15";

export default function OnboardingPage() {
  const router = useRouter();
  const { setValue: setProfile, value: existing } = useProfile();

  const [form, setForm] = useState<Omit<FounderProfile, "createdAt">>({
    name: existing?.name ?? "",
    birthDate: existing?.birthDate ?? "",
    birthTime: existing?.birthTime ?? "",
    mbti: existing?.mbti ?? "모름",
    failureStory: existing?.failureStory ?? "",
    successStory: existing?.successStory ?? "",
    direction: existing?.direction ?? "",
    purpose: existing?.purpose ?? "",
    goal: existing?.goal ?? "",
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setProfile({ ...form, createdAt: new Date().toISOString() });
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">나의 사업가 프로필</h1>
      <p className="mt-2 text-sm text-foreground/60">
        사주에서 이름과 생년월일시로 사람을 이해하듯, 여기서는 당신의 이야기와 성향으로
        사업가로서의 원형과 다음 챕터를 설계합니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="이름">
              <input
                required
                className={inputClass}
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="홍길동"
              />
            </Field>
            <Field label="MBTI / 성향">
              <select
                className={inputClass}
                value={form.mbti}
                onChange={(e) => update("mbti", e.target.value as MBTI)}
              >
                {MBTI_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="생년월일">
              <input
                required
                type="date"
                className={inputClass}
                value={form.birthDate}
                onChange={(e) => update("birthDate", e.target.value)}
              />
            </Field>
            <Field label="출생 시각 (선택)">
              <input
                type="time"
                className={inputClass}
                value={form.birthTime}
                onChange={(e) => update("birthTime", e.target.value)}
              />
            </Field>
          </div>
        </Card>

        <Card>
          <Field label="실패 경험담">
            <textarea
              required
              rows={4}
              className={inputClass}
              value={form.failureStory}
              onChange={(e) => update("failureStory", e.target.value)}
              placeholder="가장 크게 배운 실패 경험을 적어주세요."
            />
          </Field>
          <div className="h-4" />
          <Field label="성공 경험담">
            <textarea
              required
              rows={4}
              className={inputClass}
              value={form.successStory}
              onChange={(e) => update("successStory", e.target.value)}
              placeholder="가장 뿌듯했던 성공/성취 경험을 적어주세요."
            />
          </Field>
        </Card>

        <Card>
          <Field label="지향점 (어떤 사업가가 되고 싶은가)">
            <input
              required
              className={inputClass}
              value={form.direction}
              onChange={(e) => update("direction", e.target.value)}
              placeholder="예: 지역 소상공인을 돕는 브랜드를 만들고 싶다"
            />
          </Field>
          <div className="h-4" />
          <Field label="목적 (왜 사업을 하려는가)">
            <input
              required
              className={inputClass}
              value={form.purpose}
              onChange={(e) => update("purpose", e.target.value)}
              placeholder="예: 시간과 돈으로부터 자유로워지고 싶다"
            />
          </Field>
          <div className="h-4" />
          <Field label="목표 (구체적인 목표)">
            <input
              required
              className={inputClass}
              value={form.goal}
              onChange={(e) => update("goal", e.target.value)}
              placeholder="예: 3년 안에 월 순수익 1,000만원 시스템 구축"
            />
          </Field>
        </Card>

        <button
          type="submit"
          className="self-start rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background hover:opacity-90"
        >
          여정 생성하기
        </button>
      </form>
    </div>
  );
}
