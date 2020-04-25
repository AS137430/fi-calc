import React, { useRef, useState, useEffect, useMemo } from 'react';
import ChartLine from './components/chart-line';
import YAxisTicks from './components/y-axis-ticks';
import XAxisTicks from './components/x-axis-ticks';
import useElSize from './hooks/use-el-size';
import renderData, { RenderDataReturn } from './utils/render-data';
import {
  ChartDataPoint,
  YAxisLabelFromValue,
  XAxisLabelFromInfo,
} from './types';
import lineCommand from './utils/line-command';
import * as defaultConstants from './utils/default-constant-values';

interface ChartProps {
  data: ChartDataPoint[];
  isSmallScreen: boolean;
  yTicks: number[];
  xTicks: number[];
  yAxisLabelFromValue: YAxisLabelFromValue;
  xAxisLabelFromInfo: XAxisLabelFromInfo;
  svgXAxisSpacing?: number;
  textHeight?: number;
  xAxisLabelWidth?: number;
  className?: string;
}

export default function Chart({
  data,
  isSmallScreen = false,
  xTicks,
  yTicks,
  yAxisLabelFromValue,
  xAxisLabelFromInfo,
  svgXAxisSpacing = defaultConstants.svgXAxisSpacing,
  textHeight = defaultConstants.textHeight,
  xAxisLabelWidth = defaultConstants.xAxisLabelWidth,
  className = '',
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

  const yLabelPadding = textHeight * 1.5;
  const xLabelPadding = xAxisLabelWidth * 0.6;

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
    <div className={`chartContainer  ${className}`} ref={appRef}>
      {dataForRender && (
        <svg
          className="chart"
          viewBox={`0 0 ${dataForRender.svgElement.viewBox[0]} ${
            dataForRender.svgElement.viewBox[1]
          }`}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg">
          <YAxisTicks
            yAxisPoints={dataForRender.yAxis.yAxisPoints}
            graphWidth={dataForRender.svgElement.viewBox[0]}
            svgYAxisSpacing={svgYAxisSpacing}
            yAxisLabelFromValue={yAxisLabelFromValue}
            textHeight={textHeight}
          />
          <XAxisTicks
            xAxisPoints={dataForRender.xAxis.xAxisPoints}
            svgXAxisSpacing={svgXAxisSpacing}
            graphHeight={dataForRender.svgElement.viewBox[1]}
            firstPoint={data[data.length - 1]}
            xAxisLabelFromInfo={xAxisLabelFromInfo}
          />
          <ChartLine data={dataForRender.data} command={lineCommand} />
          {/* 1px border between the chart and the x-axis labels */}
          <path
            d={`M0 ${dataForRender.svgElement.viewBox[1] -
              svgXAxisSpacing} h ${dataForRender.svgElement.viewBox[0] -
              0 +
              1}`}
            stroke="var(--boundingBorderColor)"
            strokeWidth="var(--axisLineWidth)"
            fill="transparent"
          />
          {/* 1px border between the chart and the x-axis labels */}
          <path
            d={`M0 ${dataForRender.svgElement.viewBox[1] -
              svgXAxisSpacing} h ${dataForRender.svgElement.viewBox[0] -
              svgYAxisSpacing +
              1}`}
            stroke="var(--boundingBorderColor)"
            strokeWidth="var(--axisLineWidth)"
            fill="transparent"
          />
        </svg>
      )}
    </div>
  );
}
