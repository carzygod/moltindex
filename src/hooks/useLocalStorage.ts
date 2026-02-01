import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored) as T;
      }
    } catch (error) {
      console.error("[useLocalStorage] parse failure", error);
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error("[useLocalStorage] save error", error);
    }
  }, [key, state]);

  const update = useCallback((value: T | ((prev: T) => T)) => {
    setState((prev) => (value instanceof Function ? value(prev) : value));
  }, []);

  return [state, update] as const;
}
