import { formatTon, getPrizeById } from "../../../../../../shared/prize-catalog";

interface PrizeTileProps {
  prizeId: string;
  isCenter?: boolean;
  isWinningTarget?: boolean;
}

export function PrizeTile({ prizeId, isCenter = false, isWinningTarget = false }: PrizeTileProps) {
  const prize = getPrizeById(prizeId);

  return (
    <div
      className={[
        "prize-tile",
        prize.tone === "gold" ? "prize-tile--gold" : "prize-tile--blue",
        isCenter ? "is-center" : "",
        isWinningTarget ? "is-target" : ""
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="prize-tile__ticket-cut left" />
      <div className="prize-tile__ticket-cut right" />

      <div className="prize-tile__coin">
        <span>◈</span>
      </div>

      <div className="prize-tile__amount">{formatTon(prize.amount)}</div>
      <div className="prize-tile__caption">TON</div>
    </div>
  );
}
