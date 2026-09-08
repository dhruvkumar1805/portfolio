"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Server render assumes the desktop case; the client corrects on first paint. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** A phone or tablet: no keyboard, so the session drops to one window and a dock. */
export const TOUCH_QUERY = "(pointer: coarse) and (max-width: 900px)";
