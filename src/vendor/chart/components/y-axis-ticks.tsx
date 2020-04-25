import React from 'react';
import { RenderDataReturn } from '../utils/render-data';
import { textHeight } from '../utils/constant-values';
import { YAxisLabelFromPoint, YAxisPoint } from '../types';

export default function yAxisTicks(
  yAxisPoints: YAxisPoint[],
  dataForRender: RenderDataReturn,
  svgYAxisSpacing: number,
  yAxisLabelFromPoint: YAxisLabelFromPoint
) {
  const { svgElement } = dataForRender;
  const tickWidth = dataForRender.svgElement.viewBox[0];

  return yAxisPoints.map((point, index) => {
    const tickYPosition = point.position;
    const label = yAxisLabelFromPoint(point);
    const isZero = Math.round(point.label) === 0;

    const renderLabel = tickYPosition > textHeight * 1.2;

    return (
      <React.Fragment key={index}>
        {renderLabel && (
          <text
            x={svgElement.viewBox[0] - svgYAxisSpacing + 5}
            y={tickYPosition - 4}
            className="chartLabel">
            {label}
          </text>
        )}
        <path
          key={index}
          d={`M0 ${tickYPosition + 0.5} h ${tickWidth}`}
          fill="transparent"
          stroke={isZero ? 'var(--zeroAxisColor)' : 'var(--axisColor)'}
          strokeWidth="1px"
        />
      </React.Fragment>
    );
  });
}
