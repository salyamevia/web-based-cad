var n = 0
var points = []

var setLine = function(){
    isLine = true
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
        drawPolygon(2, vertices, gl.LINES)
        n = 0;
        return vertices
    }
}
