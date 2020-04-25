import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useCurrentRef } from 'core-hooks';
import './chart.css';
import useIsSmallScreen from '../hooks/use-is-small-screen';
import useElSize from '../hooks/use-el-size';
import renderData from '../utils/chart/render-data';
import formatForDisplay from '../utils/money/format-for-display';
import smallDisplay from '../utils/money/small-display';
import addYears from '../utils/date/add-years';

// These are SVG units, but they should probably be in absolute
// units, so that I can control the text sizing.
// const svgYAxisSpacing = 75;
const svgXAxisSpacing = 25;

// The height of an SVG text element, in pixels
const textHeight = 17;
const xAxisLabelWidth = 40;

// The minimum padding that we want to have on our y axis.
const yLabelPadding = textHeight * 1.5;
const xLabelPadding = xAxisLabelWidth * 0.6;

// Linear function
const lineCommand = point => `L ${point[0]} ${point[1]}`;

// Generate a path from points
const svgPath = (points, command) => {
  // build the d attributes by looping over the points
  const d = points.reduce(
    (acc, point, i, a) =>
      i === 0
        ? // if first point
          `M ${point[0]},${point[1]}`
        : // else
          `${acc} ${command(point, i, a)}`,
    ''
  );
  return <path className="chartLine" d={d} fill="none" strokeWidth="3px" />;
};

function yAxisTicks(
  yAxisPoints,
  dataForRender,
  svgYAxisSpacing,
  isSmallScreen
) {
  const { svgElement } = dataForRender;
  const tickWidth = dataForRender.svgElement.viewBox[0];

  return yAxisPoints.map((point, index) => {
    const tickYPosition = point.position;

    const useSmallDisplay = isSmallScreen;
    const useMediumDisplay = !isSmallScreen && point.label > 10000000;
    const useFullDisplay = !useSmallDisplay && !useMediumDisplay;

    const formatted = !useFullDisplay
      ? smallDisplay(point.label, 3, useMediumDisplay ? 'medium' : 'short')
      : formatForDisplay(point.label, { digits: 0 });
    const isZero = Math.round(point.label) === 0;

    const renderLabel = tickYPosition > textHeight * 1.2;

    return (
      <React.Fragment key={index}>
        {renderLabel && (
          <text
            x={svgElement.viewBox[0] - svgYAxisSpacing + 5}
            y={tickYPosition - 4}
            className="chartLabel">
            {!useFullDisplay && (
              <>
                {formatted.value < 0 ? formatted.prefix : ''}
                {useMediumDisplay && '$'}
                {formatted.value}
                {useMediumDisplay && ' '}
                {formatted.magnitude}
              </>
            )}
            {useFullDisplay && <>{formatted}</>}
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

function xAxisTicks(
  numberOfBars,
  svgBarWidth,
  data,
  svgElement,
  dataForRender,
  svgYAxisSpacing
) {
  return Array.from({ length: numberOfBars }).map((val, index) => {
    const drawIndex = index;

    // We render from the right toward the left, so that the most recent date
    // is always labeled.
    const tickXPosition =
      dataForRender.domain.svg[1] - svgYAxisSpacing - svgBarWidth * drawIndex;
    const tickHeight = dataForRender.svgElement.viewBox[1];

    // const xAxisRange = dataForRender.domain.data;
    const maxPoint = data[data.length - 1];

    const dataSpacing = dataForRender.xAxis.tickSpacing.data;

    // I should instead use a system that allows me to add/subtract
    // months from the largest month in the dataset.
    const distanceFromMin = index * dataSpacing;

    const dateToUse = addYears(maxPoint, -distanceFromMin);

    return (
      <React.Fragment key={index}>
        <text
          x={tickXPosition + 5}
          y={svgElement.viewBox[1] - svgXAxisSpacing + 15}
          className="chartLabel">
          {dateToUse.year}
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
  });
}

export default function Chart({ data }) {
  const appRef = useRef();
  const [appEl, setAppEl] = useState(null);

  useEffect(() => {
    setAppEl(appRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSmallScreen = useIsSmallScreen();
  const isSmallScreenRef = useCurrentRef(isSmallScreen);

  const svgYAxisSpacing = isSmallScreen ? 45 : 100;

  const { width } = useElSize(appEl);

  const dataForRender = useMemo(
    () => {
      if (width) {
        return renderData({
          // Note: data will be stale
          data,
          svgWidth: width,
          svgYAxisSpacing,
          svgXAxisSpacing,
          textHeight,
          yLabelPadding,
          xAxisLabelWidth,
          xLabelPadding,
          svgAspectRatio: isSmallScreenRef.current ? 0.7 : 0.5,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width, data]
  );

  const [renderChart, setRenderChart] = useState(false);
  const renderChartRef = useRef(renderChart);
  renderChartRef.current = renderChart;

  useEffect(
    () => {
      if (dataForRender) {
        setRenderChart(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataForRender]
  );

  return (
    <div className="chartContainer" ref={appRef}>
      {renderChart && (
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
            isSmallScreen
          )}
          {xAxisTicks(
            dataForRender.xAxis.numberOfTicks + 1,
            dataForRender.xAxis.tickSpacing.svg,
            data,
            dataForRender.svgElement,
            dataForRender,
            svgYAxisSpacing
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
