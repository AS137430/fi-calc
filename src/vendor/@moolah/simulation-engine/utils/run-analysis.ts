import _ from 'lodash';
import { RunSimulationsReturn, Simulation } from '../types';

interface RunAnalysisOptions {
  simulations: Simulation[];
  analytics: any;
  result: RunSimulationsReturn;
}

type RunAnalysisReturn = any;

export default function runAnalysis({
  simulations,
  analytics,
  result,
}: RunAnalysisOptions): RunAnalysisReturn {
  const simsBlockColor: any = {};
  const perSimAnalysis: any = {};
  simulations.forEach(sim => {
    _.forEach(analytics, (analysisDefinition, analysisName) => {
      const result = analysisDefinition.data.simulation(sim);
      const blockColor = analysisDefinition.data.simulationColor(sim, result);

      if (Array.isArray(perSimAnalysis[analysisName])) {
        perSimAnalysis[analysisName].push(result);
        simsBlockColor[analysisName].push(blockColor);
      } else {
        perSimAnalysis[analysisName] = [result];
        simsBlockColor[analysisName] = [blockColor];
      }
    });
  });

  return _.mapValues(analytics, (analysisDefinition, analysisName) => {
    const simAnalysis = perSimAnalysis[analysisName];
    const simBlockColor = simsBlockColor[analysisName];
    const analysis = analysisDefinition.data.overview(result, simAnalysis);
    const display = {
      overview: analysisDefinition.display.overview(
        result,
        analysis,
        simAnalysis
      ),
    };

    return {
      simBlockColor,
      simAnalysis,
      analysis,
      display,
    };
  });
}
