/**
 * Set the drawing tool to Rectangle
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

let drawRectangle = (x, y, rectWidth, rectHeight, rgb) => {
  vertices.push(x + rectWidth);
  vertices.push(y);
  vertices.push(0);
  vertices.push(0);
  vertices.push(1);

  vertices.push(x);
  vertices.push(y);
  vertices.push(0);
  vertices.push(0);
  vertices.push(1);

  vertices.push(x + rectWidth);
  vertices.push(y + rectHeight);
  vertices.push(0);
  vertices.push(0);
  vertices.push(1);

  vertices.push(x);
  vertices.push(y + rectHeight);
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
