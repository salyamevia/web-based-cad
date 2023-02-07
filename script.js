var canvas = document.getElementById('canvas')
var gl = canvas.getContext('webgl')

var isLine = false
var isSquare = false
var isRectangle = false
var isPolygon = false
var isDrag = false

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

canvas.addEventListener("mousedown", function(e) {
    x = getXCoordinate(canvas, e)
    y = getYCoordinate(canvas, e)   
    console.log('x : '+ x + ' y : ' + y)
    
})