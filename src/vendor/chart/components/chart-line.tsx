import React from 'react';
import { OrderedPair } from '../types';

interface ChartLineOptions {
  data: OrderedPair[];
  command: (point: OrderedPair, index: number, arr: OrderedPair[]) => string;
}

// This draws the line that represents the data
export default function ChartLine({ data, command }: ChartLineOptions) {
  if (data.length === 1) {
    /* tbqh I'm not sure where the 0.5/1 come from.
    Maybe the chart's border? */
    return (
      <circle
        cx={data[0][0] + 0.5}
        cy={data[0][1] + 1}
        r="7px"
        fill="var(--accentColor)"
      />
    );
  }

  const d = data.reduce((result, point, index, allData) => {
    const isFirstPoint = index === 0;

    if (isFirstPoint) {
      return `M ${point[0]},${point[1]}`;
    } else {
      return `${result} ${command(point, index, allData)}`;
    }
  }, '');

  return <path className="chartLine" d={d} fill="none" />;
}
