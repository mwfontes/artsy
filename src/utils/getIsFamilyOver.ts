import {TLineNode} from '../Components/Canvas/painting/getGradientLinesPaint/getNewGradientLinesNode';
import {TSpiralNode} from '../Components/Canvas/painting/getSpiralsPaint/getNewSpiralsNode';

interface IGetIsFamilyOver {
  node: TSpiralNode;
}

export const getIsFamilyOver = ({node}: IGetIsFamilyOver): boolean => {
  // is it too thin already?
  if (node.lineWidth <= 2) {
    return true;
  }

  // Should live
  return false;
};
