import _ from 'lodash';
import linearScale from '../math/linear-scale';
import dollarTicks from './dollar-ticks';
import timeTicks from './time-ticks';

interface ChartData {
  historyKey: string;
  month: number;
  year: number;
  value: number;
}

interface RenderDataOption {
  data: ChartData[];
  svgWidth: number;
  svgYAxisSpacing: number;
  svgXAxisSpacing: number;
  textHeight: number;
  yLabelPadding: number;
  xAxisLabelWidth: number;
  xLabelPadding: number;
  svgAspectRatio: number;
}

type Scale = [number, number];

interface TickSpacing {
  svg: number;
  dom: number;
  data: number;
}

interface ScaleReturn {
  dom: Scale;
  svg: Scale;
  data: Scale;
}

interface DomainScaleReturn {
  dom: Scale;
  svg: Scale;
  data: 'TO_ADD';
}

type MappedDataPoint = Scale[];

interface RenderDataReturn {
  input: {
    data: ChartData[];
    domain: Scale;
    range: Scale;
  };

  svgElement: {
    viewBox: Scale;
    svgHeight: number;
    svgWidth: number;
  };

  yAxis: {
    yAxisPoints: any;
    numberOfTicks: number;
    tickSpacing: TickSpacing;
  };

  xAxis: {
    dataXTickSpacing: number;
    numberOfTicks: number;
    tickSpacing: TickSpacing;
  };

  data: MappedDataPoint[];

  range: ScaleReturn;
  domain: DomainScaleReturn;
}

export default function renderData({
  data,
  svgWidth,
  svgYAxisSpacing,
  svgXAxisSpacing,
  textHeight,
  yLabelPadding,
  xAxisLabelWidth,
  xLabelPadding,
  // This is used to ensure that the SVG element and the ViewBox
  // are always the same aspect ratio. This ensures that no weird
  // rendering effects occur as a result of preserveAspectRatio.
  svgAspectRatio = 0.5,
}: RenderDataOption): RenderDataReturn {
  const svgHeight = svgWidth * svgAspectRatio;

  const minYLabelHeight = textHeight + yLabelPadding;
  const maxYLabelCount = Math.floor(svgHeight / minYLabelHeight);

  const minXLabelWidth = xAxisLabelWidth + xLabelPadding;
  const maxXLabelCount = Math.floor(svgWidth / minXLabelWidth);

  const viewBoxHeight = svgWidth * svgAspectRatio;
  // The height and width of the SVG viewBox.
  const viewBox: Scale = [svgWidth, viewBoxHeight];

  const xValues = data.map((v, index) => index);
  const yValues = data.map(v => v.value);

  // This is the range of the data that can be drawn in the chart
  const chartRange = [0, viewBoxHeight - svgXAxisSpacing];
  const chartDomain = [0, svgWidth - svgYAxisSpacing];
  const chartRangeSize = chartRange[1] - chartRange[0];
  const chartDomainSize = chartDomain[1] - chartDomain[0];

  const domain: Scale = [Math.min(...xValues), Math.max(...xValues)];
  const range: Scale = [Math.min(...yValues), Math.max(...yValues)];

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

  const dataYTickSpacing =
    dollarTicks.find(v => v > naiveDataYTickSpacing) || NaN;

  const naiveDataXTickSpacing = domainSize / maxXLabelCount;
  const dataXTickSpacing =
    timeTicks.find(v => v > naiveDataXTickSpacing) || NaN;

  const dataRange: Scale = range.map((value, index) => {
    return index === 0
      ? // This Math.max ensures that the chart never shows values below $0
        Math.max(0, value - rangeIncreaseFactor)
      : value + rangeIncreaseFactor;
  }) as Scale;

  const trueRangeSize = dataRange[1] - dataRange[0];

  const numberOfYTickSegments = trueRangeSize / dataYTickSpacing;
  const domYTickSpacing = svgHeight / numberOfYTickSegments;
  const svgYTickSpacing = chartRangeSize / numberOfYTickSegments;

  const trueDomainSize = domain[1] - domain[0];

  const numberOfXTickSegments = trueDomainSize / dataXTickSpacing;
  const domXTickSpacing = svgWidth / numberOfXTickSegments;

  const svgXTickSpacing = chartDomainSize / numberOfXTickSegments;

  // TODO: come up with a better name for this. What does it represent?
  const valueForFirstTick = Math.ceil(dataRange[1] / dataYTickSpacing);
  const firstTick = valueForFirstTick * dataYTickSpacing - dataYTickSpacing;

  const diff = dataRange[1] - firstTick;
  const axisRangeSize = dataRange[1] - diff - dataRange[0];

  const actualNumOfYTickSegments = axisRangeSize / dataYTickSpacing + 1;

  const yAxisPoints = _.times(Math.floor(actualNumOfYTickSegments), n => {
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

  let hasIncludedZero = false;
  const mappedData = (data
    .map((point, index) => {
      const xDomainInput: Scale = [domain[0], domain[1]];

      // We flip the y axis so that larger values render _above_
      // lower values. This is necessary because tthe SVG y-axis points down.
      const yDomainInput: Scale = [-dataRange[1], -dataRange[0]];

      // The following conditionals ensure that once we plot a zero value, we stop
      // plotting.
      if (point.value === 0) {
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

      return [
        linearScale({
          domain: xDomainInput,
          range: [chartDomain[0], chartDomain[1]],
          value: index,
        }),
        linearScale({
          domain: yDomainInput,
          range: [chartRange[0], chartRange[1]],
          value: -point.value,
        }),
      ];
    })
    .filter(Boolean) as unknown) as MappedDataPoint[];

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
      dataXTickSpacing,
      numberOfTicks: numberOfXTickSegments,

      tickSpacing: {
        dom: domXTickSpacing,
        svg: svgXTickSpacing,
        data: dataXTickSpacing,
      },
    },

    data: mappedData,

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
