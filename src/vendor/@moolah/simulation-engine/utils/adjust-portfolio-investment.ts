import {
  YearMarketData,
  Portfolio,
  PortfolioDefinitionInvestment,
  PortfolioInvestment,
  MarketDataGrowthKeys,
} from '../types';

interface GrowthKeyMap {
  [key: string]: MarketDataGrowthKeys;
}

// This maps an investment type to the key on marketData that
// represents its changes in a given year
const investmentTypeToGrowthMap: GrowthKeyMap = {
  equity: 'stockMarketGrowth',
  bonds: 'bondsGrowth',
};

interface adjustPortfolioInvestmentOptions {
  portfolioValueBeforeMarketChanges: number;
  investment: PortfolioDefinitionInvestment;
  index: number;
  isOutOfMoneyAtEnd: boolean;
  endCumulativeInflationSinceFirstYear: number;
  yearMarketData: YearMarketData;
  // This is the portfolio at the start of this year
  startPortfolio: Portfolio;
}

export default function adjustPortfolioInvestment({
  portfolioValueBeforeMarketChanges,
  investment,
  index,
  isOutOfMoneyAtEnd,
  yearMarketData,
  startPortfolio,
  endCumulativeInflationSinceFirstYear,
}: adjustPortfolioInvestmentOptions): Omit<
  PortfolioInvestment,
  'rebalanceDelta' | 'percentage'
> {
  const startingInvestments = startPortfolio.investments[index];

  let percentage = 0;
  if (startPortfolio.totalValue > 0) {
    percentage = startingInvestments.value / startPortfolio.totalValue;
  }

  if (isOutOfMoneyAtEnd) {
    return {
      type: investment.type,
      valueAfterWithdrawal: 0,
      valueWithGrowth: 0,
      startingPercentage: percentage,
      growthAmount: 0,
      dividendsAmount: 0,
      feesAmount: 0,
      value: 0,
      valueInFirstYearDollars: 0,
    };
  }

  // If we rebalance yearly, then we keep the original percentage from the previous year.
  // This assumes that the investor reinvests at the very beginning (or very end) of each year.

  const valueAfterWithdrawal = portfolioValueBeforeMarketChanges * percentage;

  const growthKey = investmentTypeToGrowthMap[investment.type];
  const growthPercentage = yearMarketData[growthKey] || 0;
  const growthAmount = Number(
    (valueAfterWithdrawal * growthPercentage).toFixed(2)
  );

  // This allows you to specify a fixed annual addition to this investment. This replaces
  // the "growth of cash" feature of cFIREsim.
  let annualGrowthAmount = investment.annualGrowthAmount
    ? investment.annualGrowthAmount
    : 0;

  let dividendsAmount =
    investment.type === 'equity'
      ? Number(
          (valueAfterWithdrawal * yearMarketData.dividendYields).toFixed(2)
        )
      : 0;

  const valueWithGrowth = Number(
    (valueAfterWithdrawal + growthAmount + annualGrowthAmount).toFixed(2)
  );

  // Fees aren't applied to dividends. This behavior matches cFIREsim.
  const feesAmount = Number((investment.fees * valueWithGrowth).toFixed(2));

  // We factor everything in to get our end result for this investment
  const value = Number(
    (valueWithGrowth + dividendsAmount - feesAmount).toFixed(2)
  );

  const valueInFirstYearDollars = Number(
    (value / endCumulativeInflationSinceFirstYear).toFixed(2)
  );

  return {
    type: investment.type,
    startingPercentage: percentage,
    growthAmount,
    feesAmount,
    dividendsAmount,
    valueAfterWithdrawal,
    valueWithGrowth,
    value,
    valueInFirstYearDollars,
  };
}
