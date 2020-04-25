import React, { useRef, useState, useEffect, useMemo } from 'react';
import './chart.css';
import svgPath from './components/svg-path';
import yAxisTicks from './components/y-axis-ticks';
import xAxisTicks from './components/x-axis-ticks';
import useElSize from './hooks/use-el-size';
import renderData, { RenderDataReturn } from './utils/render-data';
import {
  ChartDataPoint,
  YAxisLabelFromPoint,
  XAxisLabelFromInfo,
} from './types';
import lineCommand from './utils/line-command';
import {
  svgXAxisSpacing,
  textHeight,
  yLabelPadding,
  xAxisLabelWidth,
  xLabelPadding,
} from './utils/constant-values';

interface ChartProps {
  data: ChartDataPoint[];
  isSmallScreen: boolean;
  yTicks: number[];
  xTicks: number[];
  yAxisLabelFromPoint: YAxisLabelFromPoint;
  xAxisLabelFromInfo: XAxisLabelFromInfo;
}

export default function Chart({
  data,
  isSmallScreen = false,
  xTicks,
  yTicks,
  yAxisLabelFromPoint,
  xAxisLabelFromInfo,
}: ChartProps) {
  const appRef = useRef<any>();
  const [appEl, setAppEl] = useState<any>(null);

  useEffect(() => {
    // This ensures that `useElSize` is called by forcing a re-render of the component
    setAppEl(appRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const svgYAxisSpacing = isSmallScreen ? 45 : 100;

  const { width } = useElSize(appEl);

  const dataForRender = useMemo<RenderDataReturn | undefined>(
    () => {
      if (width) {
        return renderData({
          data,
          svgWidth: width,
          svgYAxisSpacing,
          svgXAxisSpacing,
          textHeight,
          yLabelPadding,
          xAxisLabelWidth,
          xLabelPadding,
          xTicks,
          yTicks,
          svgAspectRatio: isSmallScreen ? 0.7 : 0.5,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width, data, isSmallScreen, svgYAxisSpacing, xTicks, yTicks]
  );

  return (
    <div className="chartContainer" ref={appRef}>
      {dataForRender && (
        <svg
          className="chart"
          style={{
            display: 'block',
          }}
          viewBox={`0 0 ${dataForRender.svgElement.viewBox[0]} ${
            dataForRender.svgElement.viewBox[1]
          }`}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg">
          {yAxisTicks(
            dataForRender.yAxis.yAxisPoints,
            dataForRender,
            svgYAxisSpacing,
            yAxisLabelFromPoint
          )}
          {xAxisTicks(
            dataForRender.xAxis.numberOfTicks + 1,
            dataForRender.xAxis.tickSpacing.svg,
            data,
            dataForRender.svgElement,
            dataForRender,
            svgYAxisSpacing,
            xAxisLabelFromInfo
          )}
          {svgPath(dataForRender.data, lineCommand)}
          {/* 1px border between the chart and the x-axis labels */}
          <path
            d={`M0 ${dataForRender.svgElement.viewBox[1] -
              svgXAxisSpacing} h ${dataForRender.svgElement.viewBox[0] -
              0 +
              1}`}
            stroke="var(--boundingBorderColor)"
            strokeWidth="1px"
            fill="transparent"
          />
          {/* 1px border between the chart and the x-axis labels */}
          <path
            d={`M0 ${dataForRender.svgElement.viewBox[1] -
              svgXAxisSpacing} h ${dataForRender.svgElement.viewBox[0] -
              svgYAxisSpacing +
              1}`}
            stroke="var(--boundingBorderColor)"
            strokeWidth="1px"
            fill="transparent"
          />
        </svg>
      )}
    </div>
  );
}
