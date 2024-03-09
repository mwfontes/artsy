import Two from 'two.js';

import {getNewSpiralsNode, TSpiralNode} from './getNewSpiralsNode';
import {getBasePixelData} from '../../../../utils/getBasePixelData';
import {getIsOutOfBounds} from '../../../../utils/getIsOutOfBounds';
import {getIsFamilyOver} from '../../../../utils/getIsFamilyOver';
import {EResolution} from '../../../../Providers/AppSettings/AppSettings';

interface ISpiralPaint {
  baseContext: CanvasRenderingContext2D;
  canvasElement: HTMLDivElement;
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
  canvasElement,
  width,
  height,
  screenRatio,
  resolution,
  isDescendants,
  parentNode,
}: ISpiralPaint) => {
  if (!canvasElement) {
    return;
  }

  canvasElement.innerHTML = '';
  var paintCanvas = new Two({width, height, type: Two.Types.svg}).appendTo(canvasElement);

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
      // let currentPath = new Two.Path();
      // currentPath.linewidth = 2;
      // currentPath.noFill();
      // currentPath.automatic = false;

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
        paintCanvas.makeLine(descendantValues.x, descendantValues.y, newX, newY);
        /*
        paintCanvas.beginPath();
        paintCanvas.moveTo(descendantValues.x, descendantValues.y); // starting point
        paintCanvas.lineTo(newX, newY);
        paintCanvas.strokeStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        paintCanvas.lineWidth = lineWidth;
        paintCanvas.lineCap = 'round';
        paintCanvas.stroke();
        */

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
          canvasElement,
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
  paintCanvas.update();
};
