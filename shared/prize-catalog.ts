export type PrizeTier = "base" | "boost";
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
  { id: "ton-001", amount: 0.01, label: "0.01 TON", tier: "base", tone: "blue", weight: 120 },
  { id: "ton-002", amount: 0.02, label: "0.02 TON", tier: "base", tone: "blue", weight: 110 },
  { id: "ton-005", amount: 0.05, label: "0.05 TON", tier: "base", tone: "blue", weight: 90 },
  { id: "ton-010", amount: 0.1, label: "0.10 TON", tier: "base", tone: "blue", weight: 70 },
  { id: "ton-020", amount: 0.2, label: "0.20 TON", tier: "base", tone: "blue", weight: 45 },
  { id: "ton-035", amount: 0.35, label: "0.35 TON", tier: "base", tone: "blue", weight: 25 },
  { id: "ton-050", amount: 0.5, label: "0.50 TON", tier: "base", tone: "blue", weight: 10 },
  { id: "ton-080", amount: 0.8, label: "0.80 TON", tier: "base", tone: "blue", weight: 4 },

  { id: "ton-101", amount: 1.01, label: "1.01 TON", tier: "boost", tone: "gold", weight: 120 },
  { id: "ton-105", amount: 1.05, label: "1.05 TON", tier: "boost", tone: "gold", weight: 90 },
  { id: "ton-110", amount: 1.1, label: "1.10 TON", tier: "boost", tone: "gold", weight: 70 },
  { id: "ton-120", amount: 1.2, label: "1.20 TON", tier: "boost", tone: "gold", weight: 45 },
  { id: "ton-150", amount: 1.5, label: "1.50 TON", tier: "boost", tone: "gold", weight: 20 },
  { id: "ton-200", amount: 2, label: "2.00 TON", tier: "boost", tone: "gold", weight: 10 },
  { id: "ton-500", amount: 5, label: "5.00 TON", tier: "boost", tone: "gold", weight: 5 },
  { id: "ton-1000", amount: 10, label: "10.00 TON", tier: "boost", tone: "gold", weight: 2 },
  { id: "ton-2000", amount: 20, label: "20.00 TON", tier: "boost", tone: "gold", weight: 1 },
  { id: "ton-5000", amount: 50, label: "50.00 TON", tier: "boost", tone: "gold", weight: 1 }
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
  const decimals = amount % 1 === 0 ? 0 : amount < 0.1 ? 2 : 2;
  return `${amount.toFixed(decimals)} TON`;
}

export function formatTonValue(amount: number): string {
  if (amount >= 10 && amount % 1 === 0) {
    return String(amount);
  }

  if (amount >= 1) {
    return amount.toFixed(amount % 1 === 0 ? 0 : 2).replace(/\.00$/, "");
  }

  return amount.toFixed(amount < 0.1 ? 2 : 2).replace(/0+$/, "").replace(/\.$/, "");
}
