"use client";

import { useLocalState } from "@/lib/storage";
import type {
  CheckIn,
  MeditationLog,
  PieEntry,
  ThoughtRecord,
  ValueItem,
} from "./types";

export const MIND_KEYS = {
  checkIns: "maeumgyeol:checkins",
  records: "maeumgyeol:records",
  values: "maeumgyeol:values",
  meditations: "maeumgyeol:meditations",
  pies: "maeumgyeol:pies",
} as const;

const EMPTY_CHECKINS: CheckIn[] = [];
const EMPTY_RECORDS: ThoughtRecord[] = [];
const EMPTY_VALUES: ValueItem[] = [];
const EMPTY_MEDS: MeditationLog[] = [];
const EMPTY_PIES: PieEntry[] = [];

export const useCheckIns = () => useLocalState(MIND_KEYS.checkIns, EMPTY_CHECKINS);
export const useRecords = () => useLocalState(MIND_KEYS.records, EMPTY_RECORDS);
export const useValues = () => useLocalState(MIND_KEYS.values, EMPTY_VALUES);
export const useMeditations = () => useLocalState(MIND_KEYS.meditations, EMPTY_MEDS);
export const usePies = () => useLocalState(MIND_KEYS.pies, EMPTY_PIES);

export const newId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
