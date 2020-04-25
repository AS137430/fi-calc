import React from 'react';
import { OrderedPair } from '../types';

interface ChartLineOptions {
  data: OrderedPair[];
  command: (point: OrderedPair, index: number, arr: OrderedPair[]) => string;
}

// This draws the line that represents the data
export default function ChartLine({ data, command }: ChartLineOptions) {
  const d = data.reduce(
    (acc, point, i, a) =>
      i === 0
        ? // if first point
          `M ${point[0]},${point[1]}`
        : // else
          `${acc} ${command(point, i, a)}`,
    ''
  );
  return <path className="chartLine" d={d} fill="none" strokeWidth="3px" />;
}
