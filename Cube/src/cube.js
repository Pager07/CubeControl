// Directional lighting demo: By Frederick Li
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'attribute vec4 a_Normal;\n' +        // Normal
    'uniform mat4 u_ModelMatrix;\n' +
    'uniform mat4 u_NormalMatrix;\n' +
    'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_ProjMatrix;\n' +
    'uniform vec3 u_LightColor;\n' +     // Light color
    'uniform vec3 u_LightDirection;\n' + // Light direction (in the world coordinate, normalized)
    'varying vec4 v_Color;\n' +
    'uniform bool u_isLighting;\n' +
    'void main() {\n' +
    '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
    '  if(u_isLighting)\n' + 
    '  {\n' +
    '     vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);\n' +
    '     float nDotL = max(dot(normal, u_LightDirection), 0.0);\n' +
            // Calculate the color due to diffuse reflection
    '     vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;\n' +
    '     v_Color = vec4(diffuse, a_Color.a);\n' +  '  }\n' +
    '  else\n' +
    '  {\n' +
    '     v_Color = a_Color;\n' +
    '  }\n' + 
    '}\n';


// Fragment shader program
var FSHADER_SOURCE =
'#ifdef GL_ES\n' +
'precision mediump float;\n' +
'#endif\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
'  gl_FragColor = v_Color;\n' +
'}\n';



var modelMatrix = new Matrix4();
var viewMatrix = new Matrix4();
var projMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();

var ANGLE_STEP = 3.0;
var g_xAngle = 0.0;
var g_yAngle = 0.0;

function main() {
// Retrieve <canvas> element
var canvas = document.getElementById('webgl');

// Get the rendering context for WebGL
var gl = getWebGLContext(canvas);
if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
}

// Initialize shaders
if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
}

// Set clear color and enable hidden surface removal
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);

// Clear color and depth buffer
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// Get the storage locations of uniform attributes
var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');

// Trigger using lighting or not
var u_isLighting = gl.getUniformLocation(gl.program, 'u_isLighting'); 

if (!u_ModelMatrix || !u_ViewMatrix || !u_NormalMatrix ||
    !u_ProjMatrix || !u_LightColor || !u_LightDirection ||
    !u_isLighting ) { 
    console.log('Failed to Get the storage locations of u_ModelMatrix, u_ViewMatrix, and/or u_ProjMatrix');
    return;
}

// Set the light color (white)
gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
// Set the light direction (in the world coordinate)
var lightDirection = new Vector3([0.5, 3.0, 4.0]);
lightDirection.normalize();     // Normalize
gl.uniform3fv(u_LightDirection, lightDirection.elements);

// Calculate the view matrix and the projection matrix
viewMatrix.setLookAt(0, 0, 15, 0, 0, -100, 0, 1, 0);
projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
// Pass the model, view, and projection matrix to the uniform variable respectively
gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);


document.onkeydown = function(ev){
    keydown(ev, gl, u_ModelMatrix, u_NormalMatrix, u_isLighting);
};

draw(gl, u_ModelMatrix, u_NormalMatrix, u_isLighting);
}

function keydown(ev, gl, u_ModelMatrix, u_NormalMatrix, u_isLighting) {
    switch (ev.keyCode) {
        case 40: // Up arrow key -> the positive rotation of arm1 around the y-axis
        g_xAngle = (g_xAngle + ANGLE_STEP) % 360;
        break;
        case 38: // Down arrow key -> the negative rotation of arm1 around the y-axis
        g_xAngle = (g_xAngle - ANGLE_STEP) % 360;
        break;
        case 39: // Right arrow key -> the positive rotation of arm1 around the y-axis
        g_yAngle = (g_yAngle + ANGLE_STEP) % 360;
        break;
        case 37: // Left arrow key -> the negative rotation of arm1 around the y-axis
        g_yAngle = (g_yAngle - ANGLE_STEP) % 360;
        break;
        default: return; // Skip drawing at no effective action
    }
    
    // Draw the scene
    draw(gl, u_ModelMatrix, u_NormalMatrix, u_isLighting);
    }
    
    

function initVertexBuffers(gl){
    var vertices = new Float32Array([   // Coordinates
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
        -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
    ]);


    var colors = new Float32Array([    // Colors
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
    ]);


    var normals = new Float32Array([    // Normal
        0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
    -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
    ]);


    // Indices of the vertices
    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ]);

    // write vertex data to buffer
    if(!initArrayBuffer(gl,'a_Position', vertices, 3, gl.FLOAT)) return -1;
    if(!initArrayBuffer(gl,'a_color', colors, 3, gl.FLOAT)) return -1;
    if(!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) return -1;

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer); 
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices,gl.STATIC_DRAW);

    return indices.length;
}

//helper function
function initArrayBuffer(gl,attribute,data,num,type){
    var buffer  = gl.createBuffer();
    if(!buffer){
        console.log('Failed to create buffer memory space');
        return 0
    }

    //gl.arraybuffer is a target
    //to bind one object to one target means
    // that you want to use that object in whatever manner that target uses objects bound to it.
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    //what is STATIC_DRAW?
    //https://stackoverflow.com/questions/16462517/bufferdata-usage-parameter-differences
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    //Attributes are referenced by an index number into the list of attributes maintained by the GPU. 
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if(a_attribute < 0){
        console.log('Failed to get the storage location of ' + attribute);
        return 0
    }
    //binds the buffer currently bound to gl.ARRAY_BUFFER to a generic vertex attribute
    //tells OpenGL what to do with the supplied array data, 
    //since OpenGL doesn't inherently know what format that data will be in.
    //size = numOfBasis:  A GLint specifying the number of components per vertex attribute.
    // Must be 1, 2, 3, or 4.
    
    gl.vertexAttribPointer(a_attribute, num, type, false,0,0 );

    //https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/enableVertexAttribArray
    gl.enableVertexAttribArray(a_attribute)

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function initAxesVertexBuffers(gl){
    var verticesColors = new Float32Array([
        // Vertex coordinates and color (for axes)
        -20.0,  0.0,   0.0,  1.0,  1.0,  1.0,  // (x,y,z), (r,g,b) 
        20.0,  0.0,   0.0,  1.0,  1.0,  1.0,
        0.0,  20.0,   0.0,  1.0,  1.0,  1.0, 
        0.0, -20.0,   0.0,  1.0,  1.0,  1.0,
        0.0,   0.0, -20.0,  1.0,  1.0,  1.0, 
        0.0,   0.0,  20.0,  1.0,  1.0,  1.0 
    ]);

    var n = 6;
    
    //write the vertex position to the buffer
    var vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW); 
    //missing a line 
    var F_SIZE = verticesColors.BYTES_PER_ELEMENT;
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, F_SIZE*6, 0)
    gl.enableVertexAttribArray(a_Position);

    //because the data is in the same buffer you dont have to create a new buffer
    var a_Color  = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3 , gl.FLOAT, false, F_SIZE*6,  F_SIZE*3);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    return n;

}

function draw(gl,u_ModelMatrix, u_NormalMatrix, u_isLighting){
    //Clears buffer 
    gl.clear(gl.COLOR_BUFFER_BIT |gl.DEPTH_BUFFER_BIT);

    //1i: 1 means 1 value , i means the value is going to be an integer
   // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform
    gl.uniform1i(u_isLighting,false);

    var n = initAxesVertexBuffers(gl);
    
    modelMatrix.setTranslate(0,0,0);
    gl.uniformMatrix4fv(u_ModelMatrix, false , modelMatrix.elements);

    //prespecify separate arrays of vertices, normals, and colors and use them 
    //to construct a sequence of primitives with a single call to glDrawArrays
    //; glDrawArrays:: obviously 
    //does not need an index buffer to be uploaded to the GPU - memory and time save there
    gl.drawArrays(gl.LINES, 0 , n);
    gl.uniform1i(u_isLighting, true);

    var n = initVertexBuffers(gl);

    //Rotate adn then translate
    modelMatrix.setTranslate(0,0,0);
    modelMatrix.rotate(g_yAngle, 0,1,0);
    modelMatrix.rotate(g_xAngle, 1,0,0);//Rotate along x axis
    modelMatrix.scale(1.5,1,1.5);//scale

    //pass the model matrix to the uniform variable 
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    //calcualte the normal transformation matrix and pass it to u_NormalMatrix
    g_normalMatrix.setInverseOf(modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false , g_normalMatrix.elements);

    //Draw the cube
    //glDrawElements:: can reuse vertices by repeating indices;
    gl.drawElements(gl.TRIANGLES, n , gl.UNSIGNED_BYTE, 0);

}


