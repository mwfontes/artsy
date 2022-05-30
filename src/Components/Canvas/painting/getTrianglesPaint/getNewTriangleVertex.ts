import {getXRotationFunction, TRotationFunction} from '../getSpiralsPaint/getXRotationFunction';
import {getBasePixelData} from '../../../../utils/getBasePixelData';

interface ITriangleVertex {
  x: number;
  y: number;
};

export type TTriangleVertex = {
  x: number;
  y: number;
  connectedVertices: ITriangleVertex[];
};

export const getNewTriangleVertex = ({x, y}: ITriangleVertex): TTriangleVertex => ({
  x,
  y,
  connectedVertices: [],
});
