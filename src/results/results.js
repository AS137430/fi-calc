import React, { useMemo, useRef, useEffect } from 'react';
import './results.css';
import computeResult from '../utils/compute-result';
import useCalculatorMode from '../state/calculator-mode';
import usePortfolio from '../state/portfolio';
import useSpendingPlan from '../state/spending-plan';
import useLengthOfRetirement from '../state/length-of-retirement';

function plotFunction(ctx, axes, func, color, thick) {
  var xx,
    yy,
    dx = 4,
    x0 = axes.x0,
    y0 = axes.y0,
    scale = axes.scale;
  var iMax = Math.round((ctx.canvas.width - x0) / dx);
  var iMin = axes.doNegativeX ? Math.round(-x0 / dx) : 0;
  ctx.beginPath();
  ctx.lineWidth = thick;
  ctx.strokeStyle = color;

  for (var i = iMin; i <= iMax; i++) {
    xx = dx * i;
    yy = scale * func(xx / scale) * axes.scaleY;
    if (i == iMin) ctx.moveTo(x0 + xx, y0 - yy);
    else ctx.lineTo(x0 + xx, y0 - yy);
  }
  ctx.stroke();
}

function plotAxes(ctx, axes) {
  var x0 = axes.x0,
    w = ctx.canvas.width;
  var y0 = axes.y0,
    h = ctx.canvas.height;
  var xmin = axes.doNegativeX ? 0 : x0;
  ctx.beginPath();
  ctx.strokeStyle = 'rgb(128,128,128)';
  ctx.moveTo(xmin, y0);
  ctx.lineTo(w, y0); // X axis
  ctx.moveTo(x0, 0);
  ctx.lineTo(x0, h); // Y axis
  ctx.stroke();
}

export default function Results() {
  const canvasRef = useRef();
  const contextRef = useRef();
  const [calculatorMode] = useCalculatorMode();
  const { state: spendingPlan } = useSpendingPlan();
  const { state: lengthOfRetirement } = useLengthOfRetirement();
  const { state: portfolio } = usePortfolio();

  const result = useMemo(
    () => {
      return computeResult({
        durationMode: calculatorMode,
        numberOfYears: lengthOfRetirement.numberOfYears,
        startYear: lengthOfRetirement.startYear,
        endYear: lengthOfRetirement.endYear,
        firstYearWithdrawal: spendingPlan.annualSpending,
        inflationAdjustedFirstYearWithdrawal:
          spendingPlan.inflationAdjustedFirstYearWithdrawal,
        stockInvestmentValue: portfolio.stockInvestmentValue,
        spendingStrategy: spendingPlan.spendingStrategy.key,
        percentageOfPortfolio: spendingPlan.percentageOfPortfolio,
        minWithdrawalLimit: spendingPlan.minWithdrawalLimit,
        maxWithdrawalLimit: spendingPlan.maxWithdrawalLimit,
      });
    },
    /* eslint react-hooks/exhaustive-deps: "off" */
    [
      calculatorMode,
      ...Object.values(spendingPlan),
      ...Object.values(lengthOfRetirement),
      ...Object.values(portfolio),
    ]
  );

  const numberOfSimulations = result.results.numberOfCycles;
  const oneSimulation = numberOfSimulations === 1;

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    contextRef.current = ctx;
  }, []);

  useEffect(
    () => {
      var axes = {};
      axes.x0 = 0; // x0 pixels from left to x=0
      axes.y0 = canvasRef.current.height; // y0 pixels from top to y=0
      // 40 pixels from x=0 to x=1
      // This determines how much of the x-axis is visible
      axes.scale = 50;
      // Scale the Y axis
      axes.scaleY = 25;
      axes.doNegativeX = true;

      contextRef.current.clearRect(
        0,
        0,
        contextRef.current.canvas.width,
        contextRef.current.canvas.height
      );

      plotAxes(contextRef.current, axes);
      plotFunction(
        contextRef.current,
        axes,
        result.results.gaussian,
        'rgb(11,153,11)',
        1
      );
    },
    [result]
  );

  return (
    <div className="results">
      <h1>Results</h1>
      {numberOfSimulations > 1 && (
        <div>
          <div className="results_section">
            <div className="results_sectionTitle">Number of Simulations</div>
            <div className="results_bigValue">
              {result.results.numberOfCycles}
            </div>
          </div>
        </div>
      )}
      {oneSimulation && (
        <div>
          <div className="results_section">
            <div className="results_sectionTitle">Length of Simulation</div>
            <div className="results_bigValue">
              {result.results.allCycles[0].duration + 1} years
            </div>
          </div>
        </div>
      )}
      <div>
        <div className="results_section">
          <div className="results_sectionTitle">
            {!oneSimulation ? 'Success Rate' : 'Succeeded?'}
          </div>
          <div className="results_bigValue">
            {!oneSimulation && result.successRate}
            {oneSimulation && (result.summary === 'SUCCESSFUL' ? 'Yes' : 'No')}
          </div>
        </div>
      </div>
      <canvas width="502" height="250" ref={canvasRef} />
    </div>
  );
}
