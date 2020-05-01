import { MarketDataValue } from 'stock-market-data';

export interface LengthOfRetirement {
  numberOfYears: number;
  startYear: number;
  endYear: number;
}

export interface HistoricalDataRange {
  firstYear: number;
  lastYear: number;
  useAllHistoricalData: boolean;
}

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

export interface PortfolioInput {
  bondsValue: number;
  stockInvestmentValue: number;
  stockInvestmentFees: number;
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
  month: number;

  startPortfolio: Portfolio | null;
  endPortfolio: Portfolio;
  isOutOfMoneyAtEnd: boolean;

  marketData: YearData;
  startCpi: number;
  cumulativeInflationSinceFirstYear: number;

  totalWithdrawalAmount: number;
  baseWithdrawalAmount: number;
  additionalWithdrawalAmount: number;
  totalWithdrawalAmountInFirstYearDollars: number;
}

export type ResultsByYear = YearResult[];

export interface Simulation {
  simulationNumber: number;

  startYear: number;
  endYear: number;
  duration: number;
  isComplete: boolean;

  ranOutOfMoney: boolean;
  yearRanOutOfMoney: number | null;
  numberOfYearsWithMoneyInPortfolio: number;

  firstYearStartPortfolioValue: number;
  lastYearEndPortfolioValue: number;
  totalInflationOverPeriod: number;

  resultsByYear: ResultsByYear;

  // TODO: move to portfolio/withdrawal analysis
  minWithdrawalYearInFirstYearDollars: YearResult | undefined;
  minPortfolioYearInFirstYearDollars: YearResult | undefined;
}

export type Simulations = Array<Simulation>;

export interface MarketDataInput {
  byYear: MarketData;
  lastSupportedYear: number;
  avgMarketDataCape: number;
}

export interface RunSimulationsOptions {
  lengthOfRetirement: LengthOfRetirement;
  withdrawalStrategy: WithdrawalStrategy;
  portfolio: PortfolioInput;
  historicalDataRange: HistoricalDataRange;
  additionalWithdrawals: AdditionalWithdrawals;
  additionalIncome: AdditionalWithdrawals;
  calculationId: number;
  analytics: any;
  marketData: MarketDataInput;
}

export interface RunSimulationsReturn {
  simulations: Simulations;
  completeSimulations: Simulations;
  incompleteSimulations: Simulations;
  inputs: RunSimulationsOptions;
  calculationId: number;
  analysis: any;
}
