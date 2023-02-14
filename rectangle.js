var customSize = 0;

/**
 * Set the drawing tool to Square
 */
let setRectangle = () => {
  isLine = false;
  isSquare = false;
  isRectangle = true;
  isPolygon = false;
};

/**
 * Draw vertices
 * @param {*} x
 * @param {*} y
 * @param {*} rgb
 * @returns
 */

let drawRectangle = (x, y, size, rgb) => {
  vertices.push(x + size);
  vertices.push(y);
  vertices.push(0);
  vertices.push(0);
  vertices.push(1);

  vertices.push(x);
  vertices.push(y);
  vertices.push(0);
  vertices.push(0);
  vertices.push(1);

  vertices.push(x + size);
  vertices.push(y + size);
  vertices.push(0);
  vertices.push(0);
  vertices.push(1);

  vertices.push(x);
  vertices.push(y + size);
  vertices.push(0);
  vertices.push(0);
  vertices.push(1);

  vertices.push(rgb[0]);
  vertices.push(rgb[1]);
  vertices.push(rgb[2]);
  console.log('Rectangle:', vertices);
  draw(4, vertices, gl.TRIANGLE_STRIP);
  return vertices;
};

let translateRectangle = () => {};

let dilateRectangle = () => {};

let rotateRectangle = () => {};

let shearRectangle = () => {};

let changeSizeRectangle = () => {};
