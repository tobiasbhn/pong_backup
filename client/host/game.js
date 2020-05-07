var ballSpeedFactor = 170; //BallSpeed = CanvasWidth / Factor
var ballSpeedIncreasFactor = 50; //ballSpeedIncreasFactor = BallSpeed / Factor :::: Ball increases Speed per Hit 
var ballSizeFactor = 50; //BallRadius = CanvasHeight / Factor
var playerSpeedFactor = 80; //PlayerSpeed = CanvasHeight / Factor
var playerWidthFactor = 30; //PlayerWidth = CanvasHeight / Factor
var playerHeightFactor = 10; //PlayerHeight = CanvasHeight / Factor
var pointsToWin = 5;

var backgroundColor = '#000000';
var voregroundColor = '#FFFFFF';

var statusPlaying = 'playing';
var statusStarting = 'starting';
var statusWaiting = 'waiting for game-start';

var startTimer = null;
var endTimer = null;
var deltaTime = 0;
var oldTime = new Date().getTime();

class Game {
	constructor(inputs, name, id , key, w, h) {
		this.inputs = inputs;
		this.gameName = name;
		this.gameId = id;
		this.gameKey = key;
		this.width = w;
		this.height = h;

		this.gameStatus = statusWaiting;
		this.prevPlayer1 = 'no player';
		this.prevPlayer2 = 'no player';

		this.canvas = document.getElementById('canvas');
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.context = this.canvas.getContext('2d');

		this.player1 = new Player(this.height / playerWidthFactor, this);
		this.player2 = new Player(this.width - this.height / playerWidthFactor, this);
		this.ball = new Ball(this);
	}

	//main loop - gets initialised from other script
	newTick(inputs) {
		//inputs = [name1, input1, name2, input2]
		var newTime = new Date().getTime();
		deltaTime = (newTime - oldTime) / 1000;
		oldTime = newTime;
		deltaTime = deltaTime >= 0.5 ? 0.5 : deltaTime;

		this.inputs = inputs;
		this.checkRuntime();
		this.update();
		this.render();
		//console.log(this.gameStatus);
		var gameStats = [this.gameStatus, this.player1.score, this.player2.score];
		return gameStats;
	}

	update() {
		//update Players
		this.player1.update();
		this.player2.update();
		//update Ball
		if (this.gameStatus == statusPlaying) {
			this.ball.update();
		}
	}

	render() {
		//render background
		this.context.fillStyle = backgroundColor;
		this.context.fillRect(0, 0, this.width, this.height);

		//text
		this.context.fillStyle = voregroundColor;
		//game name
		this.context.textAlign = "center";
		this.context.textBaseline = "top";
		var fontSizeFactor = (((this.canvas.height / this.canvas.width) * 15) > 3 ? ((this.canvas.height / this.canvas.width) * 5) : 3 );
		this.context.font =  (this.canvas.height / fontSizeFactor) / 3 + "px Courier New";
		this.context.fillText("pong.tobiasbohn.com", this.canvas.width / 2, 0);
		//game id
		this.context.textAlign = "right";
		this.context.font =  (this.canvas.height / fontSizeFactor)  / 3 + "px Courier New";
		this.context.fillText("ID: " + this.gameId + " ", this.canvas.width / 2, this.canvas.height / (fontSizeFactor * 2.5));
		//game key
		this.context.textAlign = "left";
		this.context.fillText(" KEY: " + this.gameKey, this.canvas.width / 2, this.canvas.height / (fontSizeFactor * 2.5));
		//player1
		this.context.textAlign = "left";
		this.context.textBaseline = "bottom";
		this.context.fillText(this.inputs[0], 0, this.canvas.height);
		this.context.fillText(this.player1.score, 0, this.canvas.height - (this.canvas.height / fontSizeFactor / 2))
		//player2
		this.context.textAlign = "right";
		this.context.fillText(this.inputs[2], this.canvas.width, this.canvas.height);
		this.context.fillText(this.player2.score, this.canvas.width, this.canvas.height - (this.canvas.height / fontSizeFactor / 2))

		//render player
		this.player1.render();
		this.player2.render();

		//render ball
		if (this.gameStatus == statusPlaying) {
			this.ball.render();
		} else {
			this.context.textBaseline = 'center';
			this.context.textAlign = 'center';
			this.context.fillText(this.gameStatus, this.width / 2, this.height / 2);
		}

	}

	restartGame(timer) {
		this.gameStatus = statusStarting;
		if (startTimer != null) {
			clearInterval(startTimer);
		}
		timer = timer == null ? 12 : timer + 2;

		//reset all parameters, including the score
		this.resetParameters();
		this.prevPlayer1 = this.inputs[0];
		this.prevPlayer2 = this.inputs[2];

		//start timer
		var timeleft = timer;
		var that = this;
		startTimer = setInterval(function(){
			timeleft -= 1;
			that.gameStatus = statusStarting + ': ' + (timeleft - 1).toString();
			if(timeleft <= 0) {
				clearInterval(startTimer);
				that.restartRound('right');
			}
		}, 1000);
	}

	resetParameters() {
		this.player1.y = this.height / 2;
		this.player2.y = this.height / 2;
		this.player1.score = 0;
		this.player2.score = 0;
		this.player1.speed = 0;
		this.player2.speed = 0;
		this.ball.x = this.height / 2;
		this.ball.y = this.width / 2;
		this.ball.def_speed = this.width / ballSpeedFactor;
	}

	restartRound(startDirection) {
		this.gameStatus = statusStarting;

		//reset only position parameters of ball
		if (startDirection == 'left'){
			this.ball.x_speed = this.ball.def_speed * -1;
		} else if (startDirection == 'right') {
			this.ball.x_speed = this.ball.def_speed;
		} else {
			this.ball.x_speed = this.ball.x <= this.width / 2 ? this.ball.def_speed : this.ball.def_speed * -1;
		}
		this.ball.y_speed = ((Math.random() - 0.5) * 20 * (this.ball.def_speed / ballSpeedIncreasFactor));
		this.ball.speedIncreas = 0;
		this.ball.x = this.width / 2;
		this.ball.y = this.height / 2;

		//start round
		this.gameStatus = statusPlaying;
	}

	checkScore(forceEnd) {
		//console.log(this.player1.score, this.player2.score);
		if (forceEnd == null) {
			forceEnd = false;
		}
		if (forceEnd == false && this.player1.score >= pointsToWin) {
			this.gameStatus = 'player 1 win!';
			this.endGame(null, true);
		} else if (forceEnd == false && this.player2.score >= pointsToWin) {
			this.gameStatus = 'player 2 win!';
			this.endGame(null, true);
		} else if (forceEnd == true && this.player1.score > this.player2.score) {
			this.gameStatus = 'player 1 win!';
			this.endGame();
		} else if (forceEnd == true && this.player1.score < this.player2.score) {
			this.gameStatus = 'player 2 win!';
			this.endGame();
		} else if (forceEnd == true && this.player1.score == this.player2.score) {
			this.gameStatus = 'draw!';
			this.endGame();
		} else {
			this.restartRound();
		}
	}

	checkRuntime() {
		//player joins while game is running
		if (((this.prevPlayer1 != this.inputs[0] && this.prevPlayer1 == 'no player') || (this.prevPlayer2 != this.inputs[2] && this.prevPlayer2 == 'no player')) && this.gameStatus == statusPlaying) {
			this.checkScore(true);
		//player joins while game is starttung
		} else if (((this.prevPlayer1 != this.inputs[0] && this.prevPlayer1 == 'no player') || (this.prevPlayer2 != this.inputs[2] && this.prevPlayer2 == 'no player')) && this.gameStatus.includes(statusStarting)) {
			this.restartGame();
		//player1 leaves, but one player left
		} else if (this.prevPlayer1 != this.inputs[0] && this.inputs[0] == 'no player' && this.inputs[2] != 'no player') {
			this.prevPlayer1 = 'no player';
		//player2 leaves, but one player left
		} else if (this.prevPlayer2 != this.inputs[2] && this.inputs[2] == 'no player' && this.inputs[0] != 'no player') {
			this.prevPlayer2 = 'no player';
		//game is running but no player is connected
		} else if (this.inputs[0] == 'no player' && this.inputs[2] == 'no player' && this.gameStatus != statusWaiting) {
			this.endGame(0);
		//player are online waiting for game start
		} else if ((this.inputs[0] != 'no player' || this.inputs[2] != 'no player') && this.gameStatus == statusWaiting) {
			this.restartGame();
		}
	}

	endGame(timer, kick) {
		if (endTimer != null) {
			clearTimeout(endTimer);
		}
		if (startTimer != null) {
			clearInterval(startTimer);
		}

		timer = timer == null ? 5000 : timer * 1000;
		if (kick == true) {
			//kick players ----------------------------------------------------------------------------------------------------
			this.prevPlayer1 = 'no player';
			this.prevPlayer2 = 'no player';
		}
		this.resetParameters();

		var that = this;
		endTimer = setTimeout(function() {
			that.gameStatus = statusWaiting;
		}, timer);
	}

	newSize(w, h, i1, i2) {
		this.width = w;
		this.height = h;
		this.canvas.width = w;
		this.canvas.height = h;

		this.player1.x = (this.height / playerWidthFactor);
		this.player1.y = ((this.height * i1 / 100) * -1) + this.height;
		this.player1.w = (this.height / playerWidthFactor);
		this.player1.h = (this.height / playerHeightFactor);

		this.player2.x = (this.width - (this.height / playerWidthFactor));
		this.player2.y = ((this.height * i2 / 100) * -1) + this.height;
		this.player2.w = (this.height / playerWidthFactor);
		this.player2.h = (this.height / playerHeightFactor);

		this.ball.r = (h / ballSizeFactor);
		this.ball.w = (w);
		this.ball.def_speed = this.width / ballSpeedFactor;

		var oldStatus = this.gameStatus;
		this.restartRound();
		this.gameStatus = oldStatus;
	}
}


class Player{
	constructor(x, parent) {
		this.x = x;
		this.parent = parent;
		this.y = this.parent.height / 2;
		this.w = this.parent.height / playerWidthFactor;
		this.h = this.parent.height / playerHeightFactor;
		this.speed = 0;
		this.score = 0;
	}

	update() {
		//define input
		var inputInPx = this.parent.height / 2;
		if (this.x < this.parent.width / 2 && this.parent.inputs[0] != 'no player') {
			//left player is human
			inputInPx = this.parent.height * this.parent.inputs[1] / 100; //from percent in pixel
			inputInPx = (inputInPx * -1) + this.parent.height; //from bottom:0 top:canvas-height to top:0 bottom:canvas-height
		} else if (this.x > this.parent.width / 2 && this.parent.inputs[2] != 'no player') {
			//right player is human
			inputInPx = this.parent.height * this.parent.inputs[3] / 100; //from percent in pixel
			inputInPx = (inputInPx * -1) + this.parent.height; //from bottom:0 top:canvas-height to top:0 bottom:canvas-height
		} else {
			//is computer
			//console.log(this.parent.gameStatus);
			if (this.parent.gameStatus == statusPlaying) {
				var ballPos = this.parent.ball.y;
				if (this.y > ballPos || this.y < ballPos) {
					inputInPx = ballPos;
				}
			}
			else {
				inputInPx = this.parent.height / 2;
			}
		}

		//define movement speed
		var moveStep = this.parent.height / playerSpeedFactor;

		//move player
		if (this.y < inputInPx - (moveStep * 2)) {
			this.speed = +1;
			this.y += moveStep * 60.0 * deltaTime;
		} else if (this.y > inputInPx + (moveStep * 2)) {
			this.speed = -1;
			this.y -= moveStep * 60.0 * deltaTime;
		} else {
			this.speed = 0;
		}
	}

	render() {
		this.parent.context.fillStyle = voregroundColor;
		var y = ((this.y - (this.parent.height / 2)) * -1);
		y = (this.y + (y * (this.h / this.parent.height)));
		this.parent.context.fillRect(this.x - (this.w / 2), y -(this.h / 2), this.w, this.h);
	}
}

class Ball{
	constructor(parent) {
		this.parent = parent;
		this.x = this.parent.width / 2;
		this.y = this.parent.height / 2;
		this.r = this.parent.height / ballSizeFactor;
		this.def_speed = this.parent.width / ballSpeedFactor;
		this.x_speed = this.def_speed;
		this.y_speed = ((Math.random() - 0.5) * 20 * (this.def_speed / ballSpeedIncreasFactor));
		this.speedIncreas = 0;
	}

	update() {
		//console.log(this.x, this.y, this.def_speed, this.x_speed, this.y_speed, this.speedIncreas);
		this.x += this.x_speed * 60.0 * deltaTime;
		this.y += this.y_speed * 60.0 * deltaTime;
		var left = this.x - this.r;
		var top = this.y - this.r;
		var right = this.x + this.r;
		var bottom = this.y + this.r;

		var player1realPos = ((this.parent.player1.y - (this.parent.height / 2)) * -1);
		player1realPos = (this.parent.player1.y + (player1realPos * (this.parent.player1.h / this.parent.height)));
		var player2realPos = ((this.parent.player2.y - (this.parent.height / 2)) * -1);
		player2realPos = (this.parent.player2.y + (player2realPos * (this.parent.player2.h / this.parent.height)));

		//if Ball hits upper border
		if (this.y - this.r < 0) {
			this.y = this.r;
			this.y_speed = -this.y_speed;
		//if ball hits lower border
		} else if (this.y + this.r > (this.r * ballSizeFactor)) {
			this.y = (this.r * (ballSizeFactor - 1));
			this.y_speed = -this.y_speed;
		}

		//if left or right wall hit
		if (this.x < 0 || this.x > this.parent.width) {
			if (this.x < 0) {
				this.parent.player2.score++;
			} else {
				this.parent.player1.score++;
			}
			this.parent.checkScore();
		}

		//if player hit
		if (this.x < (this.parent.width / 2)) {
			if (left < (this.parent.player1.x + (this.parent.player1.w / 2)) && right > (this.parent.player1.x - (this.parent.player1.w / 2)) && bottom > (player1realPos - (this.parent.player1.h / 2)) && top < (player1realPos + (this.parent.player1.h / 2))) {

				this.speedIncreas += this.def_speed / ballSpeedIncreasFactor;
				this.y_speed += this.parent.player1.speed + ((Math.random() - 0.5) * 5 * (this.def_speed / ballSpeedIncreasFactor));
				this.x_speed = this.def_speed + this.speedIncreas;
				this.x += this.x_speed;
			}
		} else {
			if (right > (this.parent.player2.x - (this.parent.player2.w / 2)) && left < (this.parent.player2.x + (this.parent.player2.w / 2)) && bottom > (player2realPos - (this.parent.player2.h / 2)) && top < (player2realPos + (this.parent.player2.h / 2))) {
				this.speedIncreas += this.def_speed / ballSpeedIncreasFactor;
				this.y_speed += this.parent.player2.speed + ((Math.random() - 0.5) * 5 * (this.def_speed / ballSpeedIncreasFactor));
				this.x_speed = -(this.def_speed + this.speedIncreas);
				this.x += this.x_speed;
			}
		}
	}

	render() {
		this.parent.context.fillStyle = voregroundColor;
		this.parent.context.fillRect((this.x - this.r), (this.y - this.r), (this.r * 2), (this.r * 2));
	}
}
