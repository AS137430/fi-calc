import _ from 'lodash';

export default {
  data: {
    simulation(simulation) {},

    overview(result) {
      const { completeSimulations } = result;

      const [failedSimulations, successfulSimulations] = _.partition(
        completeSimulations,
        'isFailed'
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
    overview(result, custom) {
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
