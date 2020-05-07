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
  rebalancePortfolioAnnually: boolean;
  yearMarketData: YearMarketData;
  firstYearStartPortfolio: Portfolio;
  // This is the portfolio at the start of this year
  startPortfolio: Portfolio;
}

export default function adjustPortfolioInvestment({
  portfolioValueBeforeMarketChanges,
  investment,
  index,
  isOutOfMoneyAtEnd,
  rebalancePortfolioAnnually,
  firstYearStartPortfolio,
  yearMarketData,
  startPortfolio,
}: adjustPortfolioInvestmentOptions): PortfolioInvestment {
  const startingInvestments = startPortfolio.investments[index];

  const percentage = rebalancePortfolioAnnually
    ? firstYearStartPortfolio.investments[index].percentage
    : startingInvestments.value / startPortfolio.totalValue;

  if (isOutOfMoneyAtEnd) {
    return {
      type: investment.type,
      valueAfterWithdrawal: 0,
      valueWithGrowth: 0,
      startingPercentage: percentage,
      growthAmount: 0,
      dividendsAmount: 0,
      feesAmount: 0,
      percentage: 0,
      value: 0,
    };
  }

  // If we rebalance yearly, then we keep the original percentage from the previous year.
  // This assumes that the investor reinvests at the very beginning (or very end) of each year.

  const valueAfterWithdrawal = portfolioValueBeforeMarketChanges * percentage;

  const growthKey = investmentTypeToGrowthMap[investment.type];
  const growthPercentage = yearMarketData[growthKey] || 0;
  const growthAmount = valueAfterWithdrawal * growthPercentage;

  // This allows you to specify a fixed annual addition to this investment. This replaces
  // the "growth of cash" feature of cFIREsim.
  let annualGrowthAmount = investment.annualGrowthAmount
    ? investment.annualGrowthAmount
    : 0;

  let dividendsAmount =
    investment.type === 'equity'
      ? valueAfterWithdrawal * yearMarketData.dividendYields
      : 0;

  const valueWithGrowth =
    valueAfterWithdrawal + growthAmount + annualGrowthAmount;

  // Fees aren't applied to dividends. This behavior matches cFIREsim.
  const feesAmount = investment.fees * valueWithGrowth;

  // We factor everything in to get our end result for this investment
  const value = Number(
    (valueWithGrowth + dividendsAmount - feesAmount).toFixed(2)
  );

  return {
    type: investment.type,
    percentage,
    startingPercentage: percentage,
    growthAmount,
    feesAmount,
    dividendsAmount,
    valueAfterWithdrawal,
    valueWithGrowth,
    value,
  };
}
