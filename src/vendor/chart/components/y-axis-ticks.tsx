import React from 'react';
import { YAxisLabelFromValue, YAxisPoint } from '../types';

interface YAxisTicksOptions {
  yAxisPoints: YAxisPoint[];
  svgYAxisSpacing: number;
  yAxisLabelFromValue: YAxisLabelFromValue;
  textHeight: number;
  graphWidth: number;
}

export default function YAxisTicks({
  yAxisPoints,
  svgYAxisSpacing,
  yAxisLabelFromValue,
  textHeight,
  graphWidth,
}: YAxisTicksOptions) {
  return (
    <>
      {yAxisPoints.map((point, index) => {
        const tickYPosition = point.position;
        const label = yAxisLabelFromValue(point.label);
        const isZero = Math.round(point.label) === 0;

        const renderLabel = tickYPosition > textHeight * 1.2;

        return (
          <React.Fragment key={index}>
            {renderLabel && (
              <text
                x={graphWidth - svgYAxisSpacing + 5}
                y={tickYPosition - 4}
                className="chartLabel">
                {label}
              </text>
            )}
            <path
              key={index}
              d={`M0 ${tickYPosition + 0.5} h ${graphWidth}`}
              fill="transparent"
              stroke={isZero ? 'var(--zeroAxisColor)' : 'var(--axisColor)'}
              strokeWidth="var(--axisLineWidth)"
            />
          </React.Fragment>
        );
      })}
    </>
  );
}
