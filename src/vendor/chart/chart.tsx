import React, { useRef, useState, useEffect, useMemo } from 'react';
import ActiveDataPoint from './components/active-data-point';
import TopMargin from './components/top-margin';
import ChartLine from './components/chart-line';
import YAxisTicks from './components/y-axis-ticks';
import XAxisTicks from './components/x-axis-ticks';
import useElSize from './hooks/use-el-size';
import renderData, { RenderDataReturn } from './utils/render-data';
import {
  ChartDataPoint,
  YAxisLabelFromValue,
  XAxisLabelFromInfo,
  FormatDataPoint,
} from './types';
import lineCommand from './utils/line-command';
import * as defaultConstants from './utils/default-constant-values';
import { enableUserSelect, disableUserSelect } from './utils/user-select';

interface ChartProps {
  data: ChartDataPoint[];
  isSmallScreen: boolean;
  isTouchDevice: boolean;
  yTicks: number[];
  xTicks: number[];
  yAxisLabelFromValue: YAxisLabelFromValue;
  xAxisLabelFromInfo: XAxisLabelFromInfo;
  formatDataPoint: FormatDataPoint;
  svgXAxisLabelsHeight?: number;
  textHeight?: number;
  xAxisLabelWidth?: number;
  topMargin?: number;
  className?: string;
}

export default function Chart({
  data,
  isSmallScreen = false,
  isTouchDevice = false,
  xTicks,
  yTicks,
  yAxisLabelFromValue,
  xAxisLabelFromInfo,
  svgXAxisLabelsHeight = defaultConstants.svgXAxisLabelsHeight,
  textHeight = defaultConstants.textHeight,
  xAxisLabelWidth = defaultConstants.xAxisLabelWidth,
  topMargin = defaultConstants.topMargin,
  className = '',
  formatDataPoint,
}: ChartProps) {
  const appRef = useRef<any>();
  const [appEl, setAppEl] = useState<any>(null);
  const [activeDataIndex, setActiveDataIndex] = useState<number | null>(null);

  useEffect(() => {
    // This ensures that `useElSize` is called by forcing a re-render of the component
    setAppEl(appRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const svgYAxisLabelsWidth = isSmallScreen ? 45 : 100;

  const elSize = useElSize(appEl);
  const { width } = elSize;

  const yLabelPadding = textHeight * 1.5;
  const xLabelPadding = xAxisLabelWidth * 0.6;

  const dataForRender = useMemo<RenderDataReturn | undefined>(
    () => {
      if (width) {
        return renderData({
          data,
          topMargin,
          svgWidth: width,
          svgYAxisLabelsWidth,
          svgXAxisLabelsHeight,
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
    [width, data, isSmallScreen, svgYAxisLabelsWidth, xTicks, yTicks]
  );

  const dataForRenderRef = useRef(dataForRender);
  dataForRenderRef.current = dataForRender;
  const svgYAxisLabelsWidthRef = useRef(svgYAxisLabelsWidth);
  svgYAxisLabelsWidthRef.current = svgYAxisLabelsWidth;
  const elSizeRef = useRef(elSize);
  elSizeRef.current = elSize;
  const activeDataIndexRef = useRef(activeDataIndex);
  activeDataIndexRef.current = activeDataIndex;
  const dataRef = useRef(data);
  dataRef.current = data;
  const isTouchDeviceRef = useRef(isTouchDevice);
  isTouchDeviceRef.current = isTouchDevice;

  const isSettingActivePoint = useRef(false);

  function onSetActivePoint(pageX: number) {
    if (!isSettingActivePoint.current) {
      return;
    }

    const dataLength = dataRef.current.length;

    if (dataLength === 0) {
      return;
    }

    const dataForRender: any = dataForRenderRef.current;
    const svgYAxisLabelsWidth: any = svgYAxisLabelsWidthRef.current;
    const elSize: any = elSizeRef.current;

    const rightMargin = isTouchDeviceRef.current
      ? 0
      : svgYAxisLabelsWidth * 0.8;

    const interactiveXLimit = dataForRender.svgElement.viewBox[0] - rightMargin;
    const touchSpace =
      dataForRender.svgElement.viewBox[0] - svgYAxisLabelsWidth;

    const relativeX = pageX - elSize.x;

    const isWithinHoverBounds = relativeX < interactiveXLimit;

    if (isWithinHoverBounds) {
      if (dataLength === 1) {
        setActiveDataIndex(0);
        return;
      }

      const renderDataLength = Math.max(1, dataForRender.data.length - 1);
      const dataPointSpacing = touchSpace / renderDataLength;

      const dataPointIndex = Math.min(
        Math.max(0, Math.round(relativeX / dataPointSpacing)),
        dataForRender.data.length - 1
      );

      if (activeDataIndexRef.current !== dataPointIndex) {
        setActiveDataIndex(dataPointIndex);
      }
    } else {
      setActiveDataIndex(null);
    }
  }

  const hasActiveDataPoint = activeDataIndex !== null;

  return (
    <div
      className={`chartContainer ${
        hasActiveDataPoint ? 'chartContainer-activeDataPoint' : ''
      } ${className}`}
      ref={appRef}
      /*
        The following handlers are for touch-based device
        tap-and-hold-to-view details support
      */

      // When the touch event starts, we start tracking
      // the active point
      onTouchStart={e => {
        disableUserSelect();
        e.preventDefault();
        e.stopPropagation();
        isSettingActivePoint.current = true;

        if (e.touches && e.touches.length > 0) {
          const { pageX } = e.touches[0];
          requestAnimationFrame(() => {
            onSetActivePoint(pageX);
          });
        }
      }}
      // As the user moves their finger, we update the active point
      onTouchMove={e => {
        e.stopPropagation();
        e.preventDefault();
        if (e.touches && e.touches.length > 0) {
          const { pageX } = e.touches[0];
          requestAnimationFrame(() => {
            onSetActivePoint(pageX);
          });
        }
      }}
      // When the touch is canceled, or when it ends, we reset
      // things back to the way they were before the event started.
      onTouchCancel={() => {
        enableUserSelect();
        isSettingActivePoint.current = false;
        setActiveDataIndex(null);
      }}
      onTouchEnd={() => {
        enableUserSelect();
        isSettingActivePoint.current = false;
        setActiveDataIndex(null);
      }}
      /*
        The following handlers are for touch-based device
        tap-and-hold-to-view details support
      */
      onMouseOver={() => {
        isSettingActivePoint.current = true;
      }}
      onMouseOut={() => {
        isSettingActivePoint.current = false;
        setActiveDataIndex(null);
      }}
      onMouseMove={e => {
        const { pageX } = e;
        requestAnimationFrame(() => {
          onSetActivePoint(pageX);
        });
      }}>
      {dataForRender && (
        <svg
          className="chart"
          viewBox={`0 0 ${dataForRender.svgElement.viewBox[0]} ${
            dataForRender.svgElement.viewBox[1]
          }`}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg">
          <YAxisTicks
            topMargin={topMargin}
            yAxisPoints={dataForRender.yAxis.yAxisPoints}
            graphWidth={dataForRender.svgElement.viewBox[0]}
            svgYAxisLabelsWidth={svgYAxisLabelsWidth}
            yAxisLabelFromValue={yAxisLabelFromValue}
            textHeight={textHeight}
          />
          <XAxisTicks
            topMargin={topMargin}
            xAxisPoints={dataForRender.xAxis.xAxisPoints}
            svgXAxisLabelsHeight={svgXAxisLabelsHeight}
            graphHeight={dataForRender.svgElement.viewBox[1]}
            firstPoint={data[data.length - 1]}
            xAxisLabelFromInfo={xAxisLabelFromInfo}
          />
          <ChartLine data={dataForRender.data} command={lineCommand} />
          <TopMargin
            formatDataPoint={formatDataPoint}
            graphWidth={dataForRender.svgElement.viewBox[0]}
            dataForRender={dataForRender}
            activeDataIndex={activeDataIndex}
            data={data}
            isTouchDevice={isTouchDevice}
          />
          <ActiveDataPoint
            topMargin={topMargin}
            dataForRender={dataForRender}
            activeDataIndex={activeDataIndex}
            svgXAxisLabelsHeight={svgXAxisLabelsHeight}
            svgYAxisLabelsWidth={svgYAxisLabelsWidth}
          />
          {/* This is the 1px border between the top margin and the data */}
          <path
            d={`M0 ${topMargin} h ${dataForRender.svgElement.viewBox[0] -
              0 +
              1}`}
            stroke="var(--boundingBorderColor)"
            strokeWidth="var(--axisLineWidth)"
            fill="transparent"
          />
          {/* This is the 1px border between the chart and the x-axis labels */}
          <path
            d={`M0 ${dataForRender.svgElement.viewBox[1] -
              svgXAxisLabelsHeight} h ${dataForRender.svgElement.viewBox[0] -
              0 +
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
