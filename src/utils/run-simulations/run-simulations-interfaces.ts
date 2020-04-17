export interface PortfolioInvestment {
  percentage: number;
  type: InvestmentType;
  fees: number;
  value: number;
  annualGrowthAmount?: number;
}

export interface Portfolio {
  totalValue: number;
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

export interface YearResult {
  year: number;
  isOutOfMoney: boolean;
  marketData: any;
  cpi: number;
  computedData: {
    cumulativeInflation: number;
    totalWithdrawalAmount: number;
    totalWithdrawalAmountInFirstYearDollars: number;
    portfolio: {
      totalValueInFirstYearDollars: number;
      totalValue: number;
      investments: AdjustedInvestment[];
    };
  };
}

export interface YearData {
  cape: number | null;
  comp: number;
  cpi: number;
  date: number;
  dateFraction: number;
  dateFractionDecimal: number;
  dividend: number;
  dividendYields: number;
  earnings: number;
  lir: number;
  month: number;
  realDividend: number;
  realEarnings: number;
  realPrice: number;
  [MarketDataGrowthKeys.stockMarketGrowth]: number;
  [MarketDataGrowthKeys.none]: number;
  year: number;
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
