import React, { useEffect, useRef, useState } from 'react';
import './gaussian-plot.css';

function plotFunction(ctx, axes, func, color, thick) {
  var xx,
    yy,
    dx = 4,
    x0 = axes.x0,
    y0 = axes.y0,
    scale = axes.scale;
  var iMax = Math.round((ctx.canvas.width - x0) / dx);
  var iMin = axes.doNegativeX ? Math.round(-x0 / dx) : 0;
  ctx.beginPath();
  ctx.lineWidth = thick;
  ctx.strokeStyle = color;

  for (var i = iMin; i <= iMax; i++) {
    xx = dx * i;
    yy = func(xx / scale) * axes.scaleY;
    if (i == iMin) ctx.moveTo(x0 + xx, y0 - yy);
    else ctx.lineTo(x0 + xx, y0 - yy);
  }
  ctx.stroke();
}

function plotAxes(ctx, axes) {
  var x0 = axes.x0,
    w = ctx.canvas.width;
  var y0 = axes.y0,
    h = ctx.canvas.height;
  var xmin = axes.doNegativeX ? 0 : x0;
  ctx.beginPath();
  ctx.strokeStyle = 'rgb(128,128,128)';
  ctx.moveTo(xmin, y0);
  ctx.lineTo(w, y0); // X axis
  ctx.moveTo(x0, 0);
  ctx.lineTo(x0, h); // Y axis
  ctx.stroke();
}

function computePlotData(gaussian, canvas, mean, standardDeviation) {
  const maxY = gaussian(mean);
  const deviation3 = standardDeviation * 3;
  const avgX = mean;
  const minX = Math.max(0, avgX - deviation3);
  const maxX = avgX + deviation3;
  const deltaX = maxX - minX;

  const scale = canvas.width / deltaX;
  const paddedY = maxY * 1.2;
  const scaleY = canvas.height / paddedY;

  return {
    scale,
    scaleY,
    xMin: minX,
    xMax: maxX,
    yMax: maxY,
    yMin: 0,
  };
}

export default function GaussianPlot({ gaussian, mean, standardDeviation }) {
  const canvasRef = useRef();
  const [pData, setPData] = useState({});

  console.log('da results', mean, standardDeviation);

  useEffect(
    () => {
      const plotData = computePlotData(
        gaussian,
        canvasRef.current,
        mean,
        standardDeviation
      );

      setPData(plotData);

      const ctx = canvasRef.current.getContext('2d');
      var axes = {};
      // x0 pixels from left to x=0
      axes.x0 = 0;
      // y0 pixels from top to y=0
      axes.y0 = canvasRef.current.height;
      // The number of pixels from x=0 to x=1
      // This determines how much of the x-axis is visible
      axes.scale = plotData.scale;
      // Scale the Y axis
      axes.scaleY = plotData.scaleY;
      axes.doNegativeX = true;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      plotAxes(ctx, axes);
      plotFunction(ctx, axes, gaussian, 'rgb(11,153,11)', 1);
    },
    [mean, standardDeviation, gaussian]
  );

  console.log('hi', pData);

  return (
    <div className="gaussianPlot">
      <canvas width="500" height="250" ref={canvasRef} />
      <div className="gaussianPlot_minX">{pData.xMin?.toFixed(2)}</div>
      <div className="gaussianPlot_maxX">{pData.xMax?.toFixed(2)}</div>
    </div>
  );
}
