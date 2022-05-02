import React, { useState, useRef } from "react";
import { cx } from "@emotion/css";
import Canvas from "./Components/Canvas/Canvas";
import Settings from "./Components/Settings/Settings";

import baseImage from "./images/julia+billy.jpg";

import "./styles/global.styles";
import styles from "./App.styles";

function App() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const baseImageRef = useRef<CanvasImageSource>();
  const baseCanvasRef = useRef<HTMLCanvasElement>();
  const baseContextRef = useRef<CanvasRenderingContext2D | null>(null);

  const updateOrLoadImage = (imageUrl: string) => {
    setIsImageLoaded(false);
    baseImageRef.current = new Image();
    baseImageRef.current.src = baseImage;
    baseCanvasRef.current = document.createElement("canvas");
    baseCanvasRef.current.width = 2480;
    baseCanvasRef.current.height = 3508;
    baseContextRef.current = baseCanvasRef.current.getContext("2d");

    baseImageRef.current.onload = () => {
      console.log("baseImageRef.current.onload");
      baseContextRef.current!.drawImage(baseImageRef.current!, 0, 0, 2480, 3508);
      setIsImageLoaded(true);
    };
  };

  return (
    <div className={cx(styles.component)}>
      <Settings onApply={updateOrLoadImage} />
      {isImageLoaded && (
        <Canvas width={2480} height={3508} baseContext={baseContextRef.current!} families={200} type='hybrid' />
      )}
    </div>
  );
}

export default App;
