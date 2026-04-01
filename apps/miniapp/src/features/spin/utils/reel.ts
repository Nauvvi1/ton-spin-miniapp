import {
  BASE_REEL_SEQUENCE,
  INITIAL_REEL_INDEX,
  REEL_ITEM_HEIGHT,
  REEL_REPEAT_COUNT,
  REEL_VISIBLE_ROWS,
  buildVirtualReel
} from "../../../../../../shared/reel";

export const virtualReel = buildVirtualReel(REEL_REPEAT_COUNT);
export const reelWindowHeight = REEL_ITEM_HEIGHT * REEL_VISIBLE_ROWS;
export const reelCycleLength = BASE_REEL_SEQUENCE.length;

export function getTranslateYForIndex(index: number): number {
  const centerOffset = reelWindowHeight / 2 - REEL_ITEM_HEIGHT / 2;
  return index * REEL_ITEM_HEIGHT - centerOffset;
}

export function normalizeVirtualIndex(index: number): number {
  const middleCycle = Math.floor(REEL_REPEAT_COUNT / 2);
  const normalizedOffset = ((index % reelCycleLength) + reelCycleLength) % reelCycleLength;
  return middleCycle * reelCycleLength + normalizedOffset;
}

export function normalizeFloatVirtualIndex(index: number): number {
  const whole = Math.floor(index);
  const fractional = index - whole;
  return normalizeVirtualIndex(whole) + fractional;
}

export const defaultStartIndex = INITIAL_REEL_INDEX;
