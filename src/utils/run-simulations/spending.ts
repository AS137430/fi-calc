import clamp from '../numbers/clamp';
import { SpendingMethods } from './run-simulations-interfaces';

// These are different methods to calculate the spending amount
// for a given year.
// They all receive the same arguments.

interface SpendingOptions {
  firstYearWithdrawal: number;
  inflation: number;
  portfolioTotalValue: number;
  percentageOfPortfolio: number;
  minWithdrawal: number;
  maxWithdrawal: number;
}

function inflationAdjusted({
  inflation,
  firstYearWithdrawal,
}: SpendingOptions): number {
  return inflation * firstYearWithdrawal;
}

function notInflationAdjusted({
  firstYearWithdrawal,
}: SpendingOptions): number {
  return firstYearWithdrawal;
}

function portfolioPercent({
  inflation,
  portfolioTotalValue,
  percentageOfPortfolio,
  minWithdrawal,
  maxWithdrawal,
}: SpendingOptions): number {
  const naiveComputation = portfolioTotalValue * percentageOfPortfolio;
  const clamped = clamp(
    naiveComputation,
    inflation * minWithdrawal,
    inflation * maxWithdrawal
  );
  return clamped;
}

export default {
  [SpendingMethods.inflationAdjusted]: inflationAdjusted,
  [SpendingMethods.notInflationAdjusted]: notInflationAdjusted,
  [SpendingMethods.portfolioPercent]: portfolioPercent,
};
