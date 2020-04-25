import React from 'react';
import { OrderedPair } from '../types';

export default function svgPath(
  points: OrderedPair[],
  command: (point: OrderedPair, index: number, arr: OrderedPair[]) => string
) {
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
}
