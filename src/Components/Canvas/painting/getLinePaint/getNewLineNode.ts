import {getXRotationFunction, TRotationFunction} from '../getSpiralPaint/getXRotationFunction';
import {getBasePixelData} from '../../../../utils/getBasePixelData';

export type TLineNode = {
  originX?: number;
  originY?: number;
  x: number;
  y: number;
};

interface ILineNode {
  width: number;
  height: number;
  originX?: number;
  originY?: number;
}

export const getNewLineNode = ({width, height, originX, originY}: ILineNode): TLineNode => {
  const newX = Math.floor(Math.random() * width);
  const newY = Math.floor(Math.random() * height);

  return {
    originX: originX,
    originY: originY,
    x: newX,
    y: newY,
  };
};
