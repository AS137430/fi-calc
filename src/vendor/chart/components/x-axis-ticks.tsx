import React from 'react';
import { ChartDataPoint, XAxisLabelFromInfo, XAxisPoint } from '../types';

interface XAxisTicksOptions {
  xAxisPoints: XAxisPoint[];
  firstPoint: ChartDataPoint;
  xAxisLabelFromInfo: XAxisLabelFromInfo;
  svgXAxisLabelsHeight: number;
  graphHeight: number;
  topMargin: number;
}

export default function XAxisTicks({
  xAxisPoints,
  firstPoint,
  graphHeight,
  xAxisLabelFromInfo,
  svgXAxisLabelsHeight,
  topMargin,
}: XAxisTicksOptions) {
  return (
    <>
      {xAxisPoints.map((point, index) => {
        const label = xAxisLabelFromInfo(firstPoint, point);
        return (
          <React.Fragment key={index}>
            <text
              x={point.position + 5}
              y={graphHeight - svgXAxisLabelsHeight + 15}
              className="chartLabel">
              {label}
            </text>
            {point.position > 0 && (
              <path
                key={index}
                d={`M${point.position + 0.5} ${topMargin} v ${graphHeight -
                  topMargin}`}
                fill="transparent"
                strokeWidth="var(--axisLineWidth)"
                stroke="var(--axisColor)"
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}
