import React, {useState, useRef} from 'react';
import {cx} from '@emotion/css';
import Canvas from './Components/Canvas/Canvas';
import Settings from './Components/Settings/Settings';
import SettingsContext, {appSettings, useAppSettings} from './Providers/AppSettings/AppSettings';

import './styles/global.styles';
import styles from './App.styles';

function App() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const baseImageRef = useRef<HTMLImageElement>();
  const baseCanvasRef = useRef<HTMLCanvasElement>();
  const baseContextRef = useRef<CanvasRenderingContext2D | null>(null);

  const {resolution, paintType, setResolution, setPaintType} = appSettings();

  const renderSizes = {
    a4: {width: 2480, height: 3508},
  };

  const updateOrLoadImage = (imageUrl: string) => {
    if (!imageUrl) {
      return;
    }

    setIsImageLoaded(false);

    baseImageRef.current = new Image();
    baseCanvasRef.current = document.createElement('canvas');
    baseCanvasRef.current.width = renderSizes.a4.width;
    baseCanvasRef.current.height = renderSizes.a4.height;
    baseContextRef.current = baseCanvasRef.current.getContext('2d', {
      alpha: false,
      desynchronized: true,
      willReadFrequently: false,
      colorSpace: 'srgb',
    });

    baseImageRef.current.onload = () => {
      const sWidth = baseImageRef.current!.width;
      const sHeight = baseImageRef.current!.height;
      const dWidth = renderSizes.a4.width;
      const dHeight = renderSizes.a4.height;
      const sourceImageRatio = sWidth / sHeight;
      const renderImageRatio = renderSizes.a4.width / renderSizes.a4.height;
      const ratioDifference = sourceImageRatio / renderImageRatio;
      const isRenderImageLandscape = dWidth > dHeight;
      console.log(
        'source - render - ratio',
        sourceImageRatio,
        renderImageRatio,
        ratioDifference,
        isRenderImageLandscape
      );
      baseContextRef.current!.drawImage(
        baseImageRef.current!,
        0,
        0,
        sWidth,
        sHeight,
        isRenderImageLandscape ? 0 : dWidth / 2 - (dHeight / 2) * ratioDifference,
        isRenderImageLandscape ? dHeight / ratioDifference : 0,
        isRenderImageLandscape ? 0 : dWidth / 2 + (dHeight / 2) * ratioDifference,
        isRenderImageLandscape ? dHeight / ratioDifference : dHeight
      );
      setIsImageLoaded(true);
    };

    // loads image
    baseImageRef.current.src = imageUrl;
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
