"use strict";

var canvas = null;

var clientWidth = document.documentElement.clientWidth;
var clientHeight = document.documentElement.clientHeight;
var scale = clientWidth * 0.95;

if (clientWidth >= clientHeight * 1.3) {
	clientHeight = clientHeight;
	scale = clientHeight * 1.3;
};

var heightCoef = 0.7
	
var boardWidth = 1;
var boardHeight = heightCoef;

var scorePlayer = 0;
var scoreComputer = 0;
var frameCounter = 0;
var startSystemTime = Date.now() / 1000;
var gameState = 0;
var startPauseTime = 0;
var dt = 1;
var numberBallBounce = 0;


/////////////////////////////////////////Объекты/////////////////////////////////////////

var wallUpper = {
	length: 1,
	width: heightCoef * 0.02,

	draw: function(context) {
		context.fillRect(0, 0, this.length * scale, this.width * scale);
	},

	bounce: function(ball) {
		if ((ball.y <= this.width + ball.radius) && (ball.speedY < 0)) {
			ball.speedY = -ball.speedY;
		}
	}
};

var wallBottom = {
	length: 1,
	width: 0.014,

	draw: function(context) {
		context.fillRect(0, heightCoef * scale - this.width * scale, this.length * scale, this.width * scale);
	},

	bounce: function(ball) {
		if ((ball.y >= heightCoef - this.width - ball.radius) && (ball.speedY > 0)) {
			ball.speedY = -ball.speedY;
		}
	}
};

var wallLeft = {
	length: heightCoef,
	width: 0.001,

	draw: function(context) {},

	bounce: function(ball) {
		if (ball.x <= - ball.radius) {
			countScore("scoreComputer", scoreComputer);
			gameState = 2;
			ball.x = racket2.x - racket2.width - ball.radius;
			ball.y = racket2.y;
			
			if (ball.y >= boardHeight / 2) {
				ball.speedX = 0.005;
				ball.speedY = - 0.002;
			} else {
				ball.speedX = 0.005;
				ball.speedY = 0.002;
			};
			
			scoreComputer += 1;
		}
	}
};

var wallRight = {
	length: heightCoef,
	width: 0.001,

	draw: function(context) {},

	bounce: function(ball) {
		if (ball.x >= 1 + ball.radius) {
			countScore("scorePlayer", scorePlayer);
			gameState = 2;
			ball.x = racket1.x + racket1.width + ball.radius;
			ball.y = racket1.y;
			
			if (ball.y >= 0.35) {
				ball.speedX = - 0.005;
				ball.speedY = - 0.002;
			} else {
				ball.speedX = - 0.005;
				ball.speedY = 0.002;
			};

			scorePlayer += 1;
		}
	}
};

var ball = {
	x: 0.5,
	y: heightCoef / 2,
	radius: 0.02,
	speedX: 0.005,
	speedY: 0.002,

	draw: function(context) {
		context.arc(this.x * scale, this.y * scale, this.radius * scale, 0, 2*Math.PI);
	},

	bounce: function(ball){}
};

//ракетка игрока
var racket1 = {
	length: heightCoef * 0.17,
	width: 0.02,
	x: 0, //левый край
	y: heightCoef / 2, //центр
	speed: 0,

	draw: function(context) {
		context.fillRect(this.x * scale, this.y * scale - this.length * scale / 2, this.width * scale, this.length * scale);
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

//ракетка компьютера
var racket2 = {
	length: heightCoef * 0.17,
	width: 0.02,
	x: 1, //правый край
	y: heightCoef / 2, //центр
	speed: 0.004,

	draw: function(context) {
		context.fillRect(this.x * scale - this.width * scale, this.y * scale - this.length * scale / 2, this.width * scale, this.length * scale);
	},

	bounce: function(ball) {
		if ((ball.x >= this.x - this.width - ball.radius) && 
			(ball.y >= this.y - this.length / 2 - ball.radius) && 
			(ball.y <= this.y + this.length / 2 + ball.radius) &&
			(ball.speedX > 0)) {
				bounceRacket(this);
		}
		
		if (ball.speedX < 0) {
			if (this.y >= 0.35) {
				this.y -= this.speed * dt;
			} 

			if (this.y < 0.35){
				this.y += this.speed * dt;
			}
		}
	}
};

var objects = [wallUpper, wallBottom, wallLeft, wallRight, racket1, racket2, ball];


/////////////////////////////////////Основной цикл//////////////////////////////
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
		if (ball.x > 0.5) {
			moveRacket1();
			draw();
		}
				
		if (pauseTime >= startPauseTime + 2) {
			gameState = 0;
		}

	} else if (gameState == 2) {
		startPauseTime = Date.now() / 1000;
		gameState = 1;
	}
}

function initCanvas() {
	canvas = document.getElementById("canvas");
	canvas.width  = 1 * scale; 
	canvas.height = 0.7 * scale;
}

function initAreas() {
	//области отрисовки и нажатия
	var gameArea = document.getElementById('gameArea');
	gameArea.style.width = (canvas.width) + 'px';
	gameArea.style.height = (canvas.height) + 'px' ;
	gameArea.style.marginTop = (-canvas.height / 2) + 'px';
	gameArea.style.marginLeft = (-canvas.width / 2) + 'px';
	var upArea = document.getElementById('up');
	upArea.style.width = (document.documentElement.clientWidth) + 'px';
	upArea.style.marginLeft = (- (document.documentElement.clientWidth-canvas.width) / 2) + 'px';
	var downArea = document.getElementById('down');
	downArea.style.width = (document.documentElement.clientWidth) + 'px';
	downArea.style.marginLeft = (- (document.documentElement.clientWidth-canvas.width) / 2) + 'px';
}

function draw() {
	initCanvas();
	initAreas();
	var context = canvas.getContext('2d');
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
	moveBall();	
	moveRacket1();
	moveRacket2();
}

function moveBall() {
//движение мяча
	ball.newX = ball.x + ball.speedX * dt;
	ball.newY = ball.y + ball.speedY * dt;
	ball.x = ball.newX;
	ball.y = ball.newY;

	objects.forEach(function(o) {
		o.bounce(ball);
	});
}

function moveRacket2() {
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
}

function moveRacket1() {
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

	var nextNumberBallBounce = numberBallBounce + 1;
	numberBallBounce = nextNumberBallBounce;

	if (numberBallBounce <= 10) {
		var ballSpeed = Math.sqrt(ball.speedX * ball.speedX + ball.speedY * ball.speedY) * 1.05;
	} else {
		ballSpeed = Math.sqrt(ball.speedX * ball.speedX + ball.speedY * ball.speedY);
	}
	
	var alpha = Math.asin(ball.speedY / ballSpeed);
	alpha += side * Math.PI / 6;
	var maxAlpha = Math.PI * 0.4; 
	alpha = Math.min(Math.max(alpha, -maxAlpha), maxAlpha);

	ball.speedY = Math.sin(alpha) * ballSpeed;
	ball.speedX = Math.sqrt(ballSpeed * ballSpeed - ball.speedY * ball.speedY) * 
				(ball.speedX >= 0 ? -1 : 1);
}


///////////////////////////Движение ракетки игрока/////////////////////////////////////////

function move(event) {
	//перемещение ракетки игрока стрелками
	if(event.keyCode == 40) {
		racket1.speed = boardWidth * 0.004;
	} else if(event.keyCode == 38) {
		racket1.speed = - boardWidth * 0.004;
	}
}

function moveStop() {
	//остановка ракетки игрока
	racket1.speed = 0;
}

function moveUp() {
	//движение ракетки игрока наверх
	racket1.speed = - boardWidth * 0.004;
}

function moveDown() {
	//движение ракетки игрока вниз
	racket1.speed = boardWidth * 0.004;
}
////////////////////////////////////////////////////////////////////////////////////////////


function countScore(idName, gamer) {
	//подсчёт очков
	gamer += 1;
	ball.speedX = - ball.speedX;
	ball.speedY = - ball.speedY;
	document.getElementById(idName).innerHTML = "" + gamer + "";
	if (gamer == 10) {
		document.getElementById(idName).innerHTML = "" + gamer + "";
		document.getElementById("gameOver").innerHTML = "ИГРА ОКОНЧЕНА";
		
		setTimeout(function() {
    		location.reload();
    	}, 2000);
	}
}

function countFrames() {
	//частота кадров
	frameCounter += 1;
	var currentSystemTime = Date.now() / 1000;
	
	if (currentSystemTime - startSystemTime >= 1) {
		startSystemTime = currentSystemTime; 
		frameCounter = 0;
	}
}

function resize() {
	//изменение масштаба отрисовки
	clientWidth = document.documentElement.clientWidth;
	clientHeight = document.documentElement.clientHeight;
	scale = clientWidth * 0.95;

	if (clientWidth >= clientHeight * 1.3) {
		clientHeight = clientHeight;
		scale = clientHeight * 1.3;
	};
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

//////////////////////////////управление наклоном телефона//////////////////////////////////
function sensor() {
	window.addEventListener('deviceorientation', onOrientationChange, true);
}

function onOrientationChange(event) {
	var insensitivityArea = 20; //ширина зоны нечувствительности

	if (clientWidth > clientHeight) {
		//альбомная ориентация экрана
		if (event.gamma > insensitivityArea) { 
			moveDown();
			/*if (event.gamma < insensitivityArea) {
				moveStop();
			}*/
		}
		if (event.gamma < - insensitivityArea) { 
    		moveUp();
    		/*if (event.gamma > - insensitivityArea) {
				moveStop();
			}*/
		}

	} else if (clientWidth < clientHeight) {
		//портретная ориентация экрана
		if (event.beta > 0) {
			moveDown();
			if (event.beta < insensitivityArea) {
				moveStop();
			}
		}
		if (event.beta < 0) {
    		moveUp();
    		if (event.beta > - insensitivityArea) {
				moveStop();
			}
		}
	}
}

function touch() {
	window.removeEventListener('deviceorientation', onOrientationChange, true);
}



