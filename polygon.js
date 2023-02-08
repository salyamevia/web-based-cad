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
