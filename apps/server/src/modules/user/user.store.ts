import { env } from "../../config/env";

export interface UserState {
  telegramId: string;
  username?: string;
  firstName?: string;
  balance: number;
  totalSpins: number;
  createdAt: string;
  updatedAt: string;
}

export class InMemoryUserStore {
  private readonly users = new Map<string, UserState>();

  getOrCreate(telegramId: string, profile?: Pick<UserState, "username" | "firstName">): UserState {
    const existing = this.users.get(telegramId);

    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();

    const created: UserState = {
      telegramId,
      username: profile?.username,
      firstName: profile?.firstName,
      balance: env.sessionStartBalance,
      totalSpins: 0,
      createdAt: now,
      updatedAt: now
    };

    this.users.set(telegramId, created);
    return created;
  }

  updateBalance(telegramId: string, nextBalance: number): UserState {
    const current = this.users.get(telegramId);

    if (!current) {
      throw new Error("User does not exist");
    }

    const updated: UserState = {
      ...current,
      balance: Number(nextBalance.toFixed(2)),
      totalSpins: current.totalSpins + 1,
      updatedAt: new Date().toISOString()
    };

    this.users.set(telegramId, updated);
    return updated;
  }
}

export const userStore = new InMemoryUserStore();
