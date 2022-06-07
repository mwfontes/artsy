import {getBasePixelData} from '../../../../utils/getBasePixelData';
import {getNewTriangleVertex} from './getNewTriangleVertex';
import {getDistanceBetweenTwoVertices} from '../../../../utils/getDistanceBetweenTwoVertices';
import {TVertex} from '../../../../Types';
import {getClosestVertex} from '../../../../utils/getClosestVertex';
import {getLinesColliding} from '../../../../utils/getLinesColliding';

interface ITrianglePaint {
  baseContext: CanvasRenderingContext2D;
  paintContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  families: number;
  density?: number;
}

export const getTrianglesPaint = ({
  baseContext,
  paintContext,
  width,
  height,
  families,
  density = 1,
}: ITrianglePaint) => {
  const vertices: TVertex[] = [];
  const stepRatio = Math.round(width / height);
  const baseDensity = Math.round(families / 10);
  const centerPoint = {
    x: Math.round(width / 2),
    y: Math.round(height / 2),
  };

  // Build border horizontal vertices
  const xStepSize = Math.round(width / baseDensity);
  for (let i = 0; i <= width + xStepSize; i += xStepSize) {
    // Top
    vertices.push(getNewTriangleVertex({x: i, y: 0}));
    // Bottom
    vertices.push(getNewTriangleVertex({x: i, y: height}));
  }

  // Build border vertical vertices
  const yStepSize = height / (baseDensity * stepRatio);
  for (let i = yStepSize; i <= height; i += yStepSize) {
    // Left
    vertices.push(getNewTriangleVertex({x: 0, y: i}));
    // Right
    vertices.push(getNewTriangleVertex({x: width, y: i}));
  }

  // Build center random vertices
  for (let i = 0; i < baseDensity * 4; i++) {
    vertices.push(
      getNewTriangleVertex({
        x: Math.random() * (width - xStepSize * 2) + xStepSize,
        y: Math.random() * (height - yStepSize * 2) + yStepSize,
      })
    );
  }

  // Paint vertices
  vertices.forEach((vertex) => {
    paintContext.beginPath();
    paintContext.arc(vertex.x, vertex.y, 10, 0, 2 * Math.PI);
    paintContext.fillStyle = 'red';
    paintContext.fill();
  });

  // builds initial connections (all * all)
  vertices.forEach((vertex) => {
    vertices.forEach((connectionProspectVertex) => {
      if (vertex !== connectionProspectVertex && !connectionProspectVertex.connectedVertices.includes(vertex)) {
        vertex.connectedVertices.push(connectionProspectVertex);
      }
    });
  });

  let x = 1;
  console.clear();
  for (let i = 0; i < vertices.length / 2; i++) {
    for (let j = vertices.length - 1; j > vertices.length / 2; j--) {
      if (vertices[i] !== vertices[j]) {
        //     const updatedDisputingConnectedVertices: TVertex[] = [];
        for (let k = 0; k < vertices[i].connectedVertices.length; k++) {
          for (let l = 0; l < vertices[j].connectedVertices.length; l++) {
            console.log(x++);
            //         if (!getLinesColliding(vertices[i], vertices[i].connectedVertices[k], vertices[j], vertices[j].connectedVertices[l])) {
            //           console.log('not colliding');
            //           updatedDisputingConnectedVertices.push(vertices[j].connectedVertices[l]);
            //         }
          }
        }
        //     vertices[j].connectedVertices = updatedDisputingConnectedVertices;
      }
    }
  }

  // Paints connections
  vertices.forEach((vertex) => {
    vertices.forEach((connectionProspectVertex) => {
      // Paints connection
      paintContext.beginPath();
      paintContext.moveTo(vertex.x, vertex.y);
      paintContext.lineTo(connectionProspectVertex.x, connectionProspectVertex.y);
      paintContext.lineWidth = 4;
      paintContext.strokeStyle = '#dddddd22';
      paintContext.stroke();
    });
  });
};
