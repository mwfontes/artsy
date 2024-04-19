import Two from 'two.js';

import {getNewSpiralsNode, TSpiralNode} from './getNewSpiralsNode';
import {getBasePixelData} from '../../../../utils/getBasePixelData';
import {getIsOutOfBounds} from '../../../../utils/getIsOutOfBounds';
import {EResolution} from '../../../../Providers/AppSettings/AppSettings';

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

const getBaseColor = (
  node: TSpiralNode,
  baseContext: CanvasRenderingContext2D,
  step: number,
  stepsPerColor: number
): TColor => {
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
      return 2;
    case EResolution.LOW:
      return 3;
    case EResolution.MEDIUM:
      return 4;
    case EResolution.HIGH:
      return 5;
    case EResolution.VERY_HIGH:
      return 6;
    default:
      return 4;
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

  const initialLineWidth = 100; // Half of full size;
  const stepSize: number = 16;
  const stepsPerColor = 16;
  const numberOfDescendants = 3;
  const numberOfPasses = getResolution(resolution);
  const fineTuneCurve = 4;

  for (let currentPass = 1; currentPass < numberOfPasses + 1; currentPass++) {
    const numberOfMainSpirals = numberOfPasses * numberOfPasses;
    // creates nodes based on resolution.
    // 1 resultion point = 1 new node (spiral line)
    const nodes = [...new Array(isDescendants ? numberOfDescendants : numberOfMainSpirals)].map((_newItem) =>
      getNewSpiralsNode({baseContext, width, height, lineWidth: initialLineWidth, parentNode})
    );

    // for each node, draw the next lines
    nodes.forEach((node, i) => {
      const {x, y, deg, spiralSize, directionMultiplierX, directionMultiplierY, lineWidth, color} = node;
      let currentSpiralSize = 0;
      let baseColor = getBaseColor(node, baseContext, currentSpiralSize, stepsPerColor);
      const shapeWidth = lineWidth / currentPass;
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

        if (currentSpiralSize * spiralGrowingCurve < shapeWidth && !isDescendants) {
          currentSpiralSize += stepSize / fineTuneCurve;
        } else {
          const addToDeg = currentSpiralSize * ((Math.PI * 2 * numberOfRevolutions) / spiralSize);
          const newDeg = deg + addToDeg;
          const currentRadius = currentSpiralSize * spiralGrowingCurve;
          const newXa =
            x + // current position
            (currentRadius + shapeWidth / 2) *
              (isDescendants ? Math.sin(newDeg) : Math.cos(newDeg)) *
              directionMultiplierX; // clockwise or counter-clockwise
          const newYa =
            y +
            (currentRadius + shapeWidth / 2) *
              (isDescendants ? Math.cos(newDeg) : Math.sin(newDeg)) *
              directionMultiplierY;
          const newXb =
            x + // current position
            (currentRadius - shapeWidth / 2) *
              (isDescendants ? Math.sin(newDeg) : Math.cos(newDeg)) *
              directionMultiplierX; // clockwise or counter-clockwise
          const newYb =
            y +
            (currentRadius - shapeWidth / 2) *
              (isDescendants ? Math.cos(newDeg) : Math.sin(newDeg)) *
              directionMultiplierY;

          const isLastVertex = currentSpiralSize + stepSize >= spiralSize / currentPass;

          baseColor = getBaseColor({...node, ...descendantValues}, baseContext, currentSpiralSize, stepsPerColor);

          if (getIsOutOfBounds({node, width, height})) {
            return;
          }

          // draws the spiral from current node
          currentPathPoints.push(new Two.Anchor(newXb, newYb, 0, 0, 0, 0, Two.Commands.line));
          currentPathPoints.push(new Two.Anchor(newXa, newYa, 0, 0, 0, 0, Two.Commands.line));
          console.log('last one and restart', currentPathPoints);
          const bezierPath = new Two.Path(currentPathPoints, false, false, false);
          bezierPath.fill = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 1)`;
          bezierPath.closed = false;
          bezierPath.linewidth = lineWidth / currentPass;
          bezierPath.cap = 'miter';
          bezierPath.noStroke();
          canvas.add(bezierPath);
          currentPathPoints = [];
          currentPathPoints.push(new Two.Anchor(newXa, newYa, 0, 0, 0, 0, Two.Commands.line));
          currentPathPoints.push(new Two.Anchor(newXb, newYb, 0, 0, 0, 0, Two.Commands.line));

          // Update values
          descendantValues.x = (newXa + newXb) / 2;
          descendantValues.y = (newYa + newYb) / 2;
          descendantValues.lineWidth = lineWidth / currentPass;
          descendantValues.spiralSize = spiralSize / currentPass;
          descendantValues.color = baseColor;

          currentSpiralSize += stepSize / fineTuneCurve;
        }
      } while (currentSpiralSize < spiralSize / (currentPass * 0.5));

      // fires painting of descendants if ends painting parent
      // if (!isDescendants) {
      //   getSpiralsPaint({
      //     baseContext,
      //     canvas,
      //     width,
      //     height,
      //     screenRatio,
      //     resolution,
      //     isDescendants: true,
      //     parentNode: {...node, ...descendantValues},
      //   });
      // }
    });
  }
  canvas.update();
};
