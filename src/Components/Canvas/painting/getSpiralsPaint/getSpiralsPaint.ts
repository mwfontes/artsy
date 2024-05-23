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

const getBaseColor = (node: TSpiralNode, baseContext: CanvasRenderingContext2D, step: number): TColor => {
  const {color} = node;
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
};

const getResolution = (resolution: EResolution) => {
  switch (resolution) {
    case EResolution.VERY_LOW:
      return 4;
    case EResolution.LOW:
      return 5;
    case EResolution.MEDIUM:
      return 6;
    case EResolution.HIGH:
      return 7;
    case EResolution.VERY_HIGH:
      return 8;
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

  const initialLineWidth = 500; // Half of full size;
  const stepSize = 8;
  const numberOfDescendants = 2;
  const numberOfPasses = getResolution(resolution);
  const shapeEveryStep = 1;

  for (let currentPass = 1; currentPass < numberOfPasses + 1; currentPass++) {
    const numberOfMainSpirals = numberOfPasses * currentPass;
    // creates nodes based on resolution.
    // 1 resultion point = 1 new node (spiral line)
    const nodes = [...new Array(isDescendants ? numberOfDescendants : numberOfMainSpirals)].map((_newItem) =>
      getNewSpiralsNode({baseContext, width, height, lineWidth: initialLineWidth, parentNode})
    );

    // for each node, draw the next lines
    nodes.forEach((node) => {
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
      const outOfBoundsVariationRate = Math.random() * 0.6 - 0.3;
      let initialSegmentCoordinates = {
        x,
        y,
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

        if (getIsOutOfBounds({x: newX, y: newY, width, height, variationRate: 0})) {
          return;
        }

        // draws the spiral from current node
        if (currentSpiralSize % (stepSize * 2) === 0 || currentSpiralSize === 0) {
          currentPathPoints = [];
          currentPathPoints.push(new Two.Anchor(descendantValues.x, descendantValues.y));
          initialSegmentCoordinates.x = descendantValues.x;
          initialSegmentCoordinates.y = descendantValues.y;
        } else {
          // draws circle or not
          if (Math.random() < 0.9) {
            currentPathPoints.push(new Two.Anchor(newX, newY));
            const bezierPath = new Two.Path(currentPathPoints, false, true, false);
            bezierPath.stroke = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b} )`;
            bezierPath.closed = false;
            // line gets thinner as passes increase
            bezierPath.linewidth = lineWidth / (currentPass * 2);
            bezierPath.cap = 'round';
            bezierPath.noFill();
            canvas.add(bezierPath);
            if (Math.random() < 0.0075) {
              const circle = canvas.makeCircle(
                (initialSegmentCoordinates.x + newX) / 2,
                (initialSegmentCoordinates.y + newY) / 2,
                initialLineWidth / 2 / currentPass
              );
              circle.noFill();
              circle.linewidth = lineWidth / (currentPass * 4);
              circle.stroke = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b} )`;
            }
          } else {
            const circle = canvas.makeCircle(
              (initialSegmentCoordinates.x + newX) / 2,
              (initialSegmentCoordinates.y + newY) / 2,
              stepSize * 2
            );
            circle.noFill();
            circle.linewidth = lineWidth / (currentPass * 4);
            circle.stroke = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b} )`;
          }
        }

        // Update last used values
        descendantValues.x = newX;
        descendantValues.y = newY;
        descendantValues.lineWidth = lineWidth / (currentPass * 2) / 2;
        descendantValues.spiralSize = spiralSize / currentPass;
        descendantValues.color = baseColor;

        currentSpiralSize += stepSize;
      } while (currentSpiralSize < spiralSize / (currentPass * 0.5));

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
