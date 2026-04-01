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

  const isHighlight = result.prizeAmount >= 1;

  return (
    <div className="result-toast-backdrop" onClick={onClose}>
      <div
        className={`result-toast ${isHighlight ? "is-highlight" : "is-regular"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="result-toast__badge">Prize received</div>
        <h3>{formatTon(result.prizeAmount)}</h3>
        <p className="result-toast__meta">Your balance is now {formatTon(result.newBalance)}.</p>
        <button className="primary-button" onClick={onClose}>
          Continue
        </button>
      </div>
    </div>
  );
}
