export interface PricePoint {
  date: string;
  close: number;
}

export interface StockResponse {
  ticker: string;
  companyName: string;
  exchange: string;
  currency: string;
  currentPrice: number;
  changeAmount: number;
  changePercent: number;
  prices: PricePoint[];
}
