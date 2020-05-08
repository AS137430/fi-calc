export type MarketDataGrowthKeys = 'bondsGrowth' | 'stockMarketGrowth' | 'none';

export interface YearMarketData {
  readonly year: number;
  readonly month: number;
  readonly startCpi: number;
  readonly endCpi: number;
  readonly inflationOverPeriod: number;
  // TODO: ensure this is not null by using median cape?
  readonly cape: number | null;
  readonly dividendYields: number;
  readonly bondsGrowth: number;
  readonly stockMarketGrowth: number;
  readonly none: number;
}

export interface LengthOfRetirementInput {
  readonly numberOfYears: number;
  readonly startYear: number;
  readonly endYear: number;
}

export interface HistoricalDataRangeInput {
  readonly firstYear: number;
  readonly lastYear: number;
  readonly useAllHistoricalData: boolean;
}

// TODO: rename to adjustment
export interface AdditionalWithdrawal {
  readonly name: string;
  readonly value: number;
  readonly inflationAdjusted: boolean;
  readonly duration: number;
  // TODO: rename to startYearNumber
  readonly startYear: number;
}

export type AdditionalWithdrawalsInput = AdditionalWithdrawal[];

// These are the values that you pass into the
export interface PortfolioInput {
  readonly bondsValue: number;
  readonly stockInvestmentValue: number;
  readonly stockInvestmentFees: number;
}

export interface PortfolioDefinitionInvestment {
  readonly percentage: number;
  readonly type: InvestmentType;
  readonly fees: number;
  readonly value: number;
  readonly annualGrowthAmount?: number;
}

export interface PortfolioDefinition {
  readonly totalValue: number;
  readonly investments: PortfolioDefinitionInvestment[];
}

export interface PortfolioInvestment {
  readonly type: InvestmentType;
  readonly percentage: number;
  readonly startingPercentage: number;
  readonly growthAmount: number;
  readonly feesAmount: number;
  readonly dividendsAmount: number;
  readonly valueAfterWithdrawal: number;
  readonly valueWithGrowth: number;
  readonly value: number;
  readonly valueInFirstYearDollars: number;
}

export interface Portfolio {
  readonly totalValue: number;
  readonly totalValueInFirstYearDollars: number;
  readonly investments: PortfolioInvestment[];
}

export type InvestmentType = 'equity' | 'bonds';

export interface YearResult {
  readonly yearNumber: number;
  readonly year: number;
  readonly month: number;

  readonly startPortfolio: Portfolio | null;
  readonly endPortfolio: Portfolio;
  readonly isOutOfMoneyAtEnd: boolean;

  readonly marketData: YearMarketData;
  readonly startCpi: number;
  readonly cumulativeInflationSinceFirstYear: number;
  readonly endCumulativeInflationSinceFirstYear: number;

  readonly totalWithdrawalAmount: number;
  readonly baseWithdrawalAmount: number;
  readonly additionalWithdrawalAmount: number;
  readonly additionalIncomeAmount: number;
  readonly totalWithdrawalAmountInFirstYearDollars: number;
}

export type ResultsByYear = YearResult[];

export interface Simulation {
  readonly simulationNumber: number;

  readonly startYear: number;
  readonly endYear: number;
  readonly duration: number;
  readonly isComplete: boolean;

  readonly ranOutOfMoney: boolean;
  readonly yearRanOutOfMoney: number | null;
  readonly numberOfYearsWithMoneyInPortfolio: number;

  readonly firstYearStartPortfolioValue: number;
  readonly lastYearEndPortfolioValue: number;
  readonly totalInflationOverPeriod: number;

  readonly resultsByYear: ResultsByYear;
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

export interface WithdrawalFnOptions {
  readonly simulationNumber: number;
  readonly year: number;
  readonly month: number;
  readonly cumulativeInflation: number;
  readonly yearMarketData: YearMarketData;
  readonly yearsRemaining: number;
  readonly previousResults: YearResult;
  readonly isFirstYear: boolean;
  readonly startPortfolio: Portfolio;
  readonly firstYearStartPortfolio: Portfolio;
  readonly firstYearCpi: number;
}

export interface RunSimulationsOptions {
  yearlyWithdrawal(withdrawalOptions: WithdrawalFnOptions): number;
  readonly lengthOfRetirement: LengthOfRetirementInput;
  readonly portfolio: PortfolioInput;
  readonly historicalDataRange: HistoricalDataRangeInput;
  readonly additionalWithdrawals: AdditionalWithdrawalsInput;
  readonly additionalIncome: AdditionalWithdrawalsInput;
  readonly calculationId: number;
  readonly analytics: any;
  readonly marketData: MarketDataInput;
}

export interface RunSimulationsReturn {
  simulations: Simulations;
  completeSimulations: Simulations;
  incompleteSimulations: Simulations;
  inputs: RunSimulationsOptions;
  calculationId: number;
  analysis: any;
}
