import _ from 'lodash';

export default {
  data: {
    simulation(simulation) {
      const { resultsByYear, firstYearStartPortfolioValue } = simulation;
      const lastYear = resultsByYear[resultsByYear.length - 1];

      const finalRatio =
        lastYear.endPortfolio.totalValueInFirstYearDollars /
        firstYearStartPortfolioValue;

      let status;
      if (finalRatio === 0) {
        status = 'FAILED';
      } else if (finalRatio < 0.35) {
        status = 'WARNING';
      } else {
        status = 'OK';
      }

      return {
        status,
      };
    },

    overview(result, simAnalysis) {
      const { completeSimulations } = result;

      const [failedSimulations, successfulSimulations] = _.partition(
        simAnalysis,
        analysis => analysis.status === 'FAILED'
      );

      const successRate = completeSimulations.length
        ? successfulSimulations.length / completeSimulations.length
        : 0;

      const rawSuccessRate = successRate * 100;

      let successRateDisplay = '';
      if (rawSuccessRate === 100 || rawSuccessRate === 0) {
        successRateDisplay = `${rawSuccessRate}%`;
      } else {
        successRateDisplay = `${rawSuccessRate.toFixed(2)}%`;
      }

      const exceedsSuccessRateThreshold = successRate >= 0.95;

      return {
        successfulSimulations,
        failedSimulations,
        successRate,
        successRateDisplay,
        // A Boolean representing whether or not the sucess rate is high enough to meet
        // the threshold of a "successful" run
        exceedsSuccessRateThreshold,
      };
    },
  },
  display: {
    overview(result, custom, simAnalysis) {
      const isDanger =
        !custom.exceedsSuccessRateThreshold && custom.successRate < 0.8;
      const isWarning =
        !custom.exceedsSuccessRateThreshold &&
        !isDanger &&
        custom.successRate < 0.95;

      return [
        {
          title: 'Success Rate',
          display: custom.successRateDisplay,
          isWarning,
          isDanger,
          exceedsSuccessRateThreshold: custom.exceedsSuccessRateThreshold,
        },
      ];
    },
  },
};
