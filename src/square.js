/**
 * Set the drawing tool to Square
 */
let setSquare = () => {
  isLine = false;
  isSquare = true;
  isRectangle = false;
  isPolygon = false;
};

/* =============== MAIN FUNCTIONS =============== */

/**
 * Draw vertices, <X, Y, R, G, B>
 * @param {float} x Starting X coordinate
 * @param {float} y Staring Y coordinate
 * @param {array of int} rgb
 * @returns vertices of the square
 */
let drawSquare = (x, y, size, rgb, aspect) => {
  vertices.push(x + size);
  vertices.push(y);
  vertices.push(rgb[0]);
  vertices.push(rgb[1]);
  vertices.push(rgb[2]);

  vertices.push(x);
  vertices.push(y);
  vertices.push(rgb[0]);
  vertices.push(rgb[1]);
  vertices.push(rgb[2]);

  vertices.push(x + size);
  vertices.push(y + size);
  vertices.push(rgb[0]);
  vertices.push(rgb[1]);
  vertices.push(rgb[2]);

  vertices.push(x);
  vertices.push(y + size);
  vertices.push(rgb[0]);
  vertices.push(rgb[1]);
  vertices.push(rgb[2]);

  let verticesRender = prepareToRenderSquare(vertices, aspect);
  renderSquare(verticesRender);

  return vertices;
};

let prepareToRenderSquare = (vertices, aspect) => {
  let verticeToRender = vertices.slice();
  for (let i = 1; i < vertices.length; i += 5) {
    verticeToRender[i] *= aspect;
  }
  return verticeToRender;
};

let renderSquare = (vertices) => {
  // Draw the points
  for (let i = 0; i < vertices.length; i += 5) {
    draw(
      1,
      [
        vertices[i],
        vertices[i + 1],
        vertices[i + 2],
        vertices[i + 3],
        vertices[i + 4],
      ],
      gl.POINTS
    );
  }

  draw(4, vertices, gl.TRIANGLE_STRIP);
};

/**
 * Translate the selected square
 * @param {*} canvas
 * @param {*} event
 * @param {*} selectedObject position of object within object array
 * @param {*} currX current X coordinate
 * @param {*} currY current Y coordinate
 * @returns [targetX, targetY] new target coordinates
 */
let translateSquare = (canvas, event, selectedObject, currX, currY) => {
  // Get new target coordinates
  var targetX = getXCoordinate(canvas, event);
  var targetY = getYCoordinate(canvas, event);

  // Calculate translation
  for (var i = 0; i < arrObjects[selectedObject].vertices.length; i += 5) {
    arrObjects[selectedObject].vertices[i] += targetX - currX;
    arrObjects[selectedObject].vertices[i + 1] += targetY - currY;
  }
  drawAll();

  // Return the new target coordinates (so the square is still within the canvas)
  return [targetX, targetY];
};

/**
 * Rotate the selected square
 * @param {*} canvas
 * @param {*} event
 * @param {*} selectedObject  position of object within object array
 * @param {*} currX current X coordinate
 * @param {*} currY current Y coordinate
 * @returns [targetX, targetY] new target coordinates
 */
// TODO: Make the dimentions stay intact when rotated
let rotateSquare = (canvas, event, selectedObject, currX, currY) => {
  // Get the square coordinates
  var squareCoords = getSquareProperties(selectedObject);
  var centerX = squareCoords.centerX;
  var centerY = squareCoords.centerY;

  // Get new target coordinates
  var targetX = getXCoordinate(canvas, event);
  var targetY = getYCoordinate(canvas, event);

  // Calculate the rotation angle
  const angle =
    Math.atan2(targetY - centerY, targetX - centerX) -
    Math.atan2(currY - centerY, currX - centerX);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  console.log('angle', angle, 'cos', cos, 'sin', sin);
  console.log('center', centerX, centerY);
  console.log('------');
  // Update the rotation to the square
  for (let i = 0; i < arrObjects[selectedObject].vertices.length; i += 5) {
    const x = arrObjects[selectedObject].vertices[i] - centerX;
    const y = arrObjects[selectedObject].vertices[i + 1] - centerY;

    arrObjects[selectedObject].vertices[i] = x * cos - y * sin + centerX;
    arrObjects[selectedObject].vertices[i + 1] = x * sin + y * cos + centerY;
  }
  drawAll();

  // Return the new target coordinates
  return [targetX, targetY];
};

/**
 * Dilate the selected square
 * @param {*} canvas
 * @param {*} event
 * @param {*} selectedObject position of object within object array
 * @param {*} currX current X coordinate
 * @param {*} currY current Y coordinate
 * @returns [targetX, targetY] new target coordinates
 */
let dilateSquare = (canvas, event, selectedObject, currX, currY) => {
  // Get the square coordinates
  var squareCoords = getSquareProperties(selectedObject);
  var centerX = squareCoords.centerX;
  var centerY = squareCoords.centerY;

  // Get the target coordinates
  var targetX = getXCoordinate(canvas, event);
  var targetY = getYCoordinate(canvas, event);

  // Calculate the scale factor
  const scale =
    Math.sqrt((targetX - centerX) ** 2 + (targetY - centerY) ** 2) /
    Math.sqrt((currX - centerX) ** 2 + (currY - centerY) ** 2);

  // Calculate the dilatation
  for (var i = 0; i < arrObjects[selectedObject].vertices.length; i += 5) {
    const x = arrObjects[selectedObject].vertices[i] - centerX;
    const y = arrObjects[selectedObject].vertices[i + 1] - centerY;

    arrObjects[selectedObject].vertices[i] = centerX + scale * x;
    arrObjects[selectedObject].vertices[i + 1] = centerY + scale * y;
  }
  drawAll();

  // Return the target cooridnate
  return [targetX, targetY];
};

/**
 * Shear horizontally or vertically for the square
 * @param {*} canvas
 * @param {*} event
 * @param {*} selectedObject position of object within object array
 * @param {*} currX current X coordinate
 * @param {*} currY current Y coordinate
 * @param {*} isHorizontalShear true horizontal, false vertical shear
 * @returns [targetX, targetY] new target coordinates
 */
let shearSquare = (
  canvas,
  event,
  selectedObject,
  currX,
  currY,
  isHorizontalShear
) => {
  // Get the square coordinates
  var squareCoords = getSquareProperties(selectedObject);
  var centerX = squareCoords.centerX;
  var centerY = squareCoords.centerY;
  var minX = squareCoords.minX;
  var maxX = squareCoords.maxX;
  var minY = squareCoords.minY;
  var maxY = squareCoords.maxY;

  // Get the target coordinates
  var targetX = getXCoordinate(canvas, event);
  var targetY = getYCoordinate(canvas, event);

  // Calculate the shear factor
  const shearX =
    (targetX - centerX - (currX - centerX)) / Math.abs(maxY - minY);
  const shearY =
    (targetY - centerY - (currY - centerY)) / Math.abs(maxX - minX);

  // Calculate the dilatation
  for (var i = 0; i < arrObjects[selectedObject].vertices.length; i += 5) {
    const x = arrObjects[selectedObject].vertices[i];
    const y = arrObjects[selectedObject].vertices[i + 1];

    if (isHorizontalShear) {
      const xMod = x - centerX;
      const yMod = y - maxY;

      var xCalc = centerX + xMod + shearX * yMod;
      var yCalc = maxY + yMod;
    } else {
      const xMod = x - maxX;
      const yMod = y - centerY;

      var xCalc = maxX + xMod;
      var yCalc = centerY + yMod + shearY * x;
    }

    arrObjects[selectedObject].vertices[i] = xCalc;
    arrObjects[selectedObject].vertices[i + 1] = yCalc;
  }
  drawAll();

  // Return the target cooridnate
  return [targetX, targetY];
};

/* =============== UTILITY FUNCTIONS ===============

/**
 * Check if a point exist within any defined square area
 * @param {float} x Any random X coordinate
 * @param {float} y Any random Y coordinate
 */
let isSquareExists = (x, y) => {
  // Search from arrObjects
  for (var i = 0; i < arrObjects.length; i++) {
    if (arrObjects[i].type == 'square') {
      // Get maxmimum and minimum value
      var squareCoords = getSquareProperties(i);
      var minX = squareCoords.minX;
      var maxX = squareCoords.maxX;
      var minY = squareCoords.minY;
      var maxY = squareCoords.maxY;

      // Check the point
      if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        return i;
      }
    }
  }
  return -1;
};

/**
 * Get square properties
 * @param {int} selectedObject selected object indicator from array of objects
 * @return Object with square properties (min X, max X, min Y, , max Y, center X, center Y)
 */
let getSquareProperties = (selectedObject) => {
  // Get all of the coordinates
  var x0 = arrObjects[selectedObject].vertices[0];
  var y0 = arrObjects[selectedObject].vertices[1];

  var x1 = arrObjects[selectedObject].vertices[5];
  var y1 = arrObjects[selectedObject].vertices[6];

  var x2 = arrObjects[selectedObject].vertices[10];
  var y2 = arrObjects[selectedObject].vertices[11];

  var x3 = arrObjects[selectedObject].vertices[15];
  var y3 = arrObjects[selectedObject].vertices[16];

  // Get the minimum and maximum value of each axis
  var minX = Math.min(x0, x1, x2, x3);
  var maxX = Math.max(x0, x1, x2, x3);
  var minY = Math.min(y0, y1, y2, y3);
  var maxY = Math.max(y0, y1, y2, y3);

  // Get the center point
  var centerX = (x0 + x1 + x2 + x3) / 4;
  var centerY = (y0 + y1 + y2 + y3) / 4;

  // Get the diagonals
  var diagonal = Math.sqrt(Math.pow(maxX - minX, 2) + Math.pow(maxY - minY, 2));

  // Get the size
  var size = Math.sqrt(2) * diagonal;

  return {
    minX: minX,
    maxX: maxX,
    minY: minY,
    maxY: maxY,
    centerX: centerX,
    centerY: centerY,
    diagonal: diagonal,
    size: size,
  };
};
