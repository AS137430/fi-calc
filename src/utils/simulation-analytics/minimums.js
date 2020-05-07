import _ from 'lodash';

export default {
  data: {
    simulation(simulation) {
      const { resultsByYear } = simulation;
      const minWithdrawalYearInFirstYearDollars = _.minBy(
        resultsByYear,
        year => year.totalWithdrawalAmountInFirstYearDollars
      );

      const minPortfolioYearInFirstYearDollars = _.minBy(
        resultsByYear,
        year => year.endPortfolio.totalValueInFirstYearDollars
      );

      return {
        minWithdrawalYearInFirstYearDollars,
        minPortfolioYearInFirstYearDollars,
      };
    },
  },
};
