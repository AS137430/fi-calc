import { MarketDataValue } from 'stock-market-data';

export interface AdditionalWithdrawal {
  name: string;
  value: number;
  inflationAdjusted: boolean;
  duration: number;
  startYear: number;
}

export type AdditionalWithdrawals = AdditionalWithdrawal[];

export interface PortfolioInvestment {
  percentage: number;
  type: InvestmentType;
  fees: number;
  value: number;
  annualGrowthAmount?: number;
}

export interface Portfolio {
  totalValue: number;
  totalValueInFirstYearDollars: number;
  investments: PortfolioInvestment[];
}

export interface WithdrawalPlan {
  withdrawalStrategy: {
    key: string;
  };

  /* Constant Spending */
  annualWithdrawal: number;
  inflationAdjustedFirstYearWithdrawal: boolean;

  /* Percentage of Portfolio */
  percentageOfPortfolio: number;
  minWithdrawalLimit: number;
  maxWithdrawalLimit: number;
  minWithdrawalLimitEnabled: boolean;
  maxWithdrawalLimitEnabled: boolean;

  /* Guyton-Klinger */
  gkInitialSpending: number;
  gkWithdrawalUpperLimit: number;
  gkWithdrawalLowerLimit: number;
  gkUpperLimitAdjustment: number;
  gkLowerLimitAdjustment: number;
  gkIgnoreLastFifteenYears: boolean;
  gkModifiedWithdrawalRule: boolean;

  ninetyFiveInitialRate: number;
  ninetyFivePercentage: number;

  capeWithdrawalRate: number;
  capeWeight: number;
}

export enum MarketDataGrowthKeys {
  stockMarketGrowth = 'stockMarketGrowth',
  none = 'none',
}

export enum InvestmentType {
  equity = 'equity',
  bonds = 'bonds',
}

export enum SpendingMethods {
  inflationAdjusted = 'inflationAdjusted',
  notInflationAdjusted = 'notInflationAdjusted',
  portfolioPercent = 'portfolioPercent',
  guytonKlinger = 'guytonKlinger',
  ninetyFivePercentRule = 'ninetyFivePercentRule',
  capeBased = 'capeBased',
}

interface AdjustedInvestment extends PortfolioInvestment {
  valueBeforeChange: number;
  valueAfterWithdrawal: number;
  growth: number;
  dividends: number;
  percentage: number;
  value: number;
}

export interface ComputedData {
  cumulativeInflation: number;
  totalWithdrawalAmount: number;
  totalWithdrawalAmountInFirstYearDollars: number;
  portfolio: Portfolio;
}

export interface YearResult {
  year: number;
  isOutOfMoney: boolean;
  marketData: any;
  cpi: number;
  computedData: ComputedData;
}

export type ResultsByYear = YearResult[];

export interface YearData extends MarketDataValue {
  [MarketDataGrowthKeys.stockMarketGrowth]: number;
  [MarketDataGrowthKeys.none]: number;
}

export interface MarketData {
  [Key: string]: YearData;
  [Key: number]: YearData;
}

export interface DipObject {
  year: number;
  value: number;
  startYear: number;
}
