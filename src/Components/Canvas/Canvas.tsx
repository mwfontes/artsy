import React, {createRef, useRef, useEffect} from 'react';
import {cx} from '@emotion/css';

import {getSpiralPaint} from './painting/getSpiralPaint/getSpiralPaint';
import {getLinePaint} from './painting/getLinePaint/getLinePaint';
import {getHorizontalPaint} from './painting/getHorizontalPaint/getHorizontalPaint';
import {getVerticalPaint} from './painting/getVerticalPaint/getVerticalPaint';
import {getHorizontalVerticalPaint} from './painting/hybrids/getHorizontalVerticalPaint';
import {getSpiralLinePaint} from './painting/hybrids/getSpiralLinePaint';
import {getSlashPaint} from './painting/getSlashPaint/getSlashPaint';
import {EPaintType, useAppSettings} from '../../Providers/AppSettings/AppSettings';

import styles from './Canvas.styles';

export interface ICanvas {
  width: number;
  height: number;
  baseContext: CanvasRenderingContext2D;
}

function Canvas({width, height, baseContext}: ICanvas) {
  const {families, paintType} = useAppSettings();
  const canvas = createRef<HTMLCanvasElement>();
  const ctx = useRef<CanvasRenderingContext2D>();
  const screenRatio = width > height ? height / width : width / height;

  useEffect(() => {
    if (canvas.current) {
      ctx.current = canvas.current?.getContext('2d')!;
      setTimeout(() => {
        if (paintType === EPaintType.SPIRAL) {
          getSpiralPaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            screenRatio,
            width,
            height,
          });
        }
        if (paintType === EPaintType.LINE) {
          getLinePaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            width,
            height,
          });
        }
        if (paintType === EPaintType.HYBRID_SPIRAL_LINE) {
          getSpiralLinePaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            screenRatio,
            width,
            height,
          });
        }
        if (paintType === EPaintType.HORIZONTAL) {
          getHorizontalPaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            width,
            height,
          });
        }
        if (paintType === EPaintType.VERTICAL) {
          getVerticalPaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            width,
            height,
            density: 1,
          });
        }
        if (paintType === EPaintType.HYBRID_HORIZONTAL_VERTICAL) {
          getHorizontalVerticalPaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            width,
            height,
            density: 1,
          });
        }
        if (paintType === EPaintType.SLASH) {
          getSlashPaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            width,
            height,
            density: 1,
          });
        }
      }, 1000);
    }
  }, [canvas, baseContext, ctx, families, screenRatio, width, height]);

  return <canvas className={cx(styles.component)} width={width} height={height} ref={canvas} />;
}

export default Canvas;
