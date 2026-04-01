import { getPrizeById } from "./prize-catalog";

export const SPIN_COST = 1;
export const REEL_ITEM_HEIGHT = 108;
export const REEL_VISIBLE_ROWS = 5;
export const REEL_REPEAT_COUNT = 26;

export const BASE_REEL_SEQUENCE = [
  "ton-500",
  "ton-020",
  "ton-110",
  "ton-005",
  "ton-2000",
  "ton-010",
  "ton-150",
  "ton-001",
  "ton-105",
  "ton-050",
  "ton-1000",
  "ton-002",
  "ton-120",
  "ton-035",
  "ton-5000",
  "ton-080",
  "ton-101",
  "ton-200"
] as const;

export const INITIAL_REEL_INDEX = BASE_REEL_SEQUENCE.length * 6;
export const MIN_SERVER_STOP_INDEX = BASE_REEL_SEQUENCE.length * 12;
export const MAX_SERVER_STOP_INDEX = BASE_REEL_SEQUENCE.length * 16;

export function buildVirtualReel(repeatCount = REEL_REPEAT_COUNT): string[] {
  return Array.from({ length: repeatCount }, () => [...BASE_REEL_SEQUENCE]).flat();
}

export function getPrizeLabelForTile(prizeId: string): string {
  return getPrizeById(prizeId).label;
}
