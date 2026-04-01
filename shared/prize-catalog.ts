export type PrizeTier = "win" | "lose";
export type PrizeTone = "gold" | "blue";

export interface PrizeDefinition {
  id: string;
  amount: number;
  label: string;
  tier: PrizeTier;
  tone: PrizeTone;
  weight: number;
}

export const PRIZES: PrizeDefinition[] = [
  { id: "ton-010", amount: 0.1, label: "0.10 TON", tier: "lose", tone: "blue", weight: 10 },
  { id: "ton-020", amount: 0.2, label: "0.20 TON", tier: "lose", tone: "blue", weight: 20 },
  { id: "ton-030", amount: 0.3, label: "0.30 TON", tier: "lose", tone: "blue", weight: 25 },
  { id: "ton-050", amount: 0.5, label: "0.50 TON", tier: "lose", tone: "blue", weight: 25 },
  { id: "ton-070", amount: 0.7, label: "0.70 TON", tier: "lose", tone: "blue", weight: 15 },
  { id: "ton-090", amount: 0.9, label: "0.90 TON", tier: "lose", tone: "blue", weight: 5 },

  { id: "ton-105", amount: 1.05, label: "1.05 TON", tier: "win", tone: "gold", weight: 32 },
  { id: "ton-110", amount: 1.1, label: "1.10 TON", tier: "win", tone: "gold", weight: 28 },
  { id: "ton-125", amount: 1.25, label: "1.25 TON", tier: "win", tone: "gold", weight: 20 },
  { id: "ton-150", amount: 1.5, label: "1.50 TON", tier: "win", tone: "gold", weight: 15 },
  { id: "ton-200", amount: 2, label: "2.00 TON", tier: "win", tone: "gold", weight: 4 },
  { id: "ton-500", amount: 5, label: "5.00 TON", tier: "win", tone: "gold", weight: 1 }
];

export const PRIZE_LOOKUP = Object.fromEntries(PRIZES.map((prize) => [prize.id, prize]));

export function getPrizeById(prizeId: string): PrizeDefinition {
  const prize = PRIZE_LOOKUP[prizeId];
  if (!prize) {
    throw new Error(`Unknown prize id: ${prizeId}`);
  }
  return prize;
}

export function formatTon(amount: number): string {
  return `${amount.toFixed(amount % 1 === 0 ? 0 : 2)} TON`;
}
