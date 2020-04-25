import React, { useRef, useState, useEffect, useMemo } from 'react';
import './chart.css';
import useElSize from './hooks/use-el-size';
import renderData, {
  RenderDataReturn,
  YAxisPoint,
  SvgElementObject,
  ChartData,
} from './utils/render-data';
import formatForDisplay from '../../utils/money/format-for-display';
import smallDisplay, {
  SmallDisplayMagnitude,
} from '../../utils/money/small-display';
import addYears from '../../utils/date/add-years';

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

type OrderedPair = [number, number];

// Linear function
const lineCommand = (point: OrderedPair): string => `L ${point[0]} ${point[1]}`;

// Generate a path from points
const svgPath = (
  points: OrderedPair[],
  command: (point: OrderedPair, index: number, arr: OrderedPair[]) => string
) => {
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
  yAxisPoints: YAxisPoint[],
  dataForRender: RenderDataReturn,
  svgYAxisSpacing: number,
  isSmallScreen: boolean
) {
  const { svgElement } = dataForRender;
  const tickWidth = dataForRender.svgElement.viewBox[0];

  return yAxisPoints.map((point, index) => {
    const tickYPosition = point.position;

    const useSmallDisplay = isSmallScreen;
    const useMediumDisplay = !isSmallScreen && point.label > 10000000;
    const useFullDisplay = !useSmallDisplay && !useMediumDisplay;

    const formatted = !useFullDisplay
      ? smallDisplay(
          point.label,
          3,
          useMediumDisplay
            ? SmallDisplayMagnitude.medium
            : SmallDisplayMagnitude.short
        )
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
            {typeof formatted !== 'string' && (
              <>
                {formatted.value < 0 ? formatted.prefix : ''}
                {useMediumDisplay && '$'}
                {formatted.value}
                {useMediumDisplay && ' '}
                {formatted.magnitude}
              </>
            )}
            {typeof formatted === 'string' && <>{formatted}</>}
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
  numberOfBars: number,
  svgBarWidth: number,
  data: ChartData[],
  svgElement: SvgElementObject,
  dataForRender: RenderDataReturn,
  svgYAxisSpacing: number
) {
  return Array.from({ length: numberOfBars }).map((val, index) => {
    const drawIndex = index;

    // We render from the right toward the left, so that the most recent date
    // is always labeled.
    const tickXPosition =
      dataForRender.domain.svg[1] - svgYAxisSpacing - svgBarWidth * drawIndex;
    const tickHeight = dataForRender.svgElement.viewBox[1];

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

interface ChartProps {
  data: ChartData[];
  isSmallScreen: boolean;
  yTicks: number[];
  xTicks: number[];
}

export default function Chart({
  data,
  isSmallScreen = false,
  xTicks,
  yTicks,
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
