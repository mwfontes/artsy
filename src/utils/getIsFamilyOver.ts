import {TLineNode} from '../Components/Canvas/painting/getLinePaint/getNewLineNode';
import {TSpiralNode} from '../Components/Canvas/painting/getSpiralPaint/getNewSpiralNode';

interface IGetIsFamilyOver {
  node: TSpiralNode;
}

export const getIsFamilyOver = ({node}: IGetIsFamilyOver): boolean => {
  // Family grow is over
  if (node.descendant >= 4) {
    return true;
  }
  // is it too thin already?
  if (node.lineWidth <= 2) {
    return true;
  }

  // Should live
  return false;
};
