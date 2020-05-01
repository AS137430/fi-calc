import { MarketDataValue } from 'stock-market-data';

export enum MarketDataGrowthKeys {
  bondsGrowth = 'bondsGrowth',
  stockMarketGrowth = 'stockMarketGrowth',
  none = 'none',
}

export interface YearData extends MarketDataValue {
  [MarketDataGrowthKeys.bondsGrowth]: number;
  [MarketDataGrowthKeys.stockMarketGrowth]: number;
  [MarketDataGrowthKeys.none]: number;
  dividendYields: number;
}

export interface MarketData {
  [Key: string]: YearData;
  [Key: number]: YearData;
}