"use strict";

var wall1 = {
	length: 600,
	width: 10
};

var wall2 = {
	length: 600,
	width: 10
};

var wall3 = {
	length: 600,
	width: 1
};

var wall4 = {
	length: 600,
	width: 1
};

var ball = {
	x: 300,
	y: 300,
	radius: 30,
	speedX: 5,
	speedY: 2
};

var racket1 = {
	length: 200,
	width: 50,
	x: 0,
	y: wall3.length/2
};

var racket2 = {
	length: 200,
	width: 50,
	x: wall1.length,
	y: wall3.length/2
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
		canvas.height = wall3.length;
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
	context.fillRect(racket1.x, racket1.y - racket1.length / 2, racket1.width, racket1.length);
	context.fillRect(racket2.x - racket2.width, racket2.y - racket2.length / 2, racket1.width, racket1.length);
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
	if(ball.y <= wall3.length - wall1.width - ball.radius) {
		ball.speedY = -ball.speedY;
	}
	if(ball.y >= wall1.width + ball.radius) {
		ball.speedY = -ball.speedY;
	}
	if(ball.x <= wall1.length - wall3.width - ball.radius) {
		ball.speedX = -ball.speedX;
	}
	if(ball.x >= wall3.width + ball.radius) {
		ball.speedX = -ball.speedX;
	}
	if((ball.x <= racket1.x + racket1.width + ball.radius) && 
		(ball.y >= racket1.y - racket1.length/2 - ball.radius) && 
		(ball.y <= racket1.y + racket1.length/2 + ball.radius)) {
		ball.speedX = -ball.speedX;
	}
	if((ball.x >= racket2.x - racket2.width - ball.radius) && 
		(ball.y >= racket2.y - racket2.length/2 - ball.radius) && 
		(ball.y <= racket2.y + racket2.length/2 + ball.radius)) {
		ball.speedX = -ball.speedX;
	}
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
