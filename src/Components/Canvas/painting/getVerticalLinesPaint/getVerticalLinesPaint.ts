import {getBasePixelData} from '../../../../utils/getBasePixelData';
import {getNewGradientLinesNode, TLineNode} from '../getGradientLinesPaint/getNewGradientLinesNode';

interface IVerticalPaint {
  baseContext: CanvasRenderingContext2D;
  paintContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  families: number;
  density?: number;
}

export const getVerticalLinesPaint = ({baseContext, paintContext, width, height, families, density = 1}: IVerticalPaint) => {
  const lineWidth = height / (families / 5);
  const lineSegmentsSteps = (height / width) * 5;

  for (let x = 0; x < width; x += lineWidth) {
    // applies density to segment X
    if (density === 1 || Math.random() >= density) {
      let previousY = 0;
      for (
        let y = (Math.random() * height) / (lineSegmentsSteps * 2);
        y < height;
        y += (Math.random() * height) / (lineSegmentsSteps * 2)
      ) {
        // applies density to segment Y
        if (density === 1 || Math.random() >= density) {
          const initialColor = getBasePixelData(x + lineWidth / 2, previousY, baseContext);
          const endColor = getBasePixelData(x + lineWidth / 2, y, baseContext);
          const segmentColor = {
            r: (initialColor[0] + endColor[0]) / 2,
            g: (initialColor[1] + endColor[1]) / 2,
            b: (initialColor[2] + endColor[2]) / 2,
          };

          paintContext.beginPath();
          paintContext.moveTo(x + lineWidth / 2, previousY);
          paintContext.lineTo(x + lineWidth / 2, density === 1 ? height : y);
          paintContext.strokeStyle = `rgba(${segmentColor.r}, ${segmentColor.g}, ${segmentColor.b}, 1)`;
          paintContext.lineWidth = lineWidth;
          paintContext.lineCap = 'round';
          paintContext.stroke();
        }

        previousY = y;
      }
    }
  }
};
