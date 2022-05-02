import React, { createRef, useRef, useEffect } from "react";
import { cx, css } from "@emotion/css";

import { getSpiralPaint } from "./getSpiralPaint";
import { getLinePaint } from "./getLinePaint";

import styles from "./Canvas.styles";

export enum EPaintType {
  SPIRAL = 'spiral',
  LINE = 'line',
  HYBRID = 'hybrid',
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
  // const animationFrame = useRef<any>();
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
        if (type === EPaintType.HYBRID) {
          getLinePaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families: families / 4,
            width,
            height,
          });
          getSpiralPaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families: families / 2,
            screenRatio,
            width,
            height,
          });
          getLinePaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families: families / 32,
            width,
            height,
            opacity: 0.5
          });
        }
      }, 1000);
    }
  }, [canvas, baseContext, ctx, families, screenRatio, width, height]);

  return <canvas className={cx(styles.component)} width={width} height={height} ref={canvas} />;
}

export default Canvas;
