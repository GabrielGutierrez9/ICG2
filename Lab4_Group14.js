/*
We got stuck on how to swap the values between the shapes. What we wanted to do was have a variable named shape that's
value would changed when the user clicked on the different shapes. From there it would be easy to make that shape appear on click.
Having different sized shapes would be difficult though. The changing thickness was also a difficult part, because we couldn't pass it through 
in a similar way as we did the the colors.

*/

"use strict";

var canvas;
var gl;


var maxNumTriangles = 200;
var maxNumVertices  = 3 * maxNumTriangles;
var index = 0;
// Holds value for shapes. 0= tri, 1 = squ, 2 = rect, 3 = dots
var shape = 3;

var redraw = false;

var colors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
];


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    canvas.addEventListener("mousedown", function(event){
      redraw = true;
    });

    canvas.addEventListener("mouseup", function(event){
      redraw = false;
    });
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
	
	var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
	
	var vSize = document.getElementById("slider" ).onchange = function() {
		vSize = event.srcElement.value;
           };
		
		// Change the color to the users choice
	document.getElementById("ColorMenu" ).onclick = function(event) {
        switch( event.srcElement.index ) {
          case 0:
            console.log('black');
			vColor = vec4(colors[0]);
            break;
         case 1:
            vColor = vec4(colors[1]);
			console.log('red');
            break;
         case 2:
            vColor = vec4(colors[2]);
			console.log('yellow');
            break;
			case 3:
            vColor = vec4(colors[3]);
			console.log('Green');
            break;
         case 4:
            vColor = vec4(colors[4]);
			console.log('blue');
           break;
                }
    };
	
	document.getElementById("ShapeMenu" ).onclick = function(event){
		switch( event.srcElement.index ) {
          case 0:
            console.log('Triangle');
			shape = 0;
            break;
         case 1:
            shape = 1;
			console.log('Square');
            break;
         case 2:
            shape = 2;
			console.log('Rectangle');
            break;
		 case 3:
            shape = 3;
			console.log('Dots');
            break;
		}
			};
			
		   
	// Clear the drawing area  
	/*document.getElementById("ClearCanvasButton").onclick = function () {
		console.log('Clear called');
		// Specify the color for clearing <canvas>
		gl.clearColor(1.0, 1.0, 1.0, 1.0);
        // Clear <canvas>
		gl.clear(gl.COLOR_BUFFER_BIT);
  		
		//redraw
		var len = g_points.length;
        for(var i = 0; i < len; i += 2) 
        {
			
            // Pass the position of a point to a_Position variable
            t = vec4( 1.0, 1.0, 1.0, 1.0 )
            gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);

            // Draw
            gl.drawArrays(gl.POINTS, 0, 1);
        }
		
													};*/
	// Array to keep track of points placed for erasing												
	var g_points = [];												
	
	//canvas.addEventListener("mousedown", function(){
		    canvas.addEventListener("mousemove", function(event){
		
		//if ShapeMenu == 3 {
        if(redraw) {
          gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
          var t = vec2(2*event.clientX/canvas.width-1,
          2*(canvas.height-event.clientY)/canvas.height-1);
		  g_points.push([t,t]);
		  //console.log(g_points);
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));

        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
		
		t = vColor;
        gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(t));
        index++;
		}
		/*}
		else if shape == 1 {
			this would draw a square at the user clicked spot;
		
		}
		else if shape == 2 {
			this would draw a rectangle at the user clicked spot;
		}
		else if shape == 0 {
			this would draw an equilateral triangle at the user clicked spot;
		}*/

    } );

    render();

	}
	


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, index );

    window.requestAnimFrame(render);

}
