import { formatTon } from "../../../../../../shared/prize-catalog";
import type { SpinResponse } from "../types";

interface ResultToastProps {
  result: SpinResponse | null;
  onClose: () => void;
}

export function ResultToast({ result, onClose }: ResultToastProps) {
  if (!result) {
    return null;
  }

  const isWin = result.outcome === "win";

  return (
    <div className="result-toast-backdrop" onClick={onClose}>
      <div className={`result-toast ${isWin ? "is-win" : "is-lose"}`} onClick={(event) => event.stopPropagation()}>
        <div className="result-toast__badge">{isWin ? "WIN" : "LOSE"}</div>
        <h3>{isWin ? "Хороший спин" : "Не повезло"}</h3>
        <p className="result-toast__amount">{formatTon(result.prizeAmount)}</p>
        <p className="result-toast__meta">
          {isWin ? "Сервер выбрал выигрышный bucket 50/50" : "Сервер выбрал проигрышный bucket 50/50"}
        </p>
        <button className="primary-button" onClick={onClose}>
          Продолжить
        </button>
      </div>
    </div>
  );
}
