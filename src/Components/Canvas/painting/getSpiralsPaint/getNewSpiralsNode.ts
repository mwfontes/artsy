import {getBasePixelData} from '../../../../utils/getBasePixelData';

export type TSpiralNode = {
  x: number;
  y: number;
  deg: number;
  directionMultiplierX: number;
  directionMultiplierY: number;
  spiralSize: number;
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
  const startingX = Math.floor(Math.random() * width);
  const startingY = Math.floor(Math.random() * height);
  const startingDeg = Math.random() * 2 * Math.PI;
  const minimumSpiralSize = width > height ? width / 16 : height / 16;
  const spiralSize = (width > height ? width / 4 : height / 4) - minimumSpiralSize;

  const imagePixelColor = getBasePixelData(parentNode?.x || startingX, parentNode?.y || startingY, baseContext);

  return {
    x: parentNode?.x || startingX,
    y: parentNode?.y || startingY,
    deg: parentNode?.deg || startingDeg,
    directionMultiplierX: Math.random() > 0.5 ? 1 : -1, // -1 or 1
    directionMultiplierY: Math.random() > 0.5 ? 1 : -1, // -1 or 1
    spiralSize: Math.floor(Math.random() * spiralSize + minimumSpiralSize),
    lineWidth: parentNode?.lineWidth || lineWidth,
    color: {
      r: parentNode?.color.r || imagePixelColor[0],
      g: parentNode?.color.g || imagePixelColor[1],
      b: parentNode?.color.b || imagePixelColor[2],
    },
  };
};
