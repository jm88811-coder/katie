import { useCallback, useState } from 'react';

export function useLocalStore<T>(key: string, initial: T[]) {
  const [items, setItems] = useState<T[]>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T[]) : initial;
    } catch {
      return initial;
    }
  });

  const persist = useCallback(
    (next: T[]) => {
      setItems(next);
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // storage full or unavailable; ignore
      }
    },
    [key],
  );

  return [items, persist] as const;
}
