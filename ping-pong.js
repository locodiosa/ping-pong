"use strict";


var wall1 = {
	lenght: 600,
	width: 10
};

var wall2 = {
	lenght: 600,
	width: 10
};


var mainloop = function() {
	//calc();
	draw();
}

setInterval(mainloop);


function draw() {
	var canvas  = document.getElementById("canvas");
	canvas.width  = wall1.lenght; 
	canvas.height = 600; 
		
	var context = canvas.getContext('2d');
	context.fillStyle   = '#ccc'; 
	context.fillRect(0, 0, canvas.width, canvas.height);	
	
	drawObjects(context);
}

function drawObjects(context) {
	context.fillStyle = '#333';
	context.beginPath();
	context.fillRect(0, 0, wall1.lenght, wall1.width);
	context.fillRect(0, canvas.height - 10, wall2.lenght, wall2.width);
	context.closePath();
	context.fill();	
	
}