import React from 'react';
import { OrderedPair } from '../types';

interface ChartLineOptions {
  data: OrderedPair[];
  command: (point: OrderedPair, index: number, arr: OrderedPair[]) => string;
}

// This draws the line that represents the data
export default function ChartLine({ data, command }: ChartLineOptions) {
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
