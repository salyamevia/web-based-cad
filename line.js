var n = 0
var points = []

var setLine = function(){
    isLine = true
    isSquare = false
    isRectangle = false
    isPolygon = false
}

var drawLine = function(x, y, rgb){
    if (n == 0){
        vertices.push(x)
        vertices.push(y)
        vertices.push(rgb[0])
        vertices.push(rgb[1])
        vertices.push(rgb[2])
        n++;
        return 0
    }
    else {
        vertices.push(x)
        vertices.push(y)
        vertices.push(rgb[0])
        vertices.push(rgb[1])
        vertices.push(rgb[2])
        console.log(vertices)
        draw(2, vertices, gl.LINES)
        n = 0;
        return vertices
    }
}

var moveLine = function(canvas, event, selectedObject, idxPoint){
    x = getXCoordinate(canvas, event)
    y = getYCoordinate(canvas, event)   
    x = (x / width) * 2 - 1
    y = (y / height) * 2 - 1
    arrObjects[selectedObject].vertices[idxPoint] = x
    arrObjects[selectedObject].vertices[idxPoint+1] = y
    console.log(arrObjects)
    // draw(1, arrObjects[selectedObject].vertices, gl.POINTS)
    // draw(2, arrObjects[selectedObject].vertices, gl.LINES)
    drawAll()
}
