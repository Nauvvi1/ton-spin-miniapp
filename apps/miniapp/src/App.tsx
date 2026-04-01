import { useEffect } from "react";
import { formatTon } from "../../../shared/prize-catalog";
import { initTelegramMiniApp } from "./lib/telegram";
import { ResultToast } from "./features/spin/components/ResultToast";
import { SpinMachine } from "./features/spin/components/SpinMachine";
import { useSpin } from "./features/spin/hooks/useSpin";

export default function App() {
  const {
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
  } = useSpin();

  useEffect(() => {
    initTelegramMiniApp();
  }, []);

  const userInitial = session.user.displayName?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="screen">
      <div className="screen__pattern" />

      <main className="phone-shell">
        <header className="topbar">
          <div className="topbar__spin-meta">
            1 SPIN • {formatTon(session.spinCost)}
          </div>

          <div className="topbar__right">
            <div className="topbar__balance-chip">
              <img className="ton-inline" src="/assets/ton.png" alt="TON" />
              <span>{formatTon(session.balance)}</span>
            </div>

            <div className="topbar__avatar" aria-label={session.user.displayName}>
              {userInitial}
            </div>
          </div>
        </header>

        <section className="reel-area">
          <SpinMachine
            spinTargetIndex={spinTargetIndex}
            isSpinning={isSpinning}
            onSpinAnimationEnd={finishSpinAnimation}
          />
        </section>

        <footer className="bottom-bar">
          <div className="bottom-bar__meta">
            <span className="bottom-bar__meta-label">Last</span>
            <strong>{lastPrize ? formatTon(lastPrize.prizeAmount) : "-"}</strong>
          </div>

          {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}

          <div className="actions-row">
            <button
              className={`secondary-button ${isAutoSpinEnabled ? "is-active" : ""}`}
              type="button"
              disabled={!canSpin && !isAutoSpinEnabled}
              onClick={toggleAutoSpin}
            >
              {isAutoSpinEnabled ? "Stop Auto Spin" : "Auto Spin"}
            </button>

            <button
              className="primary-button"
              type="button"
              disabled={!canSpin || isSubmittingSpin || isSpinning}
              onClick={() => void startSpin()}
            >
              {isSpinning ? "Spinning..." : `Spin ${formatTon(session.spinCost)}`}
            </button>
          </div>
        </footer>
      </main>

      <ResultToast result={resultToast} onClose={dismissResult} />
    </div>
  );
}