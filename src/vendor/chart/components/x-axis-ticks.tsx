import React from 'react';
import { ChartDataPoint, XAxisLabelFromInfo, XAxisPoint } from '../types';

interface XAxisTicksOptions {
  xAxisPoints: XAxisPoint[];
  firstPoint: ChartDataPoint;
  xAxisLabelFromInfo: XAxisLabelFromInfo;
  svgXAxisSpacing: number;
  graphHeight: number;
}

export default function XAxisTicks({
  xAxisPoints,
  firstPoint,
  graphHeight,
  xAxisLabelFromInfo,
  svgXAxisSpacing,
}: XAxisTicksOptions) {
  return (
    <>
      {xAxisPoints.map((point, index) => {
        const label = xAxisLabelFromInfo(firstPoint, point.distance);

        return (
          <React.Fragment key={index}>
            <text
              x={point.position + 5}
              y={graphHeight - svgXAxisSpacing + 15}
              className="chartLabel">
              {label}
            </text>
            <path
              key={index}
              d={`M${point.position + 0.5} 0 v ${graphHeight}`}
              fill="transparent"
              strokeWidth="var(--axisLineWidth)"
              stroke="var(--axisColor)"
            />
          </React.Fragment>
        );
      })}
    </>
  );
}
