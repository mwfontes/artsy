import React, {createRef, useRef, useEffect} from 'react';
import {cx} from '@emotion/css';

import {getSpiralsPaint} from './painting/getSpiralsPaint/getSpiralsPaint';
import {getGradientLinesPaint} from './painting/getGradientLinesPaint/getGradientLinesPaint';
import {getHorizontalLinesPaint} from './painting/getHorizontalLinesPaint/getHorizontalLinesPaint';
import {getVerticalLinesPaint} from './painting/getVerticalLinesPaint/getVerticalLinesPaint';
import {getHorizontalVerticalLinesPaint} from './painting/hybrids/getHorizontalVerticalPaint';
import {getSpiralsGradientLinesPaint} from './painting/hybrids/getSpiralLinePaint';
import {getSlashLinesPaint} from './painting/getSlashLinesPaint/getSlashLinesPaint';
import {EPaintType, useAppSettings} from '../../Providers/AppSettings/AppSettings';

import styles from './Canvas.styles';
import {getTrianglesPaint} from './painting/getTrianglesPaint/getTrianglesPaint';

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
        if (paintType === EPaintType.SPIRALS) {
          getSpiralsPaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            screenRatio,
            width,
            height,
          });
        }
        if (paintType === EPaintType.GRADIENT_LINES) {
          getGradientLinesPaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            width,
            height,
          });
        }
        if (paintType === EPaintType.HYBRID_SPIRALS_GRADIENT_LINES) {
          getSpiralsPaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            screenRatio,
            width,
            height,
          });
        }
        if (paintType === EPaintType.HORIZONTAL_LINES) {
          getHorizontalLinesPaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            width,
            height,
          });
        }
        if (paintType === EPaintType.VERTICAL_LINES) {
          getVerticalLinesPaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            width,
            height,
            density: 1,
          });
        }
        if (paintType === EPaintType.HYBRID_HORIZONTAL_VERTICAL_LINES) {
          getHorizontalVerticalLinesPaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            width,
            height,
            density: 1,
          });
        }
        if (paintType === EPaintType.SLASH_LINES) {
          getSlashLinesPaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            width,
            height,
            density: 1,
          });
        }
        if (paintType === EPaintType.TRIANGLES) {
          getTrianglesPaint({
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
