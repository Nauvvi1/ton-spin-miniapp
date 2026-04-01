export interface SpinResponse {
  spinId: string;
  outcome: "win" | "lose";
  prizeId: string;
  prizeAmount: number;
  targetVirtualIndex: number;
  spentAmount: number;
  netDelta: number;
  newBalance: number;
}
