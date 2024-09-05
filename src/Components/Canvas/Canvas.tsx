import React, {createRef, useRef, useEffect} from 'react';
import {cx} from '@emotion/css';
import Two from 'two.js';

import {getSpiralsPaint} from './painting/getSpiralsPaint/getSpiralsPaint';
import {useAppSettings} from '../../Providers/AppSettings/AppSettings';
import {getAverageColor} from '../../utils/getAverageColor';

import styles from './Canvas.styles';

export interface ICanvas {
  width: number;
  height: number;
  baseContext: CanvasRenderingContext2D;
  isDetail: boolean;
}

function Canvas({width, height, baseContext, isDetail}: ICanvas) {
  const {resolution} = useAppSettings();
  const canvas = createRef<HTMLDivElement>();
  const screenRatio = width / height;

  useEffect(() => {
    if (canvas.current && baseContext) {
      // Clears canvas with average colour
      const {r, g, b} = getAverageColor(baseContext);
      var paintCanvas = new Two({width, height, type: Two.Types.svg}).appendTo(canvas.current);
      paintCanvas.makeRectangle(width / 2, height / 2, width, height).fill = `rgb(${r}, ${g}, ${b})`;

      setTimeout(() => {
        getSpiralsPaint({
          baseContext: baseContext,
          canvas: paintCanvas,
          resolution,
          screenRatio,
          width,
          height,
          isDetail,
        });
      }, 1);
    }
  }, [canvas, baseContext, canvas, resolution, screenRatio, width, height]);

  return <div className={cx(styles.component)} ref={canvas} id="canvas" />;
}

export default Canvas;
