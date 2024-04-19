import {createContext, useEffect, useState, useContext} from 'react';

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
};

const SettingsContext = createContext<IAppSettings>({
  resolution: EResolution.MEDIUM,
  setResolution: () => {},
});

export const appSettings = (from?: string): IAppSettings => {
  const [resolution, setResolution] = useState<EResolution>(EResolution.MEDIUM);

  return {
    resolution,
    setResolution,
  };
};

export const useAppSettings = (): IAppSettings => useContext(SettingsContext);

export default SettingsContext;
