export enum MarketDataGrowthKeys {
  bondsGrowth = 'bondsGrowth',
  stockMarketGrowth = 'stockMarketGrowth',
  none = 'none',
}

export interface YearMarketData {
  year: number;
  month: number;
  cpi: number;
  // TODO: ensure this is not null by using median cape?
  cape: number | null;
  dividendYields: number;
  [MarketDataGrowthKeys.bondsGrowth]: number;
  [MarketDataGrowthKeys.stockMarketGrowth]: number;
  [MarketDataGrowthKeys.none]: number;
}

export interface LengthOfRetirementInput {
  numberOfYears: number;
  startYear: number;
  endYear: number;
}

export interface HistoricalDataRangeInput {
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

export type AdditionalWithdrawalsInput = AdditionalWithdrawal[];

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

export interface WithdrawalStrategyInput {
  withdrawalStrategyName: {
    key: string;
  };

  /* Shared by numerous strategies */
  minWithdrawalLimit: number;
  maxWithdrawalLimit: number;

  /* Constant Dollar */
  annualWithdrawal: number;
  inflationAdjustedFirstYearWithdrawal: boolean;

  /* Percentage of Portfolio */
  percentageOfPortfolio: number;

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

export enum InvestmentType {
  equity = 'equity',
  bonds = 'bonds',
}

export enum WithdrawalStrategies {
  constantDollar = 'constantDollar',
  portfolioPercent = 'portfolioPercent',
  guytonKlinger = 'guytonKlinger',
  ninetyFivePercentRule = 'ninetyFivePercentRule',
  capeBased = 'capeBased',
}

export interface YearResult {
  yearNumber: number;
  year: number;
  month: number;

  startPortfolio: Portfolio | null;
  endPortfolio: Portfolio;
  isOutOfMoneyAtEnd: boolean;

  marketData: YearMarketData;
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
  byYear: {
    [Key: string]: YearMarketData;
    [Key: number]: YearMarketData;
  };
  lastSupportedYear: number;
  avgMarketDataCape: number;
}

export interface RunSimulationsOptions {
  lengthOfRetirement: LengthOfRetirementInput;
  withdrawalStrategy: WithdrawalStrategyInput;
  portfolio: PortfolioInput;
  historicalDataRange: HistoricalDataRangeInput;
  additionalWithdrawals: AdditionalWithdrawalsInput;
  additionalIncome: AdditionalWithdrawalsInput;
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