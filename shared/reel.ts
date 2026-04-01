import { getPrizeById } from "./prize-catalog";

export const SPIN_COST = 1;
export const REEL_ITEM_HEIGHT = 108;
export const REEL_VISIBLE_ROWS = 5;
export const REEL_REPEAT_COUNT = 28;

export const BASE_REEL_SEQUENCE = [
  "ton-150",
  "ton-020",
  "ton-125",
  "ton-050",
  "ton-200",
  "ton-030",
  "ton-110",
  "ton-070",
  "ton-500",
  "ton-010",
  "ton-105",
  "ton-090"
] as const;

export const INITIAL_REEL_INDEX = BASE_REEL_SEQUENCE.length * 6;
export const MIN_SERVER_STOP_INDEX = BASE_REEL_SEQUENCE.length * 18;
export const MAX_SERVER_STOP_INDEX = BASE_REEL_SEQUENCE.length * 24;

export function buildVirtualReel(repeatCount = REEL_REPEAT_COUNT): string[] {
  return Array.from({ length: repeatCount }, () => [...BASE_REEL_SEQUENCE]).flat();
}

export function getPrizeLabelForTile(prizeId: string): string {
  return getPrizeById(prizeId).label;
}
