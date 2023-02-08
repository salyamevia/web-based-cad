var canvas = document.getElementById('canvas')
var gl = canvas.getContext('webgl', {preserveDrawingBuffer: true})

var isLine = false
var isSquare = false
var isRectangle = false
var isPolygon = false
var countVertices = 0
var isDrag = false
var mode = "create"

var x = 0
var y = 0
var width = document.getElementById('canvas').width
var height = document.getElementById('canvas').height

var selectedObject
var idxPoint

var vertices = []
var rgb = [0.0, 0.0, 0.0]
var arrObjects = []

var getXCoordinate = function (canvas, event) {
  var rect = canvas.getBoundingClientRect()
  return event.clientX - rect.left
}

var getYCoordinate = function (canvas, event) {
    var rect = canvas.getBoundingClientRect()
    return rect.bottom - event.clientY
}

//draw polygon on canvas using gl shader program
var draw = function (n, vertices, method) {
    var vertexShaderCode = 
    `precision mediump float;

    attribute vec2 vertPosition;
    attribute vec3 vertColor;
    varying vec3 fragColor;

    void main() {
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
        gl_PointSize = 10.0;
    }`
    var fragmentShaderCode = 
    `precision mediump float;

    varying vec3 fragColor;

    void main() {
        gl_FragColor = vec4(fragColor, 1.0);
    }`

    var vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, vertexShaderCode)
    gl.compileShader(vertexShader)
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader, fragmentShaderCode)
    gl.compileShader(fragmentShader)

    var program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.validateProgram(program)
    // gl.useProgram(program)

    var vertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.enableVertexAttribArray(positionAttribLocation)
    gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 0 );
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.enableVertexAttribArray(colorAttribLocation)
    gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);


	// Main render loop
	gl.useProgram(program)
    gl.drawArrays(method, 0, n)
}

    

canvas.addEventListener("mousedown", function(e) {
    x = getXCoordinate(canvas, e)
    y = getYCoordinate(canvas, e)   
    x = (x / width) * 2 - 1
    y = (y / height) * 2 - 1
    console.log('x : '+ x + ' y : ' + y)
    draw(1, [x, y, rgb[0], rgb[1], rgb[2]], gl.POINTS)
    if (isLine) {
        if (mode == "create") {
            var line = drawLine(x, y, rgb)
            if (line != 0) {
                var object = {
                    type: "line",
                    vertices: line
                }
                arrObjects.push(object)
                vertices = []
            }
        }
    }
    if (isPolygon){
        if (mode == "create") {
            var polygon = drawPolygon(countVertices, x, y, rgb)
            if (polygon != 0) {
                var object = {
                    type: "polygon",
                    vertices: polygon
                }
                arrObjects.push(object)
                vertices = []
            }
        }
    }
})