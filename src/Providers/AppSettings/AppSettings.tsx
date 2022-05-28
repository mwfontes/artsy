import {createContext, useEffect, useState, useContext} from 'react';

export enum EPaintType {
  SPIRAL = 'spiral',
  LINE = 'line',
  HORIZONTAL = 'horizontal lines',
  VERTICAL = 'vertical lines',
  SLASH = 'slash lines',
  HYBRID_HORIZONTAL_VERTICAL = 'horizontal + vertical lines',
  HYBRID_SPIRAL_LINE = 'spiral + line',
}

export type IAppSettings = {
  families: number;
  paintType: EPaintType;
  setFamilies(families: number): void;
  setPaintType(paintType: EPaintType): void;
};

const SettingsContext = createContext<IAppSettings>({
  families: 1,
  paintType: EPaintType.SLASH,
  setFamilies: () => {},
  setPaintType: () => {},
});

export const appSettings = (from?: string): IAppSettings => {
  const [families, setFamilies] = useState<number>(1);
  const [paintType, setPaintType] = useState<EPaintType>(EPaintType.SLASH);

  return {
    families,
    paintType,
    setFamilies,
    setPaintType,
  };
};

export const useAppSettings = (): IAppSettings => useContext(SettingsContext);

export default SettingsContext;
