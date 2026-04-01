import { useEffect } from "react";
import { formatTon } from "../../../shared/prize-catalog";
import { initTelegramMiniApp } from "./lib/telegram";
import { ResultToast } from "./features/spin/components/ResultToast";
import { SpinMachine } from "./features/spin/components/SpinMachine";
import { useSpin } from "./features/spin/hooks/useSpin";

export default function App() {
  const {
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
  } = useSpin();

  useEffect(() => {
    initTelegramMiniApp();
    void loadSession();
  }, [loadSession]);

  return (
    <div className="screen">
      <div className="screen__pattern" />

      <main className="phone-shell">
        <header className="topbar">
          <div>
            <p className="topbar__eyebrow">Telegram mini app</p>
            <h1>TON Spin</h1>
          </div>

          <div className="topbar__user">
            <span>{session.user.displayName}</span>
          </div>
        </header>

        <section className="hero-card">
          <div className="hero-card__title-row">
            <div>
              <p className="hero-card__kicker">Серверный результат</p>
              <h2>Вертикальная рулетка</h2>
            </div>

            <div className="hero-card__price-pill">1 TON / spin</div>
          </div>

          <p className="hero-card__description">
            Сервер решает результат по схеме <strong>50/50</strong>, клиент только проигрывает
            красивую анимацию и останавливается на заранее выбранной плитке.
          </p>

          <SpinMachine
            spinTargetIndex={spinTargetIndex}
            isSpinning={isSpinning}
            onSpinAnimationEnd={finishSpinAnimation}
          />

          <div className="balance-strip">
            <div className="balance-strip__left">
              <span className="balance-strip__label">Баланс</span>
              <strong>{formatTon(session.balance)}</strong>
            </div>

            <div className="balance-strip__right">
              <span className="balance-strip__label">Статус</span>
              <strong>{isSpinning ? "Вращается..." : isSubmittingSpin ? "Готовим спин..." : "Готово"}</strong>
            </div>
          </div>

          {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}

          <div className="actions-row">
            <button className="secondary-button" type="button" disabled>
              Авто-спин
            </button>

            <button
              className="primary-button"
              type="button"
              disabled={!canSpin || isSessionLoading || isSubmittingSpin}
              onClick={() => void startSpin()}
            >
              {isSessionLoading ? "Загрузка..." : isSubmittingSpin ? "Запрос..." : `Крутить за ${formatTon(session.spinCost)}`}
            </button>
          </div>
        </section>

        <section className="footnote-card">
          <div className="footnote-card__badge">DEV NOTE</div>
          <p>
            Здесь уже есть нормальная база для расширения: бот, API, mini app, серверная
            рулетка, разнесенные модули и анимированный UI.
          </p>
        </section>
      </main>

      <ResultToast result={resultToast} onClose={dismissResult} />
    </div>
  );
}
