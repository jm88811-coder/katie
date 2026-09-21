"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useLocalState, STORAGE_KEYS } from "@/lib/storage";
import { FounderProfile } from "@/lib/types";

export function useProfile() {
  return useLocalState<FounderProfile | null>(STORAGE_KEYS.profile, null);
}

export default function RequireProfile({ children }: { children: (profile: FounderProfile) => ReactNode }) {
  const { value: profile, hydrated } = useProfile();

  if (!hydrated) {
    return <div className="py-20 text-center text-foreground/50">불러오는 중...</div>;
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <p className="mb-4 text-foreground/70">
          먼저 나의 사업가 프로필을 만들어야 여정을 시작할 수 있어요.
        </p>
        <Link
          href="/onboarding"
          className="inline-block rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
        >
          프로필 만들기
        </Link>
      </div>
    );
  }

  return <>{children(profile)}</>;
}
