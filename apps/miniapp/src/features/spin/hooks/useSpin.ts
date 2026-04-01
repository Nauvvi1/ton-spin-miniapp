import { useCallback, useMemo, useState } from "react";
import { apiRequest } from "../../../api/http";
import { getTelegramDisplayName } from "../../../lib/telegram";
import type { SessionResponse, SpinResponse } from "../types";

const fallbackSession: SessionResponse = {
  user: {
    telegramId: "local",
    displayName: getTelegramDisplayName()
  },
  balance: 12,
  spinCost: 1
};

export function useSpin() {
  const [session, setSession] = useState<SessionResponse>(fallbackSession);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSubmittingSpin, setIsSubmittingSpin] = useState(false);
  const [spinTargetIndex, setSpinTargetIndex] = useState<number | null>(null);
  const [pendingSpinResult, setPendingSpinResult] = useState<SpinResponse | null>(null);
  const [resultToast, setResultToast] = useState<SpinResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const canSpin = useMemo(
    () => !isSessionLoading && !isSpinning && !isSubmittingSpin && session.balance >= session.spinCost,
    [isSessionLoading, isSpinning, isSubmittingSpin, session.balance, session.spinCost]
  );

  const loadSession = useCallback(async () => {
    try {
      setIsSessionLoading(true);
      const response = await apiRequest<SessionResponse>({
        path: "/api/session",
        method: "GET"
      });

      setSession(response);
      setErrorMessage("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось загрузить сессию";
      // setErrorMessage(message);
    } finally {
      setIsSessionLoading(false);
    }
  }, []);

  const startSpin = useCallback(async () => {
    if (!canSpin) {
      return;
    }

    try {
      setErrorMessage("");
      setResultToast(null);
      setIsSubmittingSpin(true);

      const response = await apiRequest<SpinResponse>({
        path: "/api/spin",
        method: "POST",
        body: JSON.stringify({})
      });

      setPendingSpinResult(response);
      setSpinTargetIndex(response.targetVirtualIndex);
      setIsSpinning(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось выполнить спин";
      setErrorMessage(message);
    } finally {
      setIsSubmittingSpin(false);
    }
  }, [canSpin]);

  const finishSpinAnimation = useCallback(() => {
    if (!pendingSpinResult) {
      return;
    }

    setSession((previous) => ({
      ...previous,
      balance: pendingSpinResult.newBalance
    }));
    setResultToast(pendingSpinResult);
    setPendingSpinResult(null);
    setSpinTargetIndex(null);
    setIsSpinning(false);
  }, [pendingSpinResult]);

  const dismissResult = useCallback(() => {
    setResultToast(null);
  }, []);

  return {
    session,
    isSessionLoading,
    isSpinning,
    isSubmittingSpin,
    spinTargetIndex,
    resultToast,
    errorMessage,
    canSpin,
    loadSession,
    startSpin,
    finishSpinAnimation,
    dismissResult
  };
}
