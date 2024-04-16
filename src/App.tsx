import React, {useState, useRef} from 'react';
import {cx} from '@emotion/css';
import Canvas from './Components/Canvas/Canvas';
import Settings from './Components/Settings/Settings';
import SettingsContext, {appSettings} from './Providers/AppSettings/AppSettings';

import './styles/global.styles';
import styles from './App.styles';

function App() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const loadedImageRef = useRef<HTMLImageElement>();
  const baseCanvasRef = useRef<HTMLCanvasElement>();
  const baseContextRef = useRef<CanvasRenderingContext2D | null>(null);

  const {resolution, paintType, setResolution, setPaintType} = appSettings();

  const updateOrLoadImage = (imageUrl: string) => {
    if (!imageUrl) {
      return;
    }

    setIsImageLoaded(false);

    loadedImageRef.current = new Image();
    baseCanvasRef.current = document.createElement('canvas');
    baseContextRef.current = baseCanvasRef.current.getContext('2d', {
      alpha: false,
      desynchronized: true,
      willReadFrequently: false,
      colorSpace: 'srgb',
    });

    loadedImageRef.current.onload = () => {
      const maxRenderDimension = 1000;
      const sWidth = loadedImageRef.current!.width;
      const sHeight = loadedImageRef.current!.height;
      const sourceImageRatio = sWidth / sHeight;
      const dWidth = sWidth > sHeight ? maxRenderDimension : maxRenderDimension / sourceImageRatio;
      const dHeight = sHeight > sWidth ? maxRenderDimension : maxRenderDimension / sourceImageRatio;

      baseCanvasRef.current!.width = dWidth;
      baseCanvasRef.current!.height = dHeight;
      baseContextRef.current!.drawImage(loadedImageRef.current!, 0, 0, dWidth, dHeight);
      setIsImageLoaded(true);
    };

    // loads image
    loadedImageRef.current.src = imageUrl;
  };

  return (
    <SettingsContext.Provider value={{resolution, paintType, setResolution, setPaintType}}>
      <div
        className={cx(
          styles.component(baseCanvasRef.current ? baseCanvasRef.current!.width > baseCanvasRef.current!.height : false)
        )}
      >
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
