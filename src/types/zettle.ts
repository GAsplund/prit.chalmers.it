export interface ZettlePurchase {
  uuid: string;
  totalAmount: number;
  currency: string;
  created: string;
  refund: boolean;
}

export interface ZettlePurchaseListResponse {
  purchases: ZettlePurchase[];
  lastPurchaseHash?: string;
}
