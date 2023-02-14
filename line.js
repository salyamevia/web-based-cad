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

var isExistLine = function (x, y) {
    for (var i = 0; i < arrObjects.length; i++) {
        for (var j = 0; j < arrObjects[i].vertices.length; j+=5) {
            if(arrObjects[i].type == "line"){
                var slope = (arrObjects[i].vertices[j+1] - arrObjects[i].vertices[j+6]) / (arrObjects[i].vertices[j] - arrObjects[i].vertices[j+5])
                var slope1 = (arrObjects[i].vertices[j+1] - y) / (arrObjects[i].vertices[j] - x)
                var slope2 = (arrObjects[i].vertices[j+6] - y) / (arrObjects[i].vertices[j+5] - x)
                var dist1 = Math.abs(slope1 - slope)
                var dist2 = Math.abs(slope2 - slope)
                console.log(dist1, dist2)
                if (dist1 < 0.02 || dist2 < 0.02) {
                    return i
                }
            }
        }
    }
    return -1
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

var translateLine = function(canvas, event, selectedObject, x, y){
    newx = getXCoordinate(canvas, event)
    newy = getYCoordinate(canvas, event)   
    newx = (newx / width) * 2 - 1
    newy = (newy / height) * 2 - 1
    console.log(newx, newy)
    arrObjects[selectedObject].vertices[0] += (newx - x)
    arrObjects[selectedObject].vertices[1] += (newy - y)
    arrObjects[selectedObject].vertices[5] += (newx - x)
    arrObjects[selectedObject].vertices[6] += (newy - y)
    // draw(1, arrObjects[selectedObject].vertices, gl.POINTS)
    // draw(2, arrObjects[selectedObject].vertices, gl.LINES)
    drawAll()
}

var rotateLine = function(canvas, event, selectedObject, x, y){
    newx = getXCoordinate(canvas, event)
    newy = getYCoordinate(canvas, event)   
    newx = (newx / width) * 2 - 1
    newy = (newy / height) * 2 - 1
    midx = (arrObjects[selectedObject].vertices[0] + arrObjects[selectedObject].vertices[5]) / 2
    midy = (arrObjects[selectedObject].vertices[1] + arrObjects[selectedObject].vertices[6]) / 2
    var angle = Math.atan2(newy - midy, newx - midx) - Math.atan2(y - midy, x - midx)
    console.log(angle)
    var cos = Math.cos(angle)
    var sin = Math.sin(angle)
    temp0 = arrObjects[selectedObject].vertices[0]
    temp1 = arrObjects[selectedObject].vertices[1]
    temp5 = arrObjects[selectedObject].vertices[5]
    temp6 = arrObjects[selectedObject].vertices[6]
    arrObjects[selectedObject].vertices[0] = (temp0 - midx) * cos - (temp1 - midy) * sin + midx
    arrObjects[selectedObject].vertices[1] = (temp0 - midx) * sin + (temp1 - midy) * cos + midy
    arrObjects[selectedObject].vertices[5] = (temp5 - midx) * cos - (temp6 - midy) * sin + midx
    arrObjects[selectedObject].vertices[6] = (temp5 - midx) * sin + (temp6 - midy) * cos + midy
    drawAll()
}

var dilateLine = function(canvas, event, selectedObject, x, y){
    newx = getXCoordinate(canvas, event)
    newy = getYCoordinate(canvas, event)   
    newx = (newx / width) * 2 - 1
    newy = (newy / height) * 2 - 1
    midx = (arrObjects[selectedObject].vertices[0] + arrObjects[selectedObject].vertices[5]) / 2
    midy = (arrObjects[selectedObject].vertices[1] + arrObjects[selectedObject].vertices[6]) / 2
    var dist = Math.sqrt(Math.pow(newx - midx, 2) + Math.pow(newy - midy, 2))
    var dist1 = Math.sqrt(Math.pow(x - midx, 2) + Math.pow(y - midy, 2))
    var scale = dist / dist1
    console.log(scale)
    arrObjects[selectedObject].vertices[0] = (arrObjects[selectedObject].vertices[0] - midx) * scale + midx
    arrObjects[selectedObject].vertices[1] = (arrObjects[selectedObject].vertices[1] - midy) * scale + midy
    arrObjects[selectedObject].vertices[5] = (arrObjects[selectedObject].vertices[5] - midx) * scale + midx
    arrObjects[selectedObject].vertices[6] = (arrObjects[selectedObject].vertices[6] - midy) * scale + midy
    drawAll()
}
