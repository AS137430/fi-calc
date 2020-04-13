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

export interface SpendingPlan {
  spendingStrategy: {
    key: string;
  };

  /* Constant Spending */
  annualSpending: number;
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
  cape: string;
  comp: string;
  cpi: string;
  date: string;
  dateFraction: string;
  dateFractionDecimal: string;
  dividend: string;
  dividendYields: number;
  earnings: string;
  lir: string;
  month: string;
  realDividend: string;
  realEarnings: string;
  realPrice: string;
  [MarketDataGrowthKeys.stockMarketGrowth]: number;
  [MarketDataGrowthKeys.none]: number;
  year: string;
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
