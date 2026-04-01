import crypto from "node:crypto";
import {
  MAX_SERVER_STOP_INDEX,
  MIN_SERVER_STOP_INDEX,
  SPIN_COST,
  buildVirtualReel
} from "../../../../../shared/reel";
import { PRIZES, type PrizeDefinition } from "../../../../../shared/prize-catalog";
import { userStore } from "../user/user.store";
import type { SpinResponse } from "./spin.types";

function randomFloat(): number {
  const buffer = crypto.randomBytes(4);
  return buffer.readUInt32BE(0) / 0xffffffff;
}

function randomInt(min: number, max: number): number {
  return crypto.randomInt(min, max + 1);
}

function pickBucket(): "base" | "boost" {
  return crypto.randomInt(0, 2) === 0 ? "base" : "boost";
}

function weightedPick(prizes: PrizeDefinition[]): PrizeDefinition {
  const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0);
  let cursor = randomFloat() * totalWeight;

  for (const prize of prizes) {
    cursor -= prize.weight;

    if (cursor <= 0) {
      return prize;
    }
  }

  return prizes[prizes.length - 1];
}

function findTargetVirtualIndex(prizeId: string): number {
  const virtualReel = buildVirtualReel();
  const candidates: number[] = [];

  for (let index = MIN_SERVER_STOP_INDEX; index <= MAX_SERVER_STOP_INDEX; index += 1) {
    if (virtualReel[index] === prizeId) {
      candidates.push(index);
    }
  }

  if (candidates.length === 0) {
    throw new Error(`Could not find a matching tile for prize ${prizeId}`);
  }

  return candidates[randomInt(0, candidates.length - 1)];
}

export class SpinService {
  createSpin(telegramId: string): SpinResponse {
    const user = userStore.getOrCreate(telegramId);

    if (user.balance < SPIN_COST) {
      throw new Error("Not enough balance for a spin");
    }

    const bucket = pickBucket();
    const bucketPrizes = PRIZES.filter((prize) => prize.tier === bucket);
    const prize = weightedPick(bucketPrizes);

    const nextBalance = user.balance - SPIN_COST + prize.amount;
    const updatedUser = userStore.updateBalance(telegramId, nextBalance);

    return {
      spinId: crypto.randomUUID(),
      prizeId: prize.id,
      prizeAmount: prize.amount,
      targetVirtualIndex: findTargetVirtualIndex(prize.id),
      spentAmount: SPIN_COST,
      netDelta: Number((prize.amount - SPIN_COST).toFixed(2)),
      newBalance: updatedUser.balance
    };
  }
}

export const spinService = new SpinService();
