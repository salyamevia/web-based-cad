var canvas = document.getElementById('canvas');
var gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });

var isLine = false;
var isSquare = false;
var isRectangle = false;
var isPolygon = false;
var countVertices = 0;
var isDrag = false;
var mode = 'create';

var x = 0;
var y = 0;
var width = document.getElementById('canvas').width;
var height = document.getElementById('canvas').height;

var selectedObject;
var idxPoint;

var vertices = [];
var rgb = [0.0, 0.0, 0.0];
var arrObjects = [];

/* =============== UTILITY FUNCTIONS =============== */

/**
 * Sets the current drawing mode
 * @param {string} strMode Sets the mode into create, delete, move, translation, dilatation, rotation, or change color
 */
function setMode(strMode) {
  mode = strMode;
  console.log(mode);
}

/**
 * Get the X coordinate from current cursor position
 * @param {*} canvas
 * @param {*} event
 * @returns Current X coordinate in float
 */
var getXCoordinate = function (canvas, event) {
  var rect = canvas.getBoundingClientRect();
  return ((event.clientX - rect.left) / width) * 2 - 1;
};

/**
 * Get the Y coordinate from current cursor position
 * @param {*} canvas
 * @param {*} event
 * @returns Current Y coordinate in float
 */
var getYCoordinate = function (canvas, event) {
  var rect = canvas.getBoundingClientRect();
  return ((rect.bottom - event.clientY) / height) * 2 - 1;
};

/**
 * Checks if a point in (x,y) exists in the objects array (already exists within the canvas as a point)
 * @returns point position in objects array or -1 if doesn't exist
 */
var isExistPoint = function (x, y) {
  for (var i = 0; i < arrObjects.length; i++) {
    for (var j = 0; j < arrObjects[i].vertices.length; j += 5) {
      var distX = Math.abs(arrObjects[i].vertices[j] - x);
      var distY = Math.abs(arrObjects[i].vertices[j + 1] - y);
      if (distX < 0.01 && distY < 0.01) {
        return [i, j];
      }
    }
  }
  return -1;
};

/* =============== FUNCTIONALITY FUNCTIONS =============== */

//draw polygon on canvas using gl shader program
var draw = function (n, vertices, method) {
  var vertexShaderCode = `precision mediump float;

    attribute vec2 vertPosition;
    attribute vec3 vertColor;
    varying vec3 fragColor;

    void main() {
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
        gl_PointSize = 10.0;
    }`;
  var fragmentShaderCode = `precision mediump float;

    varying vec3 fragColor;

    void main() {
        gl_FragColor = vec4(fragColor, 1.0);
    }`;

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderCode);
  gl.compileShader(vertexShader);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderCode);
  gl.compileShader(fragmentShader);

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.validateProgram(program);
  // gl.useProgram(program)

  var vertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  gl.enableVertexAttribArray(positionAttribLocation);
  gl.vertexAttribPointer(
    positionAttribLocation,
    2,
    gl.FLOAT,
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT,
    0
  );
  var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
  gl.enableVertexAttribArray(colorAttribLocation);
  gl.vertexAttribPointer(
    colorAttribLocation,
    3,
    gl.FLOAT,
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT
  );

  // Main render loop
  gl.useProgram(program);
  gl.drawArrays(method, 0, n);
};

var drawAll = function () {
  //clear canvas
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  for (var i = 0; i < arrObjects.length; i++) {
    if (arrObjects[i].type == 'line') {
      draw(
        arrObjects[i].vertices.length / 5,
        arrObjects[i].vertices,
        gl.POINTS
      );
      draw(arrObjects[i].vertices.length / 5, arrObjects[i].vertices, gl.LINES);
    }
    if (arrObjects[i].type == 'polygon') {
      draw(
        arrObjects[i].vertices.length / 5,
        arrObjects[i].vertices,
        gl.POINTS
      );
      draw(
        arrObjects[i].vertices.length / 5,
        arrObjects[i].vertices,
        gl.TRIANGLE_FAN
      );
    }
  }

  window.requestAnimationFrame(function () {
    drawAll();
  });
};

window.requestAnimationFrame = function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
};

canvas.addEventListener('mouseup', function mouseUp() {
  isDrag = false;
  // canvas.removeEventListener("mousemove", moveLine)
  // canvas.removeEventListener("mouseup", mouseUp)
});

canvas.addEventListener('mousemove', function (event) {
  if (isLine) {
    if (mode == 'move') {
      if (selectedObject != -1 && isDrag) {
        moveLine(canvas, event, selectedObject, idxPoint);
      }
    }
    if (mode == 'translation') {
      if (selectedObject != -1 && isDrag) {
        var temp = translateLine(canvas, event, selectedObject, x, y);
        x = temp[0];
        y = temp[1];
      }
    }
    if (mode == 'rotation') {
      if (selectedObject != -1 && isDrag) {
        var temp = rotateLine(canvas, event, selectedObject, x, y);
        x = temp[0];
        y = temp[1];
      }
    }
    if (mode == 'dilatation') {
      if (selectedObject != -1 && isDrag) {
        var temp = dilateLine(canvas, event, selectedObject, x, y);
        x = temp[0];
        y = temp[1];
      }
    }
  }
});

canvas.addEventListener('mousedown', function (e) {
  isDrag = true;
  x = getXCoordinate(canvas, e);
  y = getYCoordinate(canvas, e);
  console.log('x : ' + x + ' y : ' + y);
  if (isLine) {
    if (mode == 'move') {
      var idx = isExistPoint(x, y);
      if (idx != -1) {
        selectedObject = idx[0];
        idxPoint = idx[1];
      }
    } else {
      selectedObject = isExistLine(x, y);
    }
    if (mode == 'create') {
      draw(1, [x, y, rgb[0], rgb[1], rgb[2]], gl.POINTS);
      var line = drawLine(x, y, rgb);
      if (line != 0) {
        var object = {
          type: 'line',
          vertices: line,
        };
        arrObjects.push(object);
        vertices = [];
      }
    }
  }
  if (isPolygon) {
    if (mode == 'create') {
      draw(1, [x, y, rgb[0], rgb[1], rgb[2]], gl.POINTS);
      var polygon = drawPolygon(countVertices, x, y, rgb);
      if (polygon != 0) {
        var object = {
          type: 'polygon',
          vertices: polygon,
        };
        arrObjects.push(object);
        vertices = [];
      }
    }
  }
});
