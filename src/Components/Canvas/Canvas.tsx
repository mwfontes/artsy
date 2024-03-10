import React, {createRef, useRef, useEffect} from 'react';
import {cx} from '@emotion/css';
import Two from 'two.js';

import {getSpiralsPaint} from './painting/getSpiralsPaint/getSpiralsPaint';
import {getGradientLinesPaint} from './painting/getGradientLinesPaint/getGradientLinesPaint';
import {getHorizontalLinesPaint} from './painting/getHorizontalLinesPaint/getHorizontalLinesPaint';
import {getVerticalLinesPaint} from './painting/getVerticalLinesPaint/getVerticalLinesPaint';
import {getHorizontalVerticalLinesPaint} from './painting/hybrids/getHorizontalVerticalPaint';
import {getSpiralsGradientLinesPaint} from './painting/hybrids/getSpiralLinePaint';
import {getSlashLinesPaint} from './painting/getSlashLinesPaint/getSlashLinesPaint';
import {EPaintType, useAppSettings} from '../../Providers/AppSettings/AppSettings';
import {getTrianglesPaint} from './painting/getTrianglesPaint/getTrianglesPaint';
import {getAverageColor} from '../../utils/getAverageColor';

import styles from './Canvas.styles';

export interface ICanvas {
  width: number;
  height: number;
  baseContext: CanvasRenderingContext2D;
}

function Canvas({width, height, baseContext}: ICanvas) {
  const {resolution, paintType} = useAppSettings();
  // const canvas = createRef<HTMLCanvasElement>();
  const canvas = createRef<HTMLDivElement>();
  // const ctx = useRef<CanvasRenderingContext2D>();
  const screenRatio = width / height;

  useEffect(() => {
    if (canvas.current && baseContext) {
      // Clears canvas with average colour
      const {r, g, b} = getAverageColor(baseContext);
      var paintCanvas = new Two({width, height, type: Two.Types.svg}).appendTo(canvas.current);
      paintCanvas.makeRectangle(width / 2, height / 2, width, height).fill = `rgb(${r}, ${g}, ${b})`;

      setTimeout(() => {
        if (paintType === EPaintType.SPIRALS) {
          // ctx.current!.drawImage(baseContext.canvas, 0, 0, width, height);
          getSpiralsPaint({
            baseContext: baseContext,
            // paintContext: ctx.current!,
            canvas: paintCanvas,
            resolution,
            screenRatio,
            width,
            height,
          });
        }
        // if (paintType === EPaintType.GRADIENT_LINES) {
        //   getGradientLinesPaint({
        //     baseContext: baseContext!,
        //     paintContext: ctx.current!,
        //     resolution,
        //     width,
        //     height,
        //   });
        // }
        // if (paintType === EPaintType.HYBRID_SPIRALS_GRADIENT_LINES) {
        //   getSpiralsPaint({
        //     baseContext: baseContext!,
        //     paintContext: ctx.current!,
        //     resolution,
        //     screenRatio,
        //     width,
        //     height,
        //   });
        // }
        // if (paintType === EPaintType.HORIZONTAL_LINES) {
        //   getHorizontalLinesPaint({
        //     baseContext: baseContext!,
        //     paintContext: ctx.current!,
        //     resolution,
        //     width,
        //     height,
        //   });
        // }
        // if (paintType === EPaintType.VERTICAL_LINES) {
        //   getVerticalLinesPaint({
        //     baseContext: baseContext!,
        //     paintContext: ctx.current!,
        //     resolution,
        //     width,
        //     height,
        //     density: 1,
        //   });
        // }
        // if (paintType === EPaintType.HYBRID_HORIZONTAL_VERTICAL_LINES) {
        //   getHorizontalVerticalLinesPaint({
        //     baseContext: baseContext!,
        //     paintContext: ctx.current!,
        //     resolution,
        //     width,
        //     height,
        //     density: 1,
        //   });
        // }
        // if (paintType === EPaintType.SLASH_LINES) {
        //   getSlashLinesPaint({
        //     baseContext: baseContext!,
        //     paintContext: ctx.current!,
        //     resolution,
        //     width,
        //     height,
        //     density: 1,
        //   });
        // }
        // if (paintType === EPaintType.TRIANGLES) {
        //   getTrianglesPaint({
        //     baseContext: baseContext!,
        //     paintContext: ctx.current!,
        //     resolution,
        //     width,
        //     height,
        //     density: 1,
        //   });
        // }
      }, 1);
    }
  }, [canvas, baseContext, canvas, resolution, screenRatio, width, height]);

  // return <canvas className={cx(styles.component)} width={width} height={height} ref={canvas} />;
  return <div className={cx(styles.component)} ref={canvas} id="canvas" />;
}

export default Canvas;
