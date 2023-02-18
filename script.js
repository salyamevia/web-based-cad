var canvas = document.getElementById('canvas');
var gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
var redSlider = document.getElementById('red');
var greenSlider = document.getElementById('green');
var blueSlider = document.getElementById('blue');
var colorCheckbox = document.getElementById('color-all');

var red = 0.0;
redSlider.oninput = function () {
  red = this.value / 255;
};
var green = 0.0;
greenSlider.oninput = function () {
  green = this.value / 255;
};
var blue = 0.0;
blueSlider.oninput = function () {
  blue = this.value / 255;
};

var isLine = false;
var isSquare = false;
var isRectangle = false;
var isPolygon = false;
var countVertices = 0;
var isDrag = false;
var isAddVertex = false;
var isHorizontalShear = false;
var mode = 'create';

var x = 0;
var y = 0;
var width = document.getElementById('canvas').width;
var height = document.getElementById('canvas').height;
var size = 0.5; // Square default size
var rectWidth = 0.5; // Rectangle default width
var rectHeight = 0.2; // Rectangle default height

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
  if (mode == 'addVertex') {
    isAddVertex = true;
  }
  console.log(mode);
}

function setColor() {
  if (colorCheckbox.checked == true) {
    mode = 'colorAll';
  } else {
    mode = 'color';
  }
}

const setHorizontalShearDir = (isHorizontal) => {
  isHorizontalShear = isHorizontal;
  console.log('Shear mode:', isHorizontalShear);
};

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

var changeColor = function (selectedObject, idxPoint) {
  arrObjects[selectedObject].vertices[idxPoint + 2] = red;
  arrObjects[selectedObject].vertices[idxPoint + 3] = green;
  arrObjects[selectedObject].vertices[idxPoint + 4] = blue;

  drawAll();
};

var changeColorAll = function (selectedObject) {
  for (var i = 0; i < arrObjects[selectedObject].vertices.length; i += 5) {
    arrObjects[selectedObject].vertices[i + 2] = red;
    arrObjects[selectedObject].vertices[i + 3] = green;
    arrObjects[selectedObject].vertices[i + 4] = blue;
  }
  drawAll();
};

function saveFile() {
  //convert arrObjects to json file and download it
  var dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(arrObjects));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', 'model' + '.json');
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function loadFile() {
  document
    .getElementById('input-file')
    .addEventListener('change', handleFileSelect, false);
}

function handleFileSelect(event) {
  const reader = new FileReader();
  reader.onload = handleFileLoad;
  reader.readAsText(event.target.files[0]);
}

function handleFileLoad(event) {
  console.log(event);
  arrObjects = JSON.parse(event.target.result);
  drawAll();
}

/* =============== RENDERER FUNCTIONS =============== */

/**
 * Draw single object on canvas using gl shader
 * @param {int} n Number of edges within the shape
 * @param {array} vertices Array of vertice coordinates
 * @param {gl} method Rendering method (gl.TRIANGLE_STRIP, gl.LINES)
 */
//draw polygon on canvas using gl shader program
var draw = function (n, vertices, method) {
  // Basic shader for vertex and fragment
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

  // Compile shader
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderCode);
  gl.compileShader(vertexShader);

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderCode);
  gl.compileShader(fragmentShader);

  // Create Program
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.validateProgram(program);
  // gl.useProgram(program)

  // Create buffer object for the vertices
  var vertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Setup vertex attributes
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

  // Color the shape
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

/**
 * Render all objects within object array
 */
var drawAll = function () {
  // Clear canvas
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Start drawing each object
  for (var i = 0; i < arrObjects.length; i++) {
    switch (arrObjects[i].type) {
      case 'line':
        draw(
          arrObjects[i].vertices.length / 5,
          arrObjects[i].vertices,
          gl.POINTS
        );
        draw(
          arrObjects[i].vertices.length / 5,
          arrObjects[i].vertices,
          gl.LINES
        );
        break;
      case 'square':
        draw(
          arrObjects[i].vertices.length / 5,
          arrObjects[i].vertices,
          gl.POINTS
        );
        draw(
          arrObjects[i].vertices.length / 5,
          arrObjects[i].vertices,
          gl.TRIANGLE_STRIP
        );
        break;
      case 'rectangle':
        draw(
          arrObjects[i].vertices.length / 5,
          arrObjects[i].vertices,
          gl.POINTS
        );
        draw(
          arrObjects[i].vertices.length / 5,
          arrObjects[i].vertices,
          gl.TRIANGLE_STRIP
        );
        break;
      case 'polygon':
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
        break;
    }
  }

  window.requestAnimationFrame(function () {
    drawAll();
  });
};

/* =============== FUNCTIONALITY FUNCTIONS =============== */

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

/* =============== DRAWING MODE EVENT HANDLER =============== */

canvas.addEventListener('mousemove', function (event) {
  // --------------- LINE ---------------
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
  // --------------- SQUARE ---------------
  if (isSquare) {
    switch (mode) {
      case 'move':
        if (selectedObject != -1 && isDrag) {
          moveVertex(canvas, event, selectedObject, idxPoint);
        }
        break;
      case 'translation':
        if (selectedObject != -1 && isDrag) {
          var temp = translateSquare(canvas, event, selectedObject, x, y);
          x = temp[0];
          y = temp[1];
        }
        break;
      case 'rotation':
        if (selectedObject != -1 && isDrag) {
          var temp = rotateSquare(canvas, event, selectedObject, x, y);
          x = temp[0];
          y = temp[1];
        }
        break;
      case 'dilatation':
        if (selectedObject != -1 && isDrag) {
          var temp = dilateSquare(canvas, event, selectedObject, x, y);
          x = temp[0];
          y = temp[1];
        }
        break;
      case 'shear':
        if (selectedObject != -1 && isDrag) {
          var temp = shearSquare(
            canvas,
            event,
            selectedObject,
            x,
            y,
            isHorizontalShear
          );
          x = temp[0];
          y = temp[1];
        }
        break;
    }
  }
  // --------------- RECTANGLE ---------------
  if (isRectangle) {
    switch (mode) {
      case 'move':
        if (selectedObject != -1 && isDrag) {
          moveVertex(canvas, event, selectedObject, idxPoint);
        }
        break;
      case 'translation':
        if (selectedObject != -1 && isDrag) {
          var temp = translateSquare(canvas, event, selectedObject, x, y);
          x = temp[0];
          y = temp[1];
        }
        break;
      case 'rotation':
        if (selectedObject != -1 && isDrag) {
          var temp = rotateRectangle(canvas, event, selectedObject, x, y);
          x = temp[0];
          y = temp[1];
        }
        break;
      case 'dilatation':
        if (selectedObject != -1 && isDrag) {
          var temp = dilateSquare(canvas, event, selectedObject, x, y);
          x = temp[0];
          y = temp[1];
        }
        break;
      case 'shear':
        if (selectedObject != -1 && isDrag) {
          var temp = shearSquare(
            canvas,
            event,
            selectedObject,
            x,
            y,
            isHorizontalShear
          );
          x = temp[0];
          y = temp[1];
        }
        break;
    }
  }
  // --------------- POLYGON ---------------
  if (isPolygon) {
    if (mode == 'move') {
      if (selectedObject != -1 && isDrag) {
        moveVertex(canvas, event, selectedObject, idxPoint);
      }
    }
    if (mode == 'translation') {
      if (selectedObject != -1 && isDrag) {
        var temp = translatePolygon(canvas, event, selectedObject, x, y);
        x = temp[0];
        y = temp[1];
      }
    }
    if (mode == 'rotation') {
      if (selectedObject != -1 && isDrag) {
        var temp = rotatePolygon(canvas, event, selectedObject, x, y);
        x = temp[0];
        y = temp[1];
      }
    }
    if (mode == 'dilatation') {
      if (selectedObject != -1 && isDrag) {
        var temp = dilatePolygon(canvas, event, selectedObject, x, y);
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
  if (mode == 'addVertex') {
    //draw a point
    var pointx = x;
    var pointy = y;
    draw(1, [pointx, pointy, 0.0, 0.0, 0.0], gl.POINTS);
    canvas.addEventListener(
      'mousedown',
      function (event) {
        x = getXCoordinate(canvas, event);
        y = getYCoordinate(canvas, event);
        var selectedObject2 = isExistPolygon(x, y);
        if (selectedObject2 != -1 && isAddVertex) {
          addVertex(selectedObject2, pointx, pointy);
        }
      },
      { once: true }
    );
  }

  if (mode == 'removeVertex') {
    var selectedObject2 = isExistPoint(x, y);
    if (selectedObject2 != -1) {
      removeVertex(selectedObject2);
    }
  }

  // LINE
  if (isLine) {
    if (mode == 'move' || mode == 'color') {
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
    if (mode == 'color') {
      if (selectedObject != -1) {
        changeColor(selectedObject, idxPoint);
      }
    }
    if (mode == 'colorAll') {
      if (selectedObject != -1) {
        changeColorAll(selectedObject);
      }
    }
  }
  // SQUARE
  if (isSquare) {
    switch (mode) {
      case 'move' ||
        'color' ||
        'create' ||
        'dilatation' ||
        'translation' ||
        'rotation' ||
        'shear':
        var idx = isExistPoint(x, y);
        if (idx != -1) {
          selectedObject = idx[0];
          idxPoint = idx[1];
        } else {
          selectedObject = isSquareExists(x, y);
          console.log('halo', selectedObject);
        }
        break;
      case 'create':
        draw(1, [x, y, rgb[0], rgb[1], rgb[2]], gl.POINTS);

        customSize = parseFloat(document.getElementById('squareSize').value);
        size = customSize != null ? customSize : size;

        var square = drawSquare(x, y, size, rgb);
        if (square != 0) {
          arrObjects.push({ type: 'square', vertices: square });
          vertices = [];
        }
        break;
      case 'color':
        if (selectedObject != -1) {
          changeColor(selectedObject, idxPoint);
        }
        break;
      case 'colorAll':
        if (selectedObject != -1) {
          changeColorAll(selectedObject, idxPoint);
        }
        break;
    }
  }
  // RECTANGLE
  if (isRectangle) {
    switch (mode) {
      case 'move' ||
        'color' ||
        'create' ||
        'dilatation' ||
        'translation' ||
        'rotation' ||
        'shear':
        var idx = isExistPoint(x, y);
        if (idx != -1) {
          selectedObject = idx[0];
          idxPoint = idx[1];
        } else {
          selectedObject = isRectangleExists(x, y);
          console.log('halo', selectedObject);
        }
        break;
      case 'create':
        draw(1, [x, y, rgb[0], rgb[1], rgb[2]], gl.POINTS);

        customRectWidth = parseFloat(
          document.getElementById('rectWidth').value
        );
        customRectHeight = parseFloat(
          document.getElementById('rectHeight').value
        );
        rectWidth = customRectWidth != null ? customRectWidth : rectWidth;
        rectHeight = customRectHeight != null ? customRectHeight : rectHeight;

        var rectangle = drawRectangle(x, y, rectWidth, rectHeight, rgb);
        if (square != 0) {
          arrObjects.push({ type: 'rectangle', vertices: rectangle });
          vertices = [];
        }
        break;
      case 'color':
        if (selectedObject != -1) {
          changeColor(selectedObject, idxPoint);
        }
        break;
      case 'colorAll':
        if (selectedObject != -1) {
          changeColorAll(selectedObject, idxPoint);
        }
        break;
    }
  }
  // POLYGON
  if (isPolygon) {
    if (mode == 'move' || mode == 'color') {
      var idx = isExistPoint(x, y);
      if (idx != -1) {
        selectedObject = idx[0];
        idxPoint = idx[1];
      }
    } else {
      selectedObject = isExistPolygon(x, y);
    }
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
    if (mode == 'color') {
      if (selectedObject != -1) {
        changeColor(selectedObject, idxPoint);
      }
    }
    if (mode == 'colorAll') {
      if (selectedObject != -1) {
        changeColorAll(selectedObject);
      }
    }
  }
});
