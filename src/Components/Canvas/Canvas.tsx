import React, { createRef, useRef, useEffect } from "react";

import { getSpiralPaint } from "./getSpiralPaint";
import {getLinePaint} from "./getLinePaint";

import "./Canvas.css";

export interface ICanvas {
  families: number
  width: number;
  height: number;
  baseContext: CanvasRenderingContext2D;
  type: 'spiral' | 'line' | 'hybrid';
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
        if (type === "spiral") {
          getSpiralPaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            screenRatio,
            width,
            height,
          });
        }
        if (type === "line") {
          getLinePaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families,
            width,
            height,
          });
        }
        if (type === "hybrid") {
          getLinePaint({
            baseContext: baseContext!,
            paintContext: ctx.current!,
            families: families / 2,
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
        }
      }, 1000);
    }
  }, [canvas, baseContext, ctx, families, screenRatio, width, height]);

  return <canvas className='canvas' width={width} height={height} ref={canvas} />;
}

export default Canvas;
