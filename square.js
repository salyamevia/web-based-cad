/**
 * Set the drawing tool to Square
 */
let setSquare = () => {
  isLine = false;
  isSquare = true;
  isRectangle = false;
  isPolygon = false;
};

/**
 * Draw vertices
 * @param {*} x
 * @param {*} y
 * @param {*} rgb
 * @returns
 */

let drawSquare = (x, y, size, rgb) => {
  vertices.push(x + size * 0.65);
  vertices.push(y);
  vertices.push(0);
  vertices.push(0);
  vertices.push(1);

  vertices.push(x);
  vertices.push(y);
  vertices.push(0);
  vertices.push(0);
  vertices.push(1);

  vertices.push(x + size * 0.65);
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
  console.log('Square:', vertices);
  draw(4, vertices, gl.TRIANGLE_STRIP);
  return vertices;
};

let translateSquare = () => {};

let dilateSquare = () => {};

let rotateSquare = () => {};

let shearSquare = () => {};

let changeSizeSquare = () => {};
