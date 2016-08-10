"use strict";

var canvas = null;
var boardHeight = 550;
var boardWidth = 600;
var scorePlayer = 0;
var scoreComputer = 0;
var frameCounter = 0;
var startSystemTime = Date.now() / 1000;
var gameState = 0;

var wallUpper = {
	length: boardWidth,
	width: 10,

	draw: function(context) {
		context.fillRect(0, 0, this.length, this.width);
	},

	bounce: function(ball) {
		if (ball.y <= this.width + ball.radius) {
			ball.speedY = -ball.speedY;
		}
	}
};

var wallBottom = {
	length: boardWidth,
	width: 10,

	draw: function(context) {
		context.fillRect(0, boardHeight - this.width, this.length, this.width);
	},

	bounce: function(ball) {
		if (ball.y >= boardHeight - this.width - ball.radius) {
			ball.speedY = -ball.speedY;
		}
	}
};

var wallLeft = {
	length: boardHeight,
	width: 1,

	draw: function(context) {},

	bounce: function(ball) {
		if (ball.x <= - ball.radius) {
			countScore("scoreComputer", scoreComputer);
			gameState = 1;
			ball.x = racket2.x - racket2.width - ball.radius;
			ball.y = racket2.y;
			scoreComputer += 1;
		}
	}
};

var wallRight = {
	length: boardHeight,
	width: 1,

	draw: function(context) {},

	bounce: function(ball) {
		if (ball.x >= boardWidth + ball.radius) {
			countScore("scorePlayer", scorePlayer);
			gameState = 1;
			ball.x = racket1.x + racket1.width + ball.radius;
			ball.y = racket1.y;
			scorePlayer += 1;
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
	y: boardHeight / 2,
	speed: 0,

	draw: function(context) {
		context.fillRect(this.x, this.y - this.length / 2, this.width, this.length);
	},

	bounce: function(ball) {
		if ((ball.x <= this.x + this.width + ball.radius) && 
			(ball.y >= this.y - this.length / 2 - ball.radius) && 
			(ball.y <= this.y + this.length / 2 + ball.radius)) {
				bounceRacket(this);
		}
	}
};

var racket2 = {
	length: 100,
	width: 15,
	x: boardWidth,
	y: boardHeight / 2,
	speed: 2,

	draw: function(context) {
		context.fillRect(this.x - this.width, this.y - this.length / 2, this.width, this.length);
	},

	bounce: function(ball) {
		if ((ball.x >= this.x - this.width - ball.radius) && 
			(ball.y >= this.y - this.length / 2 - ball.radius) && 
			(ball.y <= this.y + this.length / 2 + ball.radius)) {
				bounceRacket(this);
		}
	}
};

var objects = [wallUpper, wallBottom, wallLeft, wallRight, racket1, racket2, ball];

//основной цикл
var mainloop = function() {
	checkGameState();	
	countFrames();
}

function checkGameState() {
	if (gameState == 0) {
		calc();
		draw();
	} else if (gameState == 1) {
		var startTime = Date.now();
		var currentTime = Date.now();
		while (currentTime <= startTime + 2000) {
			currentTime = Date.now();
		}
		gameState = 0;
	}
}

function initCanvas() {
	if (canvas == null) {
		canvas = document.getElementById("canvas");
		canvas.width  = boardWidth; 
		canvas.height = boardHeight;
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
		if (racket2.y >= boardHeight - racket2.length / 2 - wallBottom.width) {
			racket2.y = boardHeight - racket2.length / 2 - wallBottom.width;
		}	
	} else if (ball.y < racket2.y) {
		racket2.y -= racket2.speed * dt;
		if (racket2.y <= racket2.length / 2 + wallUpper.width) {
			racket2.y = racket2.length/2 + wallUpper.width;
		} 
	}	

	//движение ракетки игрока
	racket1.newY = racket1.y + racket1.speed * dt;
	racket1.y = racket1.newY;

	if (racket1.y >= boardHeight - racket1.length / 2 - wallBottom.width) {
		racket1.y = boardHeight - racket1.length / 2 - wallBottom.width;
	}	

	if (racket1.y <= racket1.length / 2 + wallUpper.width) {
		racket1.y = racket1.length/2 + wallUpper.width;
	} 
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

function countScore(idName, gamer) {
	gamer += 1;
	ball.speedX = - ball.speedX;
	ball.speedY = - ball.speedY;
	document.getElementById(idName).innerHTML = "" + gamer + "";
}

//частота кадров
function countFrames() {
	frameCounter += 1;
	var currentSystemTime = Date.now();
	
	if (currentSystemTime - startSystemTime >= 1000) {
		console.log("кадров в секунду:" + frameCounter);
		startSystemTime = currentSystemTime; 
		frameCounter = 0;
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

