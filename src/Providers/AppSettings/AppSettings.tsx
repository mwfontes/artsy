import { createContext, ReactElement, ReactNode, useContext, useState } from "react";

export enum EPaintType {
  SPIRAL = "spiral",
  LINE = "line",
  HYBRID = "hybrid",
}

type TSettings = {
  // Get
  imageUrl: string;
  families: number;
  type: EPaintType;

  // Set
  setType: (type: EPaintType) => void;
};

interface ISettings {
  children: ReactNode;
}

interface ISettingsContext extends TSettings {
  Provider: ReactElement;
}

const initialSettings: TSettings = {
  imageUrl: "",
  families: 1,
  type: EPaintType.SPIRAL,

  setType: () => {},
};

export const SettingsContext = createContext<TSettings>(initialSettings);

export const useAppSettings = (): TSettings => useContext(SettingsContext);

export function AppSettings({ children }: ISettings): ISettingsContext {
  const [type, setType] = useState<EPaintType>(initialSettings.type);

  const provider = (
    <SettingsContext.Provider
      value={{ ...initialSettings, type, setType }}
    >
      {children}
    </SettingsContext.Provider>
  );

  return {
    Provider: provider,
    type,
    setType,
    families: initialSettings.families,
    imageUrl: initialSettings.imageUrl,
  };
}
