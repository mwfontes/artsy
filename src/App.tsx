import React, { useState } from "react";
import Canvas from "./Components/Canvas/Canvas";

import baseImage from "./images/image.jpg";

import "./App.css";

function App() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const img = new Image();
  img.src = baseImage;
  const baseCanvas = document.createElement("canvas");
  baseCanvas.width = 2480;
  baseCanvas.height = 3508;
  const baseContext = baseCanvas.getContext("2d");

  img.onload = () => {
    baseContext!.drawImage(img, 0, 0, 2480, 3508);
    setIsImageLoaded(true);
  };

  if (!isImageLoaded) {
    return null;
  }

  return (
    <div className='App'>
      <Canvas width={2480} height={3508} baseContext={baseContext!} families={100} />
    </div>
  );
}

export default App;
