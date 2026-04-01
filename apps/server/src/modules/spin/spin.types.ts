export interface SpinResponse {
  spinId: string;
  prizeId: string;
  prizeAmount: number;
  targetVirtualIndex: number;
  spentAmount: number;
  netDelta: number;
  newBalance: number;
}
