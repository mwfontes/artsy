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
const stepsPerColor = 128;
const numberOfDescendants = 3;
const numberOfPasses = 3;

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
      return 4;
    case EResolution.LOW:
      return 8;
    case EResolution.MEDIUM:
      return 16;
    case EResolution.HIGH:
      return 32;
    case EResolution.VERY_HIGH:
      return 64;
    default:
      return 16;
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

  for (let currentPass = 1; currentPass < numberOfPasses + 1; currentPass++) {
    // creates nodes based on resolution.
    // 1 resultion point = 1 new node (spiral line)
    const nodes = [...new Array(isDescendants ? numberOfDescendants : getResolution(resolution))].map((_newItem) =>
      getNewSpiralsNode({baseContext, width, height, lineWidth: initialLineWidth, parentNode})
    );

    // for each node, draw the next lines
    nodes.forEach((node, i) => {
      const {x, y, deg, spiralSize, directionMultiplierX, directionMultiplierY, lineWidth, color} = node;
      let currentSpiralSize = 0;
      let baseColor = getBaseColor(node, baseContext, currentSpiralSize);
      const stepSize: number = 4;
      const descendantValues = {
        x,
        y,
        lineWidth,
        spiralSize,
        color,
      };

      do {
        const spiralGrowingCurve = isDescendants ? 1 : currentSpiralSize / spiralSize;
        const numberOfRevolutions = isDescendants ? 0.5 : 4;
        const newDeg = deg + currentSpiralSize * ((Math.PI * 2 * numberOfRevolutions) / spiralSize);
        const newX =
          x +
          currentSpiralSize *
            spiralGrowingCurve *
            (isDescendants ? Math.sin(newDeg) : Math.cos(newDeg)) *
            directionMultiplierX;
        const newY =
          y +
          currentSpiralSize *
            spiralGrowingCurve *
            (isDescendants ? Math.cos(newDeg) : Math.sin(newDeg)) *
            directionMultiplierY;

        baseColor = getBaseColor({...node, ...descendantValues}, baseContext, currentSpiralSize);

        // draws the spiral from current node
        paintContext.beginPath();
        paintContext.moveTo(descendantValues.x, descendantValues.y); // starting point
        paintContext.lineTo(newX, newY);
        paintContext.strokeStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        paintContext.lineWidth = lineWidth;
        paintContext.lineCap = 'round';
        paintContext.stroke();

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
        descendantValues.x = newX;
        descendantValues.y = newY;
        descendantValues.lineWidth = lineWidth / 2;
        descendantValues.spiralSize = spiralSize / currentPass;
        descendantValues.color = baseColor;

        currentSpiralSize += stepSize;
      } while (currentSpiralSize < spiralSize / currentPass);

      // fires painting of descendants if ends painting parent
      if (!isDescendants) {
        getSpiralsPaint({
          baseContext,
          paintContext,
          width,
          height,
          screenRatio,
          resolution,
          isDescendants: true,
          parentNode: {...node, ...descendantValues},
        });
      }
    });
  }
};
