var n = 0

var setPolygon = function(){
    countVertices = document.getElementById('vertices').value
    if(countVertices == null || countVertices < 3){
        alert("Please input number of vertices")
        return 0
    }
    isPolygon = true
    isLine = false
    isSquare = false
    isRectangle = false
}

var drawPolygon = function(countVert, x, y, rgb){
    if (n < countVert-1){
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
        draw(countVert, vertices, gl.TRIANGLE_FAN)
        n = 0;
        return vertices
    }
}

var isInsideTriangle = function(px, py, p0x, p0y, p1x, p1y, p2x, p2y) {
    //compute using barycentric
    var area = 0.5 *(-p1y*p2x + p0y*(-p1x + p2x) + p0x*(p1y - p2y) + p1x*p2y)
    var s = 1/(2*area)*(p0y*p2x - p0x*p2y + (p2y - p0y)*px + (p0x - p2x)*py)
    var t = 1/(2*area)*(p0x*p1y - p0y*p1x + (p0y - p1y)*px + (p1x - p0x)*py)
    return (s > 0) && (t > 0) && ((1-s-t) > 0)
}
var isExistPolygon = function (x, y) {
    for (var i = 0; i < arrObjects.length; i++) {
        var count = 0
        if(arrObjects[i].type == "polygon"){
            pivotx = arrObjects[i].vertices[0]
            pivoty = arrObjects[i].vertices[1]
            for (var j = 5; j < arrObjects[i].vertices.length; j+=5) {
                if(isInsideTriangle(x, y, pivotx, pivoty, arrObjects[i].vertices[j], arrObjects[i].vertices[j+1], arrObjects[i].vertices[j+5], arrObjects[i].vertices[j+6])){
                    count += 1
                }
            }
            if(count % 2 == 1){
                return i
            }
        }
    }
    return -1
}

var moveVertex = function(canvas, event, selectedObject, idxPoint){
    x = getXCoordinate(canvas, event)
    y = getYCoordinate(canvas, event) 
    arrObjects[selectedObject].vertices[idxPoint] = x
    arrObjects[selectedObject].vertices[idxPoint+1] = y
    drawAll()
}

var translatePolygon = function(canvas, event, selectedObject, x, y){
    console.log(x,y)
    newx = getXCoordinate(canvas, event)
    newy = getYCoordinate(canvas, event)   
    console.log(newx, newy)
    for(var i = 0; i < arrObjects[selectedObject].vertices.length; i+=5){
        arrObjects[selectedObject].vertices[i] += (newx - x)
        arrObjects[selectedObject].vertices[i+1] += (newy - y)
    }
    drawAll()
    return [newx, newy]
}

var rotatePolygon = function(canvas, event, selectedObject, x, y){
    newx = getXCoordinate(canvas, event)
    newy = getYCoordinate(canvas, event)
    var centroidx = 0
    var centroidy = 0
    for(var i = 0; i < arrObjects[selectedObject].vertices.length; i+=5){
        centroidx += arrObjects[selectedObject].vertices[i]
        centroidy += arrObjects[selectedObject].vertices[i+1]
    }
    centroidx /= (arrObjects[selectedObject].vertices.length/5)
    centroidy /= (arrObjects[selectedObject].vertices.length/5)   
    var angle = Math.atan2(newy - centroidy, newx - centroidx) - Math.atan2(y - centroidy, x - centroidx)
    console.log(angle)
    var cos = Math.cos(angle)
    var sin = Math.sin(angle)
    for(var i = 0; i < arrObjects[selectedObject].vertices.length; i+=5){
        temp0 = arrObjects[selectedObject].vertices[i]
        temp1 = arrObjects[selectedObject].vertices[i+1]
        arrObjects[selectedObject].vertices[i] = (temp0 - centroidx) * cos - (temp1 - centroidy) * sin + centroidx
        arrObjects[selectedObject].vertices[i+1] = (temp0 - centroidx) * sin + (temp1 - centroidy) * cos + centroidy
    }
    drawAll()
    return [newx, newy]
}

var dilatePolygon = function(canvas, event, selectedObject, x, y){
    newx = getXCoordinate(canvas, event)
    newy = getYCoordinate(canvas, event)   
    var centroidx = 0
    var centroidy = 0
    for(var i = 0; i < arrObjects[selectedObject].vertices.length; i+=5){
        centroidx += arrObjects[selectedObject].vertices[i]
        centroidy += arrObjects[selectedObject].vertices[i+1]
    }
    centroidx /= (arrObjects[selectedObject].vertices.length/5)
    centroidy /= (arrObjects[selectedObject].vertices.length/5)  
    var dist = Math.sqrt(Math.pow(newx - centroidx, 2) + Math.pow(newy - centroidy, 2))
    var dist1 = Math.sqrt(Math.pow(x - centroidx, 2) + Math.pow(y - centroidy, 2))
    var scale = dist / dist1
    console.log(scale)
    for(var i = 0; i < arrObjects[selectedObject].vertices.length; i+=5){
        arrObjects[selectedObject].vertices[i] = (arrObjects[selectedObject].vertices[i] - centroidx) * scale + centroidx
        arrObjects[selectedObject].vertices[i+1] = (arrObjects[selectedObject].vertices[i+1] - centroidy) * scale + centroidy
    }
    drawAll()
    return [newx, newy]
}

var addVertex = function(selectedObject, x, y){
    arrObjects[selectedObject].vertices.push(x)
    arrObjects[selectedObject].vertices.push(y)
    arrObjects[selectedObject].vertices.push(0.0)
    arrObjects[selectedObject].vertices.push(0.0)
    arrObjects[selectedObject].vertices.push(0.0)
    isAddVertex = false
    drawAll()
}

var removeVertex = function(selectedObject) {
    arrObjects[selectedObject[0]].vertices.splice(selectedObject[1], 5)
    drawAll()
}