import {
  Portfolio,
  PortfolioInvestment,
  InvestmentType,
  MarketDataGrowthKeys,
} from './run-simulations-interfaces';

// This maps an investment type to the key on marketData that
// represents its changes in a given year
const investmentTypeToGrowthMap = {
  [InvestmentType.equity]: MarketDataGrowthKeys.stockMarketGrowth,
  [InvestmentType.bonds]: MarketDataGrowthKeys.none,
};

interface adjustPortfolioInvestmentOptions {
  investment: PortfolioInvestment;
  index: number;
  notEnoughMoney: boolean;
  rebalancePortfolioAnnually: boolean;
  totalWithdrawalAmount: number;
  yearMarketData: any;
  previousComputedData: any;
  initialPortfolio: Portfolio;
}

export default function adjustPortfolioInvestment({
  investment,
  index,
  notEnoughMoney,
  previousComputedData,
  rebalancePortfolioAnnually,
  initialPortfolio,
  totalWithdrawalAmount,
  yearMarketData,
}: adjustPortfolioInvestmentOptions) {
  if (notEnoughMoney) {
    return {
      ...investment,
      valueBeforeChange: investment.value,
      valueAfterWithdrawal: 0,
      growth: 0,
      dividends: 0,
      percentage: 0,
      value: 0,
    };
  }

  const previousYearInvestment =
    previousComputedData.portfolio.investments[index];

  // If we rebalance yearly, then we keep the original percentage from the previous year.
  // This assumes that the investor reinvests at the very beginning (or very end) of each year.
  const percentage = rebalancePortfolioAnnually
    ? initialPortfolio.investments[index].percentage
    : previousYearInvestment.percentage;

  // We assume that the total yearly withdrawal is divided evenly between the different
  // investments.
  const withdrawalAmount = percentage * totalWithdrawalAmount;
  const valueAfterWithdrawal = previousYearInvestment.value - withdrawalAmount;
  const growthKey = investmentTypeToGrowthMap[investment.type];
  const growthPercentage = yearMarketData[growthKey] || 0;
  const growth = valueAfterWithdrawal * growthPercentage;

  // This allows you to specify a fixed annual addition to this investment. This replaces
  // the "growth of cash" feature of cFIREsim.
  let annualGrowthAmount = investment.annualGrowthAmount
    ? investment.annualGrowthAmount
    : 0;

  let dividends =
    investment.type === 'equity'
      ? valueAfterWithdrawal * yearMarketData.dividendYields
      : 0;

  const valueWithGrowth = valueAfterWithdrawal + growth + annualGrowthAmount;

  // Fees aren't applied to dividends. This behavior matches cFIREsim.
  const fees = investment.fees * valueWithGrowth;

  // We factor everything in to get our end result for this investment
  const value = valueWithGrowth + dividends - fees;

  return {
    ...investment,
    percentage,
    growth,
    fees,
    dividends,
    valueBeforeChange: investment.value,
    valueAfterWithdrawal,
    valueWithGrowth,
    value,
  };
}
