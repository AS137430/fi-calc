import React from 'react';

export default function TopMargin({
  activeDataIndex,
  dataForRender,
  data,
  graphWidth,
  isTouchDevice,
  formatDataPoint,
}) {
  if (activeDataIndex === null) {
    return (
      <>
        <text
          fill="#888"
          x={graphWidth / 2}
          y={24}
          textAnchor="middle"
          style={{
            fontSize: '14px',
          }}>
          {isTouchDevice && <>Tap and hold chart for details</>}
          {!isTouchDevice && <>Hover over chart for details</>}
        </text>
      </>
    );
  }

  const activePoint = data[activeDataIndex];
  const point = dataForRender.data[activeDataIndex];

  if (!point) {
    return null;
  }

  const render = formatDataPoint(activePoint);

  const hitsLeftLimit = point[0] < 50;
  const hitsRightLimit = point[0] > graphWidth - 50;

  let textAnchor = 'middle';
  if (hitsLeftLimit) {
    textAnchor = 'start';
  } else if (hitsRightLimit) {
    textAnchor = 'end';
  }

  let textXPosition = point[0];
  if (hitsLeftLimit) {
    textXPosition = 5;
  } else if (hitsRightLimit) {
    textXPosition = graphWidth - 5;
  }

  return (
    <>
      <text
        x={textXPosition}
        textAnchor={textAnchor}
        y={15}
        className="chartLabel chartLabel-top">
        {render.x}
      </text>
      <text
        x={textXPosition}
        y={33}
        textAnchor={textAnchor}
        className="chartLabel chartLabel-detail chartLabel-top"
        fill="var(--accentColor)">
        {render.y}
      </text>
    </>
  );
}
