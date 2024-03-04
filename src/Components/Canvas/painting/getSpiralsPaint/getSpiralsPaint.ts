import {getNewSpiralsNode, TSpiralNode} from './getNewSpiralsNode';
import {getBasePixelData} from '../../../../utils/getBasePixelData';
import {getIsOutOfBounds} from '../../../../utils/getIsOutOfBounds';
import {getIsFamilyOver} from '../../../../utils/getIsFamilyOver';
import {EResolution} from '../../../../Providers/AppSettings/AppSettings';

interface ISpiralPaint {
  baseContext: CanvasRenderingContext2D;
  paintContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  screenRatio: number;
  resolution: EResolution;
  isDescendants?: boolean;
  parentNode?: TSpiralNode;
}

type TColor = {
  r: number;
  g: number;
  b: number;
};

const initialLineWidth = 20;
// Block nodes are the squares that are drawn at the beginning of the spiral
const maxBlockNodes = 10;
const blockNodeInterval = 5;
// number of steps before reading new color from base image
const stepsPerColor = 10;
const numberOfDescendants = 5;

const getBaseColor = (node: TSpiralNode, baseContext: CanvasRenderingContext2D, step: number): TColor => {
  const {color} = node;
  if (step % stepsPerColor === 0) {
    const newColor = getBasePixelData(node.x, node.y, baseContext);
    return {
      r: newColor[0],
      g: newColor[1],
      b: newColor[2],
    };
  }
  return color;
};

const getResolution = (resolution: EResolution) => {
  switch (resolution) {
    case EResolution.VERY_LOW:
      return 100;
    case EResolution.LOW:
      return 300;
    case EResolution.MEDIUM:
      return 500;
    case EResolution.HIGH:
      return 700;
    case EResolution.VERY_HIGH:
      return 1000;
    default:
      return 500;
  }
};

export const getSpiralsPaint = ({
  baseContext,
  paintContext,
  width,
  height,
  screenRatio,
  resolution,
  isDescendants,
  parentNode,
}: ISpiralPaint) => {
  if (!paintContext) {
    return;
  }
  // creates nodes based on resolution.
  // 1 resultion point = 1 new node (spiral line)
  const nodes = [...new Array(isDescendants ? numberOfDescendants : getResolution(resolution))].map((_newItem) =>
    getNewSpiralsNode({baseContext, width, height, lineWidth: initialLineWidth, parentNode})
  );

  // for each node, draw the next lines
  nodes.forEach((node, i) => {
    const {x, y, deg, spiralSize, directionMultiplierX, directionMultiplierY, lineWidth} = node;
    let currentSpiralSize = 0;
    let baseColor = getBaseColor(node, baseContext, currentSpiralSize);
    const screenRatio = width > height ? height / width : width / height;
    const stepSize: number = 1;
    // draws the spiral from current node
    paintContext.beginPath();
    paintContext.moveTo(x, y); // starting point
    do {
      const newDeg = deg + currentSpiralSize * ((Math.PI * 8) / spiralSize);
      const newX = x + currentSpiralSize * Math.cos(newDeg) * directionMultiplierX;
      const newY = y + currentSpiralSize * Math.sin(newDeg) * directionMultiplierY;

      baseColor = getBaseColor(node, baseContext, currentSpiralSize);

      paintContext.lineTo(newX, newY);

      // Initial blocks
      /*
      const correctedBlockNodeInterval = Math.floor((lineWidth / stepSize) * blockNodeInterval);
      if (currentStep <= maxBlockNodes * correctedBlockNodeInterval && currentStep % correctedBlockNodeInterval === 0) {
        paintContext.strokeStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.25)`;
        paintContext.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${
          currentStep === 0 ? 0.8 : 0.5
        })`;
        paintContext.lineWidth = lineWidth / 4;
        paintContext.fillRect(x - lineWidth * 2, y - lineWidth * 2, lineWidth * 4, lineWidth * 4);
        paintContext.strokeRect(x - lineWidth * 2, y - lineWidth * 2, lineWidth * 4, lineWidth * 4);
      }
      */

      // Update values
      // x = newX;
      // y = newY;
      // deg = newDeg;
      currentSpiralSize += stepSize;
    } while (currentSpiralSize < spiralSize);
    paintContext.strokeStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
    paintContext.lineWidth = lineWidth;
    paintContext.lineCap = 'round';
    paintContext.stroke();

    // fires painting of descendants if ends painting parent
    /*
    if (!isDescendants) {
      getSpiralsPaint({
        baseContext,
        paintContext,
        width,
        height,
        screenRatio,
        resolution,
        isDescendants: true,
        parentNode: {...node, x, y, lineWidth: lineWidth / 2, deg},
      });
    }
    */
  });
};
