import React, { createRef, useRef, useEffect } from "react";

import { ICanvas } from "../../types";
import { getSpiralPaint } from "./getSpiralPaint";

import "./Canvas.css";

function Canvas({ families, width, height, baseContext }: ICanvas) {
  const canvas = createRef<HTMLCanvasElement>();
  // const animationFrame = useRef<any>();
  const ctx = useRef<CanvasRenderingContext2D>();
  const screenRatio = width > height ? height / width : width / height;

  useEffect(() => {
    if (canvas.current) {
      ctx.current = canvas.current?.getContext("2d")!;
      setTimeout(() => {
        getSpiralPaint({
          baseContext: baseContext!,
          paintContext: ctx.current!,
          families,
          screenRatio,
          width,
          height,
        });
      }, 1000);
    }
  }, [canvas, baseContext, ctx, families, screenRatio, width, height]);

  return <canvas className='canvas' width={width} height={height} ref={canvas} />;
}

export default Canvas;
