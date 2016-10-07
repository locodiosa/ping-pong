"use strict";

var canvas = null;

var clientWidth = document.documentElement.clientWidth;
var clientHeight = document.documentElement.clientHeight;
var boardWidth = clientWidth * 0.9;
var boardHeight = boardWidth * 0.7;

if (clientWidth >= clientHeight * 1.3) {
	boardHeight = clientHeight * 0.8;
	boardWidth = boardHeight * 1.3;
} 

var scorePlayer = 0;
var scoreComputer = 0;
var frameCounter = 0;
var startSystemTime = Date.now() / 1000;
var gameState = 0;
var startPauseTime = 0;
var dt = 1;


var wallUpper = {
	length: boardWidth,
	width: boardHeight * 0.02,

	draw: function(context) {
		context.fillRect(0, 0, this.length, this.width);
	},

	bounce: function(ball) {
		if ((ball.y <= this.width + ball.radius) && (ball.speedY < 0)) {
			ball.speedY = -ball.speedY;
		}
	}
};

var wallBottom = {
	length: boardWidth,
	width: boardHeight * 0.02,

	draw: function(context) {
		context.fillRect(0, boardHeight - this.width, this.length, this.width);
	},

	bounce: function(ball) {
		if ((ball.y >= boardHeight - this.width - ball.radius) && (ball.speedY > 0)) {
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
			gameState = 2;
			ball.x = racket2.x - racket2.width - ball.radius;
			ball.y = racket2.y;
			
			if (ball.y >= boardHeight / 2) {
				ball.speedX = boardWidth * 0.005;
				ball.speedY = - boardWidth * 0.002;
			} else {
				ball.speedX = boardWidth * 0.005;
				ball.speedY = boardWidth * 0.002;
			};
			
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
			gameState = 2;
			ball.x = racket1.x + racket1.width + ball.radius;
			ball.y = racket1.y;
			
			if (ball.y >= boardHeight / 2) {
				ball.speedX = - boardWidth * 0.005;
				ball.speedY = - boardWidth * 0.002;
			} else {
				ball.speedX = - boardWidth * 0.005;
				ball.speedY = boardWidth * 0.002;
			};

			scorePlayer += 1;
		}
	}
};

var ball = {
	x: boardWidth / 2,
	y: boardHeight / 2,
	radius: boardWidth * 0.02,
	speedX: boardWidth * 0.005,
	speedY: boardWidth * 0.002,

	draw: function(context) {
		context.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
	},

	bounce: function(ball){}
};

var racket1 = {
	length: boardHeight * 0.17,
	width: boardWidth * 0.02,
	x: 0,
	y: boardHeight / 2,
	speed: 0,

	draw: function(context) {
		context.fillRect(this.x, this.y - this.length / 2, this.width, this.length);
	},

	bounce: function(ball) {
		if ((ball.x <= this.x + this.width + ball.radius) && 
			(ball.y >= this.y - this.length / 2 - ball.radius) && 
			(ball.y <= this.y + this.length / 2 + ball.radius) &&
			(ball.speedX < 0)) {
				bounceRacket(this);
		}
	}
};

var racket2 = {
	length: boardHeight * 0.17,
	width: boardWidth * 0.02,
	x: boardWidth,
	y: boardHeight / 2,
	speed: boardWidth * 0.004,

	draw: function(context) {
		context.fillRect(this.x - this.width, this.y - this.length / 2, this.width, this.length);
	},

	bounce: function(ball) {
		if ((ball.x >= this.x - this.width - ball.radius) && 
			(ball.y >= this.y - this.length / 2 - ball.radius) && 
			(ball.y <= this.y + this.length / 2 + ball.radius) &&
			(ball.speedX > 0)) {
				bounceRacket(this);
		}
		
		if (ball.speedX < 0) {
			if (this.y >= boardHeight / 2) {
				this.y -= this.speed * dt;
			} 

			if (this.y < boardHeight / 2){
				this.y += this.speed * dt;
			}
		}
	}
};

var objects = [wallUpper, wallBottom, wallLeft, wallRight, racket1, racket2, ball];


/////////////////////////////////////основной цикл//////////////////////////////
var mainloop = function() {
	checkGameState();	
	countFrames();
}
////////////////////////////////////////////////////////////////////////////////


function checkGameState() {
	if (gameState == 0) {
		calc();
		draw();
	} else if (gameState == 1) {
		var pauseTime = Date.now() / 1000;
		
		if (pauseTime >= startPauseTime + 2) {
			gameState = 0;
		}
	} else if (gameState == 2) {
		startPauseTime = Date.now() / 1000;
		gameState = 1;
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
	ball.newX = ball.x + ball.speedX * dt;
	ball.newY = ball.y + ball.speedY * dt;
	ball.x = ball.newX;
	ball.y = ball.newY;

	objects.forEach(function(o) {
		o.bounce(ball);
	});
	
	//движение ракетки компьютера
	if (ball.speedX > 0) {
		if (ball.y > racket2.y + racket2.length / 4) {
			racket2.y += racket2.speed * dt;
			if (racket2.y >= boardHeight - racket2.length / 2 - wallBottom.width) {
				racket2.y = boardHeight - racket2.length / 2 - wallBottom.width;
			}	
		} else if (ball.y < racket2.y - racket2.length / 4) {
			racket2.y -= racket2.speed * dt;
			if (racket2.y <= racket2.length / 2 + wallUpper.width) {
				racket2.y = racket2.length/2 + wallUpper.width;
			} 
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
	var ballSpeed = Math.sqrt(ball.speedX * ball.speedX + ball.speedY * ball.speedY) * 1.05;
	var alpha = Math.asin(ball.speedY / ballSpeed);

	alpha += side * Math.PI / 6;

	var maxAlpha = Math.PI * 0.4; 
	
	alpha = Math.min(Math.max(alpha, -maxAlpha), maxAlpha);

	ball.speedY = Math.sin(alpha) * ballSpeed;
	ball.speedX = Math.sqrt(ballSpeed * ballSpeed - ball.speedY * ball.speedY) * 
				(ball.speedX >= 0 ? -1 : 1);
	console.log("ballSpeed = " + ballSpeed);
}


function move(event) {
	//перемещение ракетки игрока стрелками
	if(event.keyCode == 40) {
		racket1.speed = boardWidth * 0.004;
	} else if(event.keyCode == 38) {
		racket1.speed = - boardWidth * 0.004;
	}
}

function moveStop() {
	racket1.speed = 0;
}

function moveUp() {
	racket1.speed = - boardWidth * 0.004;
}
function moveDown() {
	racket1.speed = boardWidth * 0.004;
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
	var currentSystemTime = Date.now() / 1000;
	
	if (currentSystemTime - startSystemTime >= 1) {
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

//запрет прокрутки страницы
document.onmousewheel = document.onwheel = function() { 
	return false;
};
document.addEventListener("MozMousePixelScroll", function() {return false}, false);
document.onkeydown = function(e) {
	if ((e.keyCode >= 33) && (e.keyCode <=40)) {
		return false;
	} 
}

