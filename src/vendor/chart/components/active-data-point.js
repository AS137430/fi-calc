import React from 'react';

// This draws the line that represents the data
export default function ActiveDataPoint({
  dataForRender,
  activeDataIndex,
  svgXAxisLabelsHeight,
  svgYAxisLabelsWidth,
  topMargin,
}) {
  if (activeDataIndex === null) {
    return null;
  }

  const point = dataForRender.data[activeDataIndex];

  return (
    <>
      <circle cx={point[0]} cy={point[1]} r="8px" fill="#141414" />
      <circle cx={point[0]} cy={point[1]} r="5px" fill="var(--accentColor)" />
      <path
        d={`M${point[0]} ${topMargin} v ${dataForRender.svgElement.viewBox[1] -
          svgXAxisLabelsHeight -
          topMargin}`}
        stroke="var(--accentColor)"
        strokeWidth="2px"
        fill="transparent"
      />
    </>
  );
}
