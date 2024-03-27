import Two from 'two.js';

import {getNewSpiralsNode, TSpiralNode} from './getNewSpiralsNode';
import {getBasePixelData} from '../../../../utils/getBasePixelData';
import {getIsOutOfBounds} from '../../../../utils/getIsOutOfBounds';
import {getIsFamilyOver} from '../../../../utils/getIsFamilyOver';
import {EResolution} from '../../../../Providers/AppSettings/AppSettings';
import {Vector} from 'two.js/src/vector';

interface ISpiralPaint {
  baseContext: CanvasRenderingContext2D;
  canvas: Two;
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

const initialLineWidth = 500; // Half of full size;
const stepSize: number = 16;
const stepsPerColor = 32;
const numberOfDescendants = 3;
const numberOfPasses = 3;

const getBaseColor = (node: TSpiralNode, baseContext: CanvasRenderingContext2D, step: number): TColor => {
  const {color} = node;
  if (step % stepsPerColor === 0) {
    let pixelX = node.x;
    let pixelY = node.y;
    if (pixelX > baseContext.canvas.width) {
      pixelX = baseContext.canvas.width - 1;
    }
    if (pixelY > baseContext.canvas.height) {
      pixelY = baseContext.canvas.height - 1;
    }
    if (pixelX < 0) {
      pixelX = 0;
    }
    if (pixelY < 0) {
      pixelY = 0;
    }
    const newColor = getBasePixelData(pixelX, pixelY, baseContext);
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
      return 16;
    case EResolution.LOW:
      return 32;
    case EResolution.MEDIUM:
      return 64;
    case EResolution.HIGH:
      return 128;
    case EResolution.VERY_HIGH:
      return 256;
    default:
      return 64;
  }
};

export const getSpiralsPaint = ({
  baseContext,
  canvas,
  width,
  height,
  screenRatio,
  resolution,
  isDescendants,
  parentNode,
}: ISpiralPaint) => {
  if (!canvas) {
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
      const descendantValues = {
        x,
        y,
        lineWidth,
        spiralSize,
        color,
      };
      let currentPathPoints = [];

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
        const isLastVertex = currentSpiralSize + stepSize >= spiralSize / currentPass;

        baseColor = getBaseColor({...node, ...descendantValues}, baseContext, currentSpiralSize);

        // draws the spiral from current node
        if ((currentSpiralSize % stepsPerColor === 0 && currentSpiralSize > 0) || isLastVertex) {
          currentPathPoints.push(new Two.Anchor(newX, newY, 0, 0, 0, 0, Two.Commands.curve));
          const bezierPath = new Two.Path(currentPathPoints, false, true, false);
          bezierPath.stroke = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
          bezierPath.closed = false;
          bezierPath.linewidth = lineWidth / getResolution(resolution) / currentPass;
          bezierPath.cap = 'round';
          bezierPath.noFill();
          canvas.add(bezierPath);
          currentPathPoints = [];
          currentPathPoints.push(new Two.Anchor(newX, newY, 0, 0, 0, 0, Two.Commands.move));
        } else {
          currentPathPoints.push(new Two.Anchor(newX, newY, 0, 0, 0, 0, Two.Commands.curve));
        }

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
          canvas,
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
  canvas.update();
};
