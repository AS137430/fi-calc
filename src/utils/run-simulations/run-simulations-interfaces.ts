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
  annualSpending: number;
  inflationAdjustedFirstYearWithdrawal: boolean;
  spendingStrategy: {
    key: string;
  };
  percentageOfPortfolio: number;
  minWithdrawalLimit: number;
  maxWithdrawalLimit: number;
  minWithdrawalLimitEnabled: boolean;
  maxWithdrawalLimitEnabled: boolean;
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
}
