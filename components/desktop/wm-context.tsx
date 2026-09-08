"use client";

import { createContext, useContext } from "react";
import type { AppId, WindowId, WmState } from "@/lib/wm/types";
import type { WmAction } from "@/lib/wm/store";

export type WmApi = {
  state: WmState;
  dispatch: (action: WmAction) => void;
  openApp: (app: AppId) => void;
  close: (id?: WindowId) => void;
  exit: () => void;
  toggleTheme: () => void;
  togglePet: () => void;
  showKeys: () => void;
  showLauncher: () => void;
  petOn: boolean;
  bootedAt: number;
};

const WmContext = createContext<WmApi | null>(null);

export const WmProvider = WmContext.Provider;

export function useWm(): WmApi {
  const value = useContext(WmContext);
  if (!value) throw new Error("useWm must be used inside the desktop");
  return value;
}
