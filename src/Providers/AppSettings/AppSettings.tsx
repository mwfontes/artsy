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

export enum EResolution {
  VERY_LOW = 'Very low',
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = ' High',
  VERY_HIGH = 'Very high',
}

export type IAppSettings = {
  resolution: EResolution;
  setResolution(resolution: EResolution): void;
  paintType: EPaintType;
  setPaintType(paintType: EPaintType): void;
};

const SettingsContext = createContext<IAppSettings>({
  resolution: EResolution.MEDIUM,
  paintType: EPaintType.SLASH_LINES,
  setResolution: () => {},
  setPaintType: () => {},
});

export const appSettings = (from?: string): IAppSettings => {
  const [resolution, setResolution] = useState<EResolution>(EResolution.MEDIUM);
  const [paintType, setPaintType] = useState<EPaintType>(EPaintType.SLASH_LINES);

  return {
    resolution,
    paintType,
    setResolution,
    setPaintType,
  };
};

export const useAppSettings = (): IAppSettings => useContext(SettingsContext);

export default SettingsContext;
