"use client";

import { createContext, useContext, useLayoutEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

type Controls = { mic: HTMLButtonElement; busy: boolean };
const ControlsContext = createContext<Controls | null>(null);
const RegisterContext = createContext<Dispatch<SetStateAction<Controls | null>> | null>(null);

export function ComposerControlsProvider({ children }: { children: ReactNode }) {
  const [controls, register] = useState<Controls | null>(null);
  return <RegisterContext.Provider value={register}>
    <ControlsContext.Provider value={controls}>{children}</ControlsContext.Provider>
  </RegisterContext.Provider>;
}

export const useComposerControls = () => useContext(ControlsContext);

// The shell's picker also opens on pages without a composer. Only offer
// dictation when a mounted editor can handle its normal recording/login flow.
export function useRegisterComposer(busy: boolean) {
  const register = useContext(RegisterContext);
  const micRef = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    const mic = micRef.current;
    if (!mic || !register) return;
    register({ mic, busy });
    return () => register(current => current?.mic === mic ? null : current);
  }, [register, busy]);
  return micRef;
}
