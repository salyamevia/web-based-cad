/**
 * Set the drawing tool to Square
 */
let setSquare = () => {
  isLine = false;
  isSquare = true;
  isRectangle = false;
  isPolygon = false;
};

/* =============== MAIN FUNCTIONS ===============

/**
 * Draw vertices, <X, Y, R, G, B>
 * @param {float} x Starting X coordinate
 * @param {float} y Staring Y coordinate
 * @param {array of int} rgb
 * @returns vertices of the square
 */
let drawSquare = (x, y, size, rgb) => {
  vertices.push(x + size * 0.65);
  vertices.push(y);
  vertices.push(rgb[0]);
  vertices.push(rgb[1]);
  vertices.push(rgb[2]);

  vertices.push(x);
  vertices.push(y);
  vertices.push(rgb[0]);
  vertices.push(rgb[1]);
  vertices.push(rgb[2]);

  vertices.push(x + size * 0.65);
  vertices.push(y + size);
  vertices.push(rgb[0]);
  vertices.push(rgb[1]);
  vertices.push(rgb[2]);

  vertices.push(x);
  vertices.push(y + size);
  vertices.push(rgb[0]);
  vertices.push(rgb[1]);
  vertices.push(rgb[2]);

  console.log('Square:', vertices);

  // Draw the points
  draw(1, [x + size * 0.65, y, rgb[0], rgb[1], rgb[2]], gl.POINTS);
  draw(1, [x + size * 0.65, y + size, rgb[0], rgb[1], rgb[2]], gl.POINTS);
  draw(1, [x, y + size, rgb[0], rgb[1], rgb[2]], gl.POINTS);
  draw(4, vertices, gl.TRIANGLE_STRIP);
  return vertices;
};

let translateSquare = () => {};

let dilateSquare = () => {};

let rotateSquare = () => {};

let shearSquare = () => {};

let changeSizeSquare = () => {};

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
      // Get all of the coordinates
      var x0 = arrObjects[i].vertices[0];
      var y0 = arrObjects[i].vertices[1];

      var x1 = arrObjects[i].vertices[5];
      var y1 = arrObjects[i].vertices[6];

      var x2 = arrObjects[i].vertices[10];
      var y2 = arrObjects[i].vertices[11];

      var x3 = arrObjects[i].vertices[15];
      var y3 = arrObjects[i].vertices[16];

      // Get the minimum and maximum value of each axis
      var minX = Math.min(x0, x1, x2, x3);
      var maxX = Math.max(x0, x1, x2, x3);
      var minY = Math.min(y0, y1, y2, y3);
      var maxY = Math.max(y0, y1, y2, y3);

      // Check the point
      if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        return i;
      }
    }
  }
  return -1;
};
