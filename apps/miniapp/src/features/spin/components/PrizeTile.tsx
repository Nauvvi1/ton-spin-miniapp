import { formatTonValue, getPrizeById } from "../../../../../../shared/prize-catalog";

interface PrizeTileProps {
  prizeId: string;
  isWinningTarget?: boolean;
}

export function PrizeTile({ prizeId, isWinningTarget = false }: PrizeTileProps) {
  const prize = getPrizeById(prizeId);

  return (
    <div
      className={[
        "prize-tile",
        prize.tone === "gold" ? "prize-tile--gold" : "prize-tile--blue",
        isWinningTarget ? "is-target" : ""
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="prize-tile__ticket-cut left" />
      <div className="prize-tile__ticket-cut right" />

      <div className="prize-tile__coin">
        <img className="prize-tile__coin-image" src="/assets/ton.png" alt="TON" />
      </div>

      <div className="prize-tile__amount">{formatTonValue(prize.amount)}</div>
      <div className="prize-tile__caption">TON</div>
    </div>
  );
}
