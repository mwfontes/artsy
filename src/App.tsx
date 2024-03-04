import React, {useState, useRef} from 'react';
import {cx} from '@emotion/css';
import Canvas from './Components/Canvas/Canvas';
import Settings from './Components/Settings/Settings';
import SettingsContext, {appSettings, useAppSettings} from './Providers/AppSettings/AppSettings';

import './styles/global.styles';
import styles from './App.styles';

function App() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const baseImageRef = useRef<CanvasImageSource>();
  const baseCanvasRef = useRef<HTMLCanvasElement>();
  const baseContextRef = useRef<CanvasRenderingContext2D | null>(null);

  const {resolution, paintType, setResolution, setPaintType} = appSettings();

  const updateOrLoadImage = (imageUrl: string) => {
    if (!imageUrl) {
      return;
    }

    setIsImageLoaded(false);

    baseImageRef.current = new Image();
    baseImageRef.current.src = imageUrl;
    baseCanvasRef.current = document.createElement('canvas');
    baseCanvasRef.current.width = 2480;
    baseCanvasRef.current.height = 3508;
    baseContextRef.current = baseCanvasRef.current.getContext('2d', {
      alpha: false,
      desynchronized: true,
      willReadFrequently: false,
      colorSpace: 'srgb',
    });

    baseImageRef.current.onload = () => {
      baseContextRef.current!.drawImage(
        baseImageRef.current!,
        0,
        0,
        baseCanvasRef.current!.width,
        baseCanvasRef.current!.height
      );
      setIsImageLoaded(true);
    };
  };

  return (
    <SettingsContext.Provider value={{resolution, paintType, setResolution, setPaintType}}>
      <div className={cx(styles.component)}>
        <Settings onApply={updateOrLoadImage} />
        {isImageLoaded && (
          <Canvas
            width={baseCanvasRef.current!.width}
            height={baseCanvasRef.current!.height}
            baseContext={baseContextRef.current!}
          />
        )}
      </div>
    </SettingsContext.Provider>
  );
}

export default App;
