export interface PrizeWinningItem {
  id: string;
  itemName: string;
  redemptionDate: string;
  failureDescription: string;
  prizeWinner: {
    winnerPhone: string;
    winnerRegion: string;
    winnerOperator: string;
    salesRep: { userEmail: string; userPhone: string; userName: string };
  };
}
