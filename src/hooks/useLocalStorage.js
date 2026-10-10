import { useCallback, useEffect, useState } from 'react';

const read = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
};

/** useState that persists to localStorage and survives private-mode failures. */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => read(key, initialValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore quota/private-mode errors — the in-memory state still works.
    }
  }, [key, value]);

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* noop */
    }
    setValue(initialValue);
  }, [key, initialValue]);

  return [value, setValue, remove];
}
