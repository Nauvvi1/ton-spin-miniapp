export interface SessionResponse {
  user: {
    telegramId: string;
    username?: string;
    firstName?: string;
    displayName: string;
  };
  balance: number;
  spinCost: number;
}

export interface SpinResponse {
  spinId: string;
  prizeId: string;
  prizeAmount: number;
  targetVirtualIndex: number;
  spentAmount: number;
  netDelta: number;
  newBalance: number;
}
