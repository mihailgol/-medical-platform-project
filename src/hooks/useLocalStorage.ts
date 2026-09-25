import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  // Initialize state with stored value or fallback
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
    } catch (error) {
      console.warn(`[useLocalStorage] Error reading key "${key}":`, error);
    }
    return initialValue;
  });

  // Track initial mount to prevent redundant first write
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      // If no item existed in localStorage, seed it with the initial value
      if (window.localStorage.getItem(key) === null) {
        try {
          window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
          console.warn(`[useLocalStorage] Error initializing key "${key}":`, error);
        }
      }
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`[useLocalStorage] Error writing key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
