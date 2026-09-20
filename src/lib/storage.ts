"use client";

import { useCallback, useSyncExternalStore } from "react";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode, quota, etc.) — fail silently
  }
}

const cache = new Map<string, unknown>();
const listeners = new Map<string, Set<() => void>>();

function emit(key: string) {
  listeners.get(key)?.forEach((l) => l());
}

function subscribe(key: string, callback: () => void) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  const set = listeners.get(key)!;
  set.add(callback);
  return () => {
    set.delete(callback);
  };
}

function getSnapshot<T>(key: string, fallback: T): T {
  if (!cache.has(key)) {
    cache.set(key, readStorage(key, fallback));
  }
  return cache.get(key) as T;
}

/** SSR-safe localStorage-backed state hook, built on useSyncExternalStore. */
export function useLocalState<T>(key: string, fallback: T) {
  const subscribeFn = useCallback((cb: () => void) => subscribe(key, cb), [key]);
  const getClientSnapshot = useCallback(() => getSnapshot(key, fallback), [key, fallback]);
  const getServerSnapshot = useCallback(() => fallback, [fallback]);

  const value = useSyncExternalStore(subscribeFn, getClientSnapshot, getServerSnapshot);
  const hydrated = useHydrated();

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = getSnapshot(key, fallback);
      const resolved = typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
      cache.set(key, resolved);
      writeStorage(key, resolved);
      emit(key);
    },
    [key, fallback]
  );

  return { value, setValue, hydrated };
}

/** True once the component has mounted on the client (avoids hydration mismatches). */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export const STORAGE_KEYS = {
  profile: "founderstory:profile",
  journeyProgress: "founderstory:journey-progress",
  inspirationNotes: "founderstory:inspiration-notes",
  consultLog: "founderstory:consult-log",
} as const;
