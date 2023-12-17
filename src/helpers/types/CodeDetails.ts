export interface CodeDetails {
  id: string;
  itemName: string;
  itemUnit: number;
  isRedeemed: boolean;
  redemptionDate: string;
  isFulfilled: boolean;
  fulfillmentDate: string;
  itemType: {
    id: string;
  };
  prizeWinner: {
    winnerPhone: string;
    winnerRegion: string;
    winnerLocation: string;
    outletName: string;
    salesRep: {
      userName: string;
      userPhone: string;
      userEmail: string;
    };
  };
}
