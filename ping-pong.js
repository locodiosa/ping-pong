"use strict";

var canvas = null;

var wall1 = {
	length: 600,
	width: 10,

	draw: function(context) {
		context.fillRect(0, 0, this.length, this.width);
	},

	bounce: function(ball) {
		if (ball.y <= wall3.length - this.width - ball.radius) {
			ball.speedY = -ball.speedY;
		}
		if (ball.y >= this.width + ball.radius) {
			ball.speedY = -ball.speedY;
		}
	}
};

var wall2 = {
	length: 600,
	width: 10,

	draw: function(context) {
		context.fillRect(0, canvas.height - 10, this.length, this.width);
	},

	bounce: function(ball) {
		if (ball.y <= wall3.length - wall1.width - ball.radius) {
			ball.speedY = -ball.speedY;
		}
		if (ball.y >= wall1.width + ball.radius) {
			ball.speedY = -ball.speedY;
		}
	}
};

var wall3 = {
	length: 600,
	width: 1,

	draw: function(context) {},

	bounce: function(ball) {
		if (ball.x <= wall1.length - this.width - ball.radius) {
			ball.speedX = -ball.speedX;
		}
		if (ball.x >= this.width + ball.radius) {
			ball.speedX = -ball.speedX;
		}
	}
};

var wall4 = {
	length: 600,
	width: 1,

	draw: function(context) {},

	bounce: function(ball) {
		if (ball.x <= wall1.length - wall3.width - ball.radius) {
			ball.speedX = -ball.speedX;
		}
		if (ball.x >= wall3.width + ball.radius) {
			ball.speedX = -ball.speedX;
		}
	}
};

var ball = {
	x: 300,
	y: 300,
	radius: 15,
	speedX: 5,
	speedY: 2,

	draw: function(context) {
		context.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
	},

	bounce: function(ball){}
};

var racket1 = {
	length: 100,
	width: 15,
	x: 0,
	y: wall3.length/2,
	speed: 0,

	draw: function(context) {
		context.fillRect(this.x, this.y - this.length / 2, this.width, this.length);
	},

	bounce: function(ball) {
		if ((ball.x <= this.x + this.width + ball.radius) && 
			(ball.y >= this.y - this.length/2 - ball.radius) && 
			(ball.y <= this.y + this.length/2 + ball.radius)) {
				bounceRacket(this);
		}
	}
};

var racket2 = {
	length: 100,
	width: 15,
	x: wall1.length,
	y: wall3.length/2,
	speed: 3,

	draw: function(context) {
		context.fillRect(this.x - this.width, this.y - this.length / 2, this.width, this.length);
	},

	bounce: function(ball) {
		if ((ball.x >= this.x - this.width - ball.radius) && 
			(ball.y >= this.y - this.length/2 - ball.radius) && 
			(ball.y <= this.y + this.length/2 + ball.radius)) {
				bounceRacket(this);
		}
	}
};

var objects = [wall1, wall2, wall3, wall4, racket1, racket2, ball];

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
	objects.forEach(function(o) {
		o.draw(context);
	});
	context.closePath();
	context.fill();	
}

function calc() {
	//движение мяча
	var dt = 1;					
	ball.newX = ball.x + ball.speedX * dt;
	ball.newY = ball.y + ball.speedY * dt;
	ball.x = ball.newX;
	ball.y = ball.newY;

	objects.forEach(function(o) {
		o.bounce(ball);
	});
	

	//движение ракетки компьютера
	if (ball.y > racket2.y) {
		racket2.y += racket2.speed * dt;
		if (racket2.y >= wall3.length - racket2.length/2 - wall1.width) {
			racket2.y = wall3.length - racket2.length/2 - wall1.width;
		}	
	} else if (ball.y < racket2.y) {
		racket2.y -= racket2.speed * dt;
		if (racket2.y <= racket2.length/2 + wall1.width) {
			racket2.y = racket2.length/2 + wall1.width;
		} 
	}	

	//движение ракетки игрока
	racket1.newY = racket1.y + racket1.speed * dt;
	racket1.y = racket1.newY;
	
}

function bounceRacket(racket) {
	//расчет угла отскока мяча от ракетки
	var side = (ball.y - racket.y) / (racket.length / 2);
	
	var ballSpeed = Math.sqrt(ball.speedX * ball.speedX + ball.speedY * ball.speedY);
	var alpha = Math.asin(ball.speedY / ballSpeed);

	alpha += side * Math.PI / 6;

	var maxAlpha = Math.PI * 0.4; 
	alpha = Math.min(Math.max(alpha, -maxAlpha), maxAlpha);

	ball.speedY = Math.sin(alpha) * ballSpeed;
	ball.speedX = Math.sqrt(ballSpeed * ballSpeed - ball.speedY * ball.speedY) * 
					(ball.speedX >= 0 ? -1 : 1);

	console.log(ball.speedX + ":" + ball.speedY);
}

function move(event) {
	//перемещение ракетки игрока стрелками
	if(event.keyCode == 40) {
		racket1.speed = 3;
	} else if(event.keyCode == 38) {
		racket1.speed = -3;
	}
}

function moveStop() {
	racket1.speed = 0;
}

function moveUp() {
	racket1.speed = -3;
}
function moveDown() {
	racket1.speed = 3;
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
