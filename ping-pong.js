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
	radius: 15,
	speedX: 5,
	speedY: 2
};

var racket1 = {
	length: 100,
	width: 15,
	x: 0,
	y: wall3.length/2,
	speed: 0
};

var racket2 = {
	length: 100,
	width: 15,
	x: wall1.length,
	y: wall3.length/2,
	speed: 1.8
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
	context.fillRect(racket2.x - racket2.width, racket2.y - racket2.length / 2, racket2.width, racket2.length);
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

	if (ball.y <= wall3.length - wall1.width - ball.radius) {
		ball.speedY = -ball.speedY;
	}
	if (ball.y >= wall1.width + ball.radius) {
		ball.speedY = -ball.speedY;
	}

	if (ball.x <= wall1.length - wall3.width - ball.radius) {
		ball.speedX = -ball.speedX;
	}
	if (ball.x >= wall3.width + ball.radius) {
		ball.speedX = -ball.speedX;
	}

	if ((ball.x <= racket1.x + racket1.width + ball.radius) && 
		(ball.y >= racket1.y - racket1.length/2 - ball.radius) && 
		(ball.y <= racket1.y + racket1.length/2 + ball.radius)) {
		ball.speedX = -ball.speedX;
	}

	if ((ball.x >= racket2.x - racket2.width - ball.radius) && 
		(ball.y >= racket2.y - racket2.length/2 - ball.radius) && 
		(ball.y <= racket2.y + racket2.length/2 + ball.radius)) {
				
		var side = (ball.y - racket2.y) / (racket2.length / 2);

		var ballSpeed = Math.sqrt(ball.speedX * ball.speedX + ball.speedY * ball.speedY);
		var alpha = Math.asin(ball.speedY / ballSpeed);

		alpha += side * Math.PI / 6;

		var maxAlpha = Math.PI * 0.4; 
		alpha = Math.min(Math.max(alpha, -maxAlpha), maxAlpha);

		ball.speedY = Math.sin(alpha) * ballSpeed;
		ball.speedX = -Math.sqrt(ballSpeed * ballSpeed - ball.speedY * ball.speedY);

		console.log(ball.speedX + ":" + ball.speedY);
	}

	if ((ball.y <= racket2.length/2) || 
		(ball.y >= wall3.length - racket2.length/2)) {
		racket2.y = racket2.y
	} else if(ball.y > racket2.y){
		racket2.y += racket2.speed * dt;
	} else if  (ball.y < racket2.y){
		racket2.y -= racket2.speed * dt;
	}	

	racket1.newY = racket1.y + racket1.speed * dt;
	racket1.y = racket1.newY;



}

function move(event) {
	if(event.keyCode == 40) {
		racket1.speed = 3;
	} else if(event.keyCode == 38) {
		racket1.speed = -3;
	}
}

function moveStop() {
	racket1.speed = 0;
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
