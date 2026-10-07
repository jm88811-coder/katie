"use client";

import { useEffect } from "react";
import { useLocalState } from "@/lib/storage";
import type { BirthInput } from "./core";

export const SAJU_KEYS = {
  profiles: "saju:profiles",
  visits: "saju:visits",
  waitlist: "saju:waitlist",
} as const;

const NO_PROFILES: BirthInput[] = [];
const NO_VISITS: string[] = [];

export function useProfiles() {
  const { value, setValue, hydrated } = useLocalState<BirthInput[]>(SAJU_KEYS.profiles, NO_PROFILES);
  const save = (b: BirthInput) =>
    setValue((prev) => {
      const key = (x: BirthInput) => `${x.year}-${x.month}-${x.day}-${x.hour}-${x.gender}-${x.calendar}-${x.name}`;
      return [b, ...prev.filter((p) => key(p) !== key(b))].slice(0, 8);
    });
  const remove = (i: number) => setValue((prev) => prev.filter((_, idx) => idx !== i));
  return { profiles: value, save, remove, hydrated };
}

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** 오늘 방문을 기록하고 연속 방문일(스트릭)을 계산 */
export function useStreak(record = false) {
  const { value, setValue, hydrated } = useLocalState<string[]>(SAJU_KEYS.visits, NO_VISITS);
  const today = dayKey();

  useEffect(() => {
    if (record && hydrated && !value.includes(today)) {
      setValue((prev) => [...prev.filter((d) => d !== today), today].slice(-60));
    }
  }, [record, hydrated, value, today, setValue]);

  const set = new Set(value);
  let streak = 0;
  const cur = new Date();
  // 오늘 기록이 아직 없으면 어제부터 센다
  if (!set.has(dayKey(cur))) cur.setDate(cur.getDate() - 1);
  while (set.has(dayKey(cur))) {
    streak++;
    cur.setDate(cur.getDate() - 1);
  }
  return { streak: record && hydrated && !set.has(today) ? streak + 1 : streak, hydrated };
}

export function useWaitlist() {
  const { value, setValue } = useLocalState<string[]>(SAJU_KEYS.waitlist, NO_VISITS);
  return { joined: value, join: (id: string) => setValue((p) => (p.includes(id) ? p : [...p, id])) };
}
