export interface ChartDataPoint {
  x: number | string;
  y: number;
}

export interface YAxisPoint {
  position: number;
  label: number;
}

export interface XAxisPoint {
  position: number;
  distance: number;
  width: number;
}

export type OrderedPair = [number, number];

export interface SvgElementObject {
  viewBox: OrderedPair;
  svgHeight: number;
  svgWidth: number;
}

export type YAxisLabelFromValue = (value: number) => string | number;
export type XAxisLabelFromInfo = (
  maxChartDataPoint: ChartDataPoint,
  distanceFromMaxChartDataPoint: XAxisPoint
) => string;

export type FormatDataPoint = (point: ChartDataPoint) => ChartDataPoint;
