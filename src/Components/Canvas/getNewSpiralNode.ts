import { getXRotationFunction } from "./getXRotationFunction";
import { getBasePixelData } from "../../utils/getBasePixelData";
import { TNode } from "../../types";

interface ISpiralNode {
  baseContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  node?: TNode;
  lineWidth: number;
}

export const getNewSpiralNode = ({ baseContext, width, height, node, lineWidth }: ISpiralNode): TNode => {
  const newX = Math.floor(Math.random() * width);
  const newY = Math.floor(Math.random() * height);

  const imagePixelColor = getBasePixelData(node?.x || newX, node?.y || newY, baseContext);

  return {
    x: node?.x || newX,
    y: node?.y || newY,
    deg: Math.random() * 2 * Math.PI,
    step: 0,
    directionMultiplierX: Math.floor(Math.random() * 2) || -1, // -1 or 1
    directionMultiplierY: Math.floor(Math.random() * 2) || -1, // -1 or 1
    speedRatio: Math.random(),
    lineStepLimit: Math.random() * 300,
    descendant: node?.descendant || 0,
    lineWidth: node?.lineWidth || lineWidth,
    color: {
      r: node?.color.r || imagePixelColor[0],
      g: node?.color.g || imagePixelColor[1],
      b: node?.color.b || imagePixelColor[2],
    },
    xRotationFunction: node?.xRotationFunction || getXRotationFunction(),
  };
};
