import React, { createRef, useRef, useEffect } from "react";
import { cx } from "@emotion/css";

import { getSpiralPaint } from "./painting/getSpiralPaint/getSpiralPaint";
import { getLinePaint } from "./painting/getLinePaint/getLinePaint";
import { getHorizontalPaint } from "./painting/getHorizontalPaint/getHorizontalPaint";
import { getVerticalPaint } from "./painting/getVerticalPaint/getVerticalPaint";
import { getHorizontalVerticalPaint } from "./painting/hybrids/getHorizontalVerticalPaint";
import { getSpiralLinePaint } from "./painting/hybrids/getSpiralLinePaint";
import { getSlashPaint } from "./painting/getSlashPaint/getSlashPaint";

import styles from "./Canvas.styles";

export enum EPaintType {
  SPIRAL = "spiral",
  LINE = "line",
  HORIZONTAL = "horizontal lines",
  VERTICAL = "vertical lines",
  SLASH = "slash lines",
  HYBRID_HORIZONTAL_VERTICAL = "horizontal + vertical lines",
  HYBRID_SPIRAL_LINE = "spiral + line",
}

export interface ICanvas {
  families: number;
  width: number;
  height: number;
  baseContext: CanvasRenderingContext2D;
  type: EPaintType;
}

function Canvas({ families, width, height, baseContext, type }: ICanvas) {
  const canvas = createRef<HTMLCanvasElement>();
  const ctx = useRef<CanvasRenderingContext2D>();
  const screenRatio = width > height ? height / width : width / height;

  useEffect(() => {
    if (canvas.current) {
      ctx.current = canvas.current?.getContext("2d")!;
      setTimeout(() => {
        if (type === EPaintType.SPIRAL) {
          getSpiralPaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            screenRatio,
            width,
            height,
          });
        }
        if (type === EPaintType.LINE) {
          getLinePaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            width,
            height,
          });
        }
        if (type === EPaintType.HYBRID_SPIRAL_LINE) {
          getSpiralLinePaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            screenRatio,
            width,
            height,
          });
        }
        if (type === EPaintType.HORIZONTAL) {
          getHorizontalPaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            width,
            height,
          });
        }
        if (type === EPaintType.VERTICAL) {
          getVerticalPaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            width,
            height,
            density: 1,
          });
        }
        if (type === EPaintType.HYBRID_HORIZONTAL_VERTICAL) {
          getHorizontalVerticalPaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            width,
            height,
            density: 1,
          });
        }
        if (type === EPaintType.SLASH) {
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

