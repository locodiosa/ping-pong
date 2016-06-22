"use strict";

var wall1 = {
	length: 600,
	width: 10
};

var wall2 = {
	length: 600,
	width: 10
};

var ball = {
	x: 300,
	y: 300,
	radius: 5,
	speedX: 3,
	speedY: 3
};

var canvas = null;

var mainloop = function() {
	calc();
	draw();
}

function initCanvas() {
	if (canvas == null) {
		canvas = document.getElementById("canvas");
		canvas.width  = wall1.length; 
		canvas.height = 600;
	}
}

function draw() {
	initCanvas();
	var context = canvas.getContext('2d');
	context.fillStyle   = '#ccc'; 
	context.fillRect(0, 0, canvas.width, canvas.height);	
	
	drawObjects(context);
}

function drawObjects(context) {
	context.fillStyle = '#333';
	context.beginPath();
	context.fillRect(0, 0, wall1.length, wall1.width);
	context.fillRect(0, canvas.height - 10, wall2.length, wall2.width);
	context.arc(ball.x, ball.y, ball.radius, 0, 2*Math.PI);
	context.closePath();
	context.fill();	
}

function calc() {
	var dt = 1;					
	ball.newX = ball.x + ball.speedX * dt;
	ball.newY = ball.y + ball.speedY * dt;
		
	ball.x = ball.newX;
	ball.y = ball.newY;
}

var animFrame = window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				window.oRequestAnimationFrame      ||
				window.msRequestAnimationFrame     ||
				null;

if (animFrame !== null) {
	var recursiveAnim = function() {
		mainloop();
		animFrame(recursiveAnim, canvas);
	};

	// start the mainloop
	animFrame(recursiveAnim);
} else {
	var ONE_FRAME_TIME = 1000.0 / 60.0 ;
	setInterval(mainloop, ONE_FRAME_TIME);
}
