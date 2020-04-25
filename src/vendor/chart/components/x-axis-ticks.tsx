import React from 'react';
import { RenderDataReturn } from '../utils/render-data';
import { ChartDataPoint, SvgElementObject, XAxisLabelFromInfo } from '../types';

interface XAxisTicksOptions {
  numberOfBars: number;
  svgBarWidth: number;
  data: ChartDataPoint[];
  svgElement: SvgElementObject;
  dataForRender: RenderDataReturn;
  svgYAxisSpacing: number;
  xAxisLabelFromInfo: XAxisLabelFromInfo;
  svgXAxisSpacing: number;
}

export default function XAxisTicks({
  numberOfBars,
  svgBarWidth,
  data,
  svgElement,
  dataForRender,
  svgYAxisSpacing,
  xAxisLabelFromInfo,
  svgXAxisSpacing,
}: XAxisTicksOptions) {
  const maxPoint = data[data.length - 1];
  const tickHeight = dataForRender.svgElement.viewBox[1];

  return (
    <>
      {Array.from({ length: numberOfBars }).map((val, index) => {
        const drawIndex = index;

        // We render from the right toward the left, so that the most recent date
        // is always labeled.
        const tickXPosition =
          dataForRender.domain.svg[1] -
          svgYAxisSpacing -
          svgBarWidth * drawIndex;
        const dataSpacing = dataForRender.xAxis.tickSpacing.data;

        // I should instead use a system that allows me to add/subtract
        // x-values from the largest x-value in the dataset.
        const distanceFromMin = index * dataSpacing;
        const label = xAxisLabelFromInfo(maxPoint, -distanceFromMin);

        return (
          <React.Fragment key={index}>
            <text
              x={tickXPosition + 5}
              y={svgElement.viewBox[1] - svgXAxisSpacing + 15}
              className="chartLabel">
              {label}
            </text>
            <path
              key={index}
              d={`M${tickXPosition + 0.5} 0 v ${tickHeight}`}
              fill="transparent"
              strokeWidth="1px"
              stroke="var(--axisColor)"
            />
          </React.Fragment>
        );
      })}
    </>
  );
}
