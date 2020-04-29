import linearScale from './linear-scale';
import {
  ChartDataPoint,
  YAxisPoint,
  XAxisPoint,
  OrderedPair,
  SvgElementObject,
} from '../types';

interface RenderDataOption {
  data: ChartDataPoint[];
  svgWidth: number;
  svgYAxisLabelsWidth: number;
  svgXAxisLabelsHeight: number;
  textHeight: number;
  yLabelPadding: number;
  xAxisLabelWidth: number;
  xLabelPadding: number;
  svgAspectRatio: number;
  yTicks: number[];
  xTicks: number[];
  topMargin: number;
}

interface TickSpacing {
  svg: number;
  dom: number;
  data: number;
}

interface ScaleReturn {
  dom: OrderedPair;
  svg: OrderedPair;
  data: OrderedPair;
}

interface DomainScaleReturn {
  dom: OrderedPair;
  svg: OrderedPair;
  data: 'TO_ADD';
}

export interface RenderDataReturn {
  input: {
    data: ChartDataPoint[];
    domain: OrderedPair;
    range: OrderedPair;
  };

  svgElement: SvgElementObject;

  yAxis: {
    yAxisPoints: YAxisPoint[];
    numberOfTicks: number;
    tickSpacing: TickSpacing;
  };

  xAxis: {
    xAxisPoints: XAxisPoint[];
    dataXTickSpacing: number;
    numberOfTicks: number;
    tickSpacing: TickSpacing;
  };

  data: OrderedPair[];
  dataMeta: {
    dataIndexDomain: OrderedPair;
  };

  chart: {
    chartDomain: OrderedPair;
    chartRange: OrderedPair;
  };

  range: ScaleReturn;
  domain: DomainScaleReturn;
}

function times(n: number, cb: (n: number) => any) {
  let result = [];
  for (let i = 0; i < n; i++) {
    result.push(cb(i));
  }
  return result;
}

export default function renderData({
  data,
  svgWidth,
  svgYAxisLabelsWidth,
  svgXAxisLabelsHeight,
  textHeight,
  yLabelPadding,
  xAxisLabelWidth,
  xLabelPadding,
  // This is used to ensure that the SVG element and the ViewBox
  // are always the same aspect ratio. This ensures that no weird
  // rendering effects occur as a result of preserveAspectRatio.
  svgAspectRatio = 0.5,
  xTicks,
  yTicks,
  topMargin,
}: RenderDataOption): RenderDataReturn {
  const svgHeight = svgWidth * svgAspectRatio;

  const minYLabelHeight = textHeight + yLabelPadding;
  // TODO: is this wrong? Should it be using the svgHeight - xAxisLabelHeight?
  const maxYLabelCount = Math.floor(svgHeight / minYLabelHeight);

  const minXLabelWidth = xAxisLabelWidth + xLabelPadding;
  // TODO: is this wrong? Should it be using the svgWidth - yAxisLabelWidth?
  const maxXLabelCount = Math.floor(svgWidth / minXLabelWidth);

  const viewBoxHeight = svgWidth * svgAspectRatio;
  // The height and width of the SVG viewBox.
  const viewBox: OrderedPair = [svgWidth, viewBoxHeight];

  const xValues = data.map((v, index) => index);
  const yValues = data.map(dataPoint => dataPoint.y);

  // This is the range of the data that can be drawn in the chart
  const chartRange: OrderedPair = [
    topMargin,
    viewBoxHeight - svgXAxisLabelsHeight,
  ];
  const chartDomain: OrderedPair = [0, svgWidth - svgYAxisLabelsWidth];
  const chartRangeSize = chartRange[1] - chartRange[0];
  const chartDomainSize = chartDomain[1] - chartDomain[0];

  const domain: OrderedPair = [Math.min(...xValues), Math.max(...xValues)];
  const range: OrderedPair = [Math.min(...yValues), Math.max(...yValues)];

  const noRange = range[0] === range[1];

  const domainSize = domain[1] - domain[0];
  const rangeSize = range[1] - range[0];

  // This ensures that there's a bit of padding in the chart between the lowest and highest
  // value in the data.
  let rangeIncreaseFactor = Number.NaN;
  if (noRange) {
    rangeIncreaseFactor = range[0] * 0.05;
  } else {
    rangeIncreaseFactor = rangeSize * 0.03;
  }

  let naiveDataYTickSpacing = Number.NaN;
  if (noRange) {
    naiveDataYTickSpacing = (rangeIncreaseFactor * 2) / maxYLabelCount;
  } else {
    naiveDataYTickSpacing = rangeSize / maxYLabelCount;
  }

  const dataYTickSpacing = yTicks.find(v => v > naiveDataYTickSpacing) || NaN;

  const naiveDataXTickSpacing = domainSize / maxXLabelCount;
  const dataXTickSpacing = xTicks.find(v => v > naiveDataXTickSpacing) || NaN;

  const dataRange: OrderedPair = range.map((value, index) => {
    return index === 0
      ? // This Math.max ensures that the chart never shows values below $0
        Math.max(0, value - rangeIncreaseFactor)
      : value + rangeIncreaseFactor;
  }) as OrderedPair;

  const trueRangeSize = dataRange[1] - dataRange[0];

  const numberOfYTickSegments = trueRangeSize / dataYTickSpacing;
  const domYTickSpacing = svgHeight / numberOfYTickSegments;
  const svgYTickSpacing = chartRangeSize / numberOfYTickSegments;

  let trueDomainSize = domain[1] - domain[0];

  const isRenderingSinglePoint = trueDomainSize === 0;

  // When we render a single point, we render it in the middle of the point to the left
  // and right of it.
  if (isRenderingSinglePoint) {
    trueDomainSize = 2;
  }

  const numberOfXTickSegments = trueDomainSize / dataXTickSpacing;
  const domXTickSpacing = svgWidth / numberOfXTickSegments;

  const svgXTickSpacing = chartDomainSize / Math.max(1, numberOfXTickSegments);

  // TODO: come up with a better name for this. What does it represent?
  const valueForFirstTick = Math.ceil(dataRange[1] / dataYTickSpacing);
  const firstTick = valueForFirstTick * dataYTickSpacing - dataYTickSpacing;

  const diff = dataRange[1] - firstTick;
  const axisRangeSize = dataRange[1] - diff - dataRange[0];

  const actualNumOfYTickSegments = axisRangeSize / dataYTickSpacing + 1;

  const yAxisPoints = times(Math.floor(actualNumOfYTickSegments), n => {
    const dollarAmount = firstTick - n * dataYTickSpacing;

    const position = linearScale({
      domain: dataRange,
      range: [chartRange[1], chartRange[0]],
      value: dollarAmount,
    });

    return {
      position,
      label: dollarAmount,
    };
  });

  const spacingFitsDomain = trueDomainSize % dataXTickSpacing === 0;
  // Sometimes, the number of ticks lines up with our domain of data. In these situations,
  // we can render an extra label without cutting them off.
  const xTicksToRender = spacingFitsDomain
    ? numberOfXTickSegments + 1
    : numberOfXTickSegments;
  const spaceBetweenXAxisLabels = svgWidth / xTicksToRender;

  const xAxisPoints: XAxisPoint[] = times(xTicksToRender, index => {
    const distanceIndex = isRenderingSinglePoint ? index - 1 : index;
    const drawIndex = index;

    // We render from the right toward the left, so that the most recent date
    // is always labeled.
    const tickXPosition =
      svgWidth - svgYAxisLabelsWidth - svgXTickSpacing * drawIndex;

    // I should instead use a system that allows me to add/subtract
    // x-values from the largest x-value in the dataset.
    const distanceFromMin = distanceIndex * dataXTickSpacing;

    return {
      width: index === 0 ? svgYAxisLabelsWidth : spaceBetweenXAxisLabels,
      position: tickXPosition,
      distance: -distanceFromMin,
    };
  });
  const xDomainInput: OrderedPair = [domain[0], domain[1]];
  // We flip the y axis so that larger values render _above_
  // lower values. This is necessary because the SVG y-axis points down.
  const yDomainInput: OrderedPair = [-dataRange[1], -dataRange[0]];

  const xDomainToUse: [number, number] = isRenderingSinglePoint
    ? [0, 2]
    : xDomainInput;

  let hasIncludedZero = false;
  const mappedData = (data
    .map((point, index) => {
      // The following conditionals ensure that once we plot a zero value, we stop
      // plotting.
      if (point.y === 0) {
        // If this value is 0, and we already have a 0 value, then we don't include
        // the point.
        if (hasIncludedZero) {
          return null;
        }
        // This ensures that we only include a single zero.
        else {
          hasIncludedZero = true;
        }
      }

      const xIndexToUse = isRenderingSinglePoint ? 1 : index;

      return [
        linearScale({
          domain: xDomainToUse,
          range: [chartDomain[0], chartDomain[1]],
          value: xIndexToUse,
        }),
        linearScale({
          domain: yDomainInput,
          range: [chartRange[0], chartRange[1]],
          value: -point.y,
        }),
      ];
    })
    .filter(Boolean) as unknown) as OrderedPair[];

  return {
    // Raw values from what the user passes in
    input: {
      data,
      domain,
      range,
    },

    // Props for the SVG Element
    svgElement: {
      viewBox,
      svgHeight,
      svgWidth,
    },

    yAxis: {
      yAxisPoints,
      numberOfTicks: numberOfYTickSegments,

      // The space between bars.
      tickSpacing: {
        svg: svgYTickSpacing,
        dom: domYTickSpacing,
        data: dataYTickSpacing,
      },
    },

    xAxis: {
      xAxisPoints,
      dataXTickSpacing,
      numberOfTicks: numberOfXTickSegments,

      tickSpacing: {
        dom: domXTickSpacing,
        svg: svgXTickSpacing,
        data: dataXTickSpacing,
      },
    },

    data: mappedData,
    dataMeta: {
      dataIndexDomain: xDomainToUse,
    },

    chart: {
      chartDomain,
      chartRange,
    },

    // Ranges in different units
    range: {
      dom: [0, svgHeight],
      svg: [0, viewBoxHeight],
      data: dataRange,
    },

    // Domains in different units
    domain: {
      dom: [0, svgWidth],
      svg: [0, svgWidth],
      data: 'TO_ADD',
    },
  };
}
