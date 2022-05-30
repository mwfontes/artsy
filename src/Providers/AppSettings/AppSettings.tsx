import {createContext, useEffect, useState, useContext} from 'react';

export enum EPaintType {
  SPIRALS = 'Spirals',
  GRADIENT_LINES = 'Gradient lines',
  HORIZONTAL_LINES = 'Horizontal lines',
  VERTICAL_LINES = 'Vertical lines',
  SLASH_LINES = 'Slash lines',
  TRIANGLES = 'Triangles',
  HYBRID_HORIZONTAL_VERTICAL_LINES = 'Horizontal + Vertical lines',
  HYBRID_SPIRALS_GRADIENT_LINES = 'Spirals & Gradient lines',
}

export type IAppSettings = {
  families: number;
  paintType: EPaintType;
  setFamilies(families: number): void;
  setPaintType(paintType: EPaintType): void;
};

const SettingsContext = createContext<IAppSettings>({
  families: 1,
  paintType: EPaintType.SLASH_LINES,
  setFamilies: () => {},
  setPaintType: () => {},
});

export const appSettings = (from?: string): IAppSettings => {
  const [families, setFamilies] = useState<number>(1);
  const [paintType, setPaintType] = useState<EPaintType>(EPaintType.SLASH_LINES);

  return {
    families,
    paintType,
    setFamilies,
    setPaintType,
  };
};

export const useAppSettings = (): IAppSettings => useContext(SettingsContext);

export default SettingsContext;
