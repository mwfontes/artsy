import {getXRotationFunction, TRotationFunction} from '../getSpiralsPaint/getXRotationFunction';
import {getBasePixelData} from '../../../../utils/getBasePixelData';
import {TVertex} from '../../../../Types';

interface ITriangleVertex {
  x: number;
  y: number;
};

export const getNewTriangleVertex = ({x, y}: ITriangleVertex): TVertex => ({
  x,
  y,
  connectedVertices: [],
});
