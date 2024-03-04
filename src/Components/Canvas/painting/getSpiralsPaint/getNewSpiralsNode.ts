import {getBasePixelData} from '../../../../utils/getBasePixelData';

export type TSpiralNode = {
  x: number;
  y: number;
  deg: number;
  directionMultiplierX: number;
  directionMultiplierY: number;
  speedRatio: number;
  lineStepLimit: number;
  lineWidth: number;
  color: {
    r: number;
    g: number;
    b: number;
  };
};

interface ISpiralNode {
  baseContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  parentNode?: TSpiralNode;
  lineWidth: number;
}

export const getNewSpiralsNode = ({baseContext, width, height, parentNode, lineWidth}: ISpiralNode): TSpiralNode => {
  const startingX = width / 2; // Math.floor(Math.random() * width);
  const startingY = height / 2; // Math.floor(Math.random() * height);
  const startingDeg = Math.random() * 2 * Math.PI;

  const imagePixelColor = getBasePixelData(parentNode?.x || startingX, parentNode?.y || startingY, baseContext);

  return {
    x: parentNode?.x || startingX,
    y: parentNode?.y || startingY,
    deg: parentNode?.deg || startingDeg,
    directionMultiplierX: Math.random() > 0.5 ? 1 : -1, // -1 or 1
    directionMultiplierY: Math.random() > 0.5 ? 1 : -1, // -1 or 1
    speedRatio: Math.random(),
    lineStepLimit: Math.floor(Math.random() * 200 + 100), // 100 to 300
    lineWidth: parentNode?.lineWidth || lineWidth,
    color: {
      r: parentNode?.color.r || imagePixelColor[0],
      g: parentNode?.color.g || imagePixelColor[1],
      b: parentNode?.color.b || imagePixelColor[2],
    },
  };
};
