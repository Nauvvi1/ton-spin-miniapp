import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiRequest } from "../../../api/http";
import { getTelegramDisplayName } from "../../../lib/telegram";
import type { SessionResponse, SpinResponse } from "../types";

const DEFAULT_START_BALANCE = Number(import.meta.env.VITE_SESSION_START_BALANCE ?? 25);

const fallbackSession: SessionResponse = {
  user: {
    telegramId: "local",
    displayName: getTelegramDisplayName()
  },
  balance: Number.isFinite(DEFAULT_START_BALANCE) ? DEFAULT_START_BALANCE : 25,
  spinCost: 1
};

export function useSpin() {
  const [session, setSession] = useState<SessionResponse>(fallbackSession);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSubmittingSpin, setIsSubmittingSpin] = useState(false);
  const [spinTargetIndex, setSpinTargetIndex] = useState<number | null>(null);
  const [pendingSpinResult, setPendingSpinResult] = useState<SpinResponse | null>(null);
  const [resultToast, setResultToast] = useState<SpinResponse | null>(null);
  const [lastPrize, setLastPrize] = useState<SpinResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAutoSpinEnabled, setIsAutoSpinEnabled] = useState(false);

  const autoSpinRef = useRef(isAutoSpinEnabled);
  autoSpinRef.current = isAutoSpinEnabled;

  const canSpin = useMemo(
    () => !isSpinning && session.balance >= session.spinCost,
    [isSpinning, session.balance, session.spinCost]
  );

  const startSpin = useCallback(async () => {
    if (!canSpin) {
      return;
    }

    setErrorMessage("");
    setResultToast(null);
    setPendingSpinResult(null);
    setSpinTargetIndex(null);
    setIsSpinning(true);
    setIsSubmittingSpin(true);

    try {
      const response = await apiRequest<SpinResponse>({
        path: "/api/spin",
        method: "POST",
        body: JSON.stringify({})
      });

      setPendingSpinResult(response);
      setSpinTargetIndex(response.targetVirtualIndex);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not complete the spin";
      setErrorMessage(message);
      setIsSpinning(false);

      if (autoSpinRef.current) {
        setIsAutoSpinEnabled(false);
      }
    } finally {
      setIsSubmittingSpin(false);
    }
  }, [canSpin]);

  const finishSpinAnimation = useCallback(() => {
    if (!pendingSpinResult) {
      setIsSpinning(false);
      return;
    }

    setSession((previous) => ({
      ...previous,
      balance: pendingSpinResult.newBalance
    }));
    setLastPrize(pendingSpinResult);

    if (!autoSpinRef.current) {
      setResultToast(pendingSpinResult);
    }

    setPendingSpinResult(null);
    setSpinTargetIndex(null);
    setIsSpinning(false);
  }, [pendingSpinResult]);

  const dismissResult = useCallback(() => {
    setResultToast(null);
  }, []);

  const toggleAutoSpin = useCallback(() => {
    setResultToast(null);
    setIsAutoSpinEnabled((previous) => !previous);
  }, []);

  useEffect(() => {
    if (session.balance < session.spinCost && isAutoSpinEnabled) {
      setIsAutoSpinEnabled(false);
    }
  }, [isAutoSpinEnabled, session.balance, session.spinCost]);

  useEffect(() => {
    if (!isAutoSpinEnabled || isSpinning || session.balance < session.spinCost) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void startSpin();
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [isAutoSpinEnabled, isSpinning, session.balance, session.spinCost, startSpin]);

  return {
    session,
    isSpinning,
    isSubmittingSpin,
    spinTargetIndex,
    resultToast,
    lastPrize,
    errorMessage,
    canSpin,
    isAutoSpinEnabled,
    startSpin,
    finishSpinAnimation,
    dismissResult,
    toggleAutoSpin
  };
}
