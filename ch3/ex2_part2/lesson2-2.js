main();

function main() {
    /*========== Create a WebGL Context ==========*/
    const canvas = document.querySelector("#c");
    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('WebGL unavailable');
    } else {
        console.log('WebGL is good to go');
    }
      
    /*========== Define and Store the Geometry ==========*/
    const squares = [
        // front face
        //Triangle 1-3
        -0.3 , -0.3, -0.3,
        0.3, -0.3, -0.3,
        0.3, 0.3, -0.3,  

        //Triangle 4-6
        -0.3, -0.3, -0.3,
        -0.3, 0.3, -0.3,
        0.3, 0.3, -0.3,                  

        // back face
        //Triangle 7-9
        -0.2, -0.2, 0.3,
        0.4, -0.2, 0.3,
        0.4, 0.4, 0.3, 

        //Triangle 10-12
        -0.2, -0.2, 0.3,
        -0.2, 0.4, 0.3,
        0.4, 0.4, 0.3, 
    ];
    
    // buffer
    const origBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, origBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squares), gl.STATIC_DRAW);

    const squareColors = [
      // front face colors
        0.5,  0.0,  0.9,  1.0,
        0.0,  0.0,  1.0,  1.0,
        1.0,  0.0,  1.0,  1.0,

        0.0,  1.0,  1.0,  1.0,
        0.0,  0.0,  1.0,  1.0,
        1.0,  1.0,  1.0,  1.0,

        // back face colors
        1.0,  0.0,  0.0,  1.0,   
        1.0,  0.0,  0.0,  1.0,  
        1.0,  0.0,  1.0,  1.0,

        1.0,  0.0,  0.0,  1.0,  
        1.0,  0.0,  0.0,  1.0,  
        1.0,  0.0,  0.0,  1.0,
    ];
     
      const colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareColors), gl.STATIC_DRAW);

      /*========== Shaders ==========*/

      const vsSource = `
        attribute vec4 aPosition;
        attribute vec4 aVertexColor;

        varying lowp vec4 vColor;

        void main() {
           
            gl_Position = aPosition;
            vColor = aVertexColor;
             /*
            gl_Position = aVertexColor;
            vColor = aPosition;
            */
      }
  `;

    const fsSource = `
        varying lowp vec4 vColor;

        void main() {
            gl_FragColor = vColor;
    }
    `;

    //create shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.shaderSource(fragmentShader, fsSource);

    // compile shaders
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(vertexShader));
        gl.deleteShader(vertexShader);
        return null;
      }
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(fragmentShader));
        gl.deleteShader(fragmentShader);
        return null;
      }

    // create program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // link program
    gl.linkProgram(program);
    gl.useProgram(program);
    
    /*========== Connect the attribute with the vertex shader ==========*/        
    const posAttribLocation = gl.getAttribLocation(program, "aPosition");
    gl.bindBuffer(gl.ARRAY_BUFFER, origBuffer);
    gl.vertexAttribPointer(posAttribLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttribLocation);

    const colorAttribLocation = gl.getAttribLocation(program, "aVertexColor");
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorAttribLocation);
            
    /*========== Drawing ========== */
    gl.clearColor(1, 1, 1, 1);
    
    // Mit der Einstellung gl.DEPTH_TEST wird der Z-Buffer benutzt, um auf Pixelebene zu prüfen, was vorne und was hinten ist bzw. wer was verdeckt.
    gl.enable(gl.DEPTH_TEST); 
    //gl.depthFunc(gl.LEQUAL);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //gl.clear(gl.COLOR_BUFFER_BIT);    
    // Draw the points on the screen
    const mode = gl.TRIANGLES;
    const first = 0;
    const count = 12;
    gl.drawArrays(mode, first, count);   
  }
  