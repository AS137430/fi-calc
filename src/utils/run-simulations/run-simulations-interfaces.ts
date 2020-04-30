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

export interface WithdrawalStrategy {
  withdrawalStrategyName: {
    key: string;
  };

  /* Constant Withdrawal */
  annualWithdrawal: number;
  inflationAdjustedFirstYearWithdrawal: boolean;

  /* Percentage of Portfolio */
  percentageOfPortfolio: number;
  minWithdrawalLimit: number;
  maxWithdrawalLimit: number;
  minWithdrawalLimitEnabled: boolean;
  maxWithdrawalLimitEnabled: boolean;

  /* Guyton-Klinger */
  gkInitialWithdrawal: number;
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
  bondsGrowth = 'bondsGrowth',
  stockMarketGrowth = 'stockMarketGrowth',
  none = 'none',
}

export enum InvestmentType {
  equity = 'equity',
  bonds = 'bonds',
}

export enum WithdrawalStrategies {
  inflationAdjusted = 'inflationAdjusted',
  notInflationAdjusted = 'notInflationAdjusted',
  portfolioPercent = 'portfolioPercent',
  guytonKlinger = 'guytonKlinger',
  ninetyFivePercentRule = 'ninetyFivePercentRule',
  capeBased = 'capeBased',
}

export interface ComputedData {
  cumulativeInflation: number;
  totalWithdrawalAmount: number;
  baseWithdrawalAmount: number;
  additionalWithdrawalAmount: number;
  totalWithdrawalAmountInFirstYearDollars: number;
  startPortfolio: Portfolio | null;
  endPortfolio: Portfolio;
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

export interface YearResult {
  year: number;
  isOutOfMoney: boolean;
  marketData: YearData;
  cpi: number;
  computedData: ComputedData;
}

export type ResultsByYear = YearResult[];

export interface DipObject {
  year: number;
  value: number;
  startYear: number;
}

export enum SimulationStatus {
  FAILED = 'FAILED',
  WARNING = 'WARNING',
  OK = 'OK',
}

export interface Simulation {
  initialPortfolioValue: number;
  startYear: number;
  endYear: number;
  duration: number;

  isComplete: boolean;
  isFailed: boolean;
  yearFailed: number | null;
  numberOfSuccessfulYears: number;
  didDip: boolean;
  lowestSuccessfulDip: any;
  finalValue: number;
  totalInflationOverPeriod: number;
  percentOfChange: number;
  minWithdrawalYearInFirstYearDollars: YearResult | undefined;
  minPortfolioYearInFirstYearDollars: YearResult | undefined;

  status: SimulationStatus;
  resultsByYear: ResultsByYear;
}

export type Simulations = Array<Simulation>;
