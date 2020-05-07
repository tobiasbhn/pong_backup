var fs = require('fs');
var https = require('https');
var express = require('express');
var app = express();

var options = {
	key: fs.readFileSync('/etc/letsencrypt/live/pong.tobiasbohn.com/privkey.pem', 'utf-8'),
	cert: fs.readFileSync('/etc/letsencrypt/live/pong.tobiasbohn.com/cert.pem', 'utf-8')
};
var server = https.createServer(options, app);
var io = require('socket.io').listen(server);
server.listen(3000);
console.log('Server started and listening on Port: 3000\n');

var Game = require('./game.js');
var games = [];
var sockets = [];

//on connection
io.on('connection', function(socket){
	console.log('connect: ' + socket.id);
	//introducion of the new user
	socket.on('introduce', function(msg, fn){
		//get information, what kind of user the new client is and what the intention of the new user is
		//if someone hosts a game
		console.log('introduce');
                if (msg[0] == 'host') {
			var game = new Game(socket.id, msg[1], msg[3], msg[2]);
			games.push(game);
			sockets.push([socket.id, 'host', msg[3]]);
			console.log("A new game-host connected. ID: " + socket.id + "\n.....Connected Hosts(total): " + games.length + "\n.....Connected Players(total): " + (sockets.length - games.length) + "\n.....Game ID: " + msg[3] + "\n.....Game Key: " + msg[2] + "\n.....Players in this Game: " + game.getPlayerNum() + "\n\n");
		}
		//if someone plays a game
		else if (msg[0] == 'play') {
			var game;
			//if game exists
			if (game = getGame(msg[2])) {
				console.log("right GameID");
				//if key is right
				if (game.getKey() == msg[3]) {
					console.log("right GameKey");
					//join
					var queuePos = game.addPlayer(socket.id, msg[1]);
					if (queuePos == -1) {
						socket.emit('update', ['play', '']);
					} else {
						socket.emit('update', ['queue', queuePos]);
					}
					sockets.push([socket.id, 'play', msg[2]]);
					console.log("A new Player connected. ID: " + socket.id + "\n.....Connected Hosts(total): " + games.length + "\n.....Connected Players(total): " + (sockets.length - games.length) + "\n.....Game ID: " + msg[2] + "\n.....Players in this Game: " + game.getPlayerNum() + "\n\n");
				} else {
					//wrang key
					console.log("Wrong Key: " + msg[3]);
					fn('3');
				}
			} else {
				//wrong id
				console.log("wrong ID: " + msg[2]);
				fn('4');
			}
		}
	});

	//on Input Update
	socket.on('inputUpdate', function(msg){
		//msg = [gameId, playerName, Input]
		var game;
		if (game = getGame(msg[0])) {
			//update the new input to the game instance
			//console.log(msg[1]);
			if (game.updateInput(socket.id, msg[1], msg[2])) {
				//send the inputs of both players to the host
				socket.to(game.getOwner()).emit('inputUpdate', game.getInputs());
				//console.log('new input: ' + msg[1]);
			} else {
				//console.log("ERROR. update input error");
			}
		} else {
			//console.log("ERROR: game not found");
		}
	});

	socket.on('kickPlayers', function(msg){
		//msg = game-ID
		var game;
		var players;
		if (game = getGame(msg)) {
			players = game.getPlayers();
			if (players.length > 0 && players[0] != 'free') {
				game.deletePlayer(players[0][0]);
			}
			if (players.length > 1) {
				game.deletePlayer(players[1][0]);

			}
		}
	});

	//on disconnection
	socket.on('disconnect', function(){
		var disconnSocket = isPlayer(socket.id); //return = [true, game-id](Player), [false, game-id](Host) or [false,false](not in socket list)
		if (disconnSocket[1] !== false) { //discon. socket is in list
			var game = getGame(disconnSocket[1]);
			if (game == false) {
				return;
			}

			//delet the disconnected socket out of the sockets array
			sockets.remove(returnSocketsIndex(socket.id));

			//check if disconnected socket is player or host
			if (disconnSocket[0]) {
				//is player
				var updatedQueue = game.deletePlayer(socket.id);
				if (updatedQueue !== false) {
					updateQueue(socket, updatedQueue);
				}
				socket.to(game.getOwner()).emit('inputUpdate', game.getInputs());
				console.log("A Player disconnected. ID: " + socket.id + "\n.....Connected Hosts(total): " + games.length + "\n.....Connected Players(total): " + (sockets.length - games.length) + "\n.....Game ID: " + game.getId() + "\n.....Players left in this Game: " + game.getPlayerNum() + "\n\n");
				delete updatedQueue;
			} else {
				//is host
				var kickedIDs = game.deleteGame(); //deleteGame() return = array[of, kicked, ids] || false
				var conPlayers = (kickedIDs == false) ? (sockets.length - (games.length - 1)) : (sockets.length - kickedIDs.length - (games.length - 1));
				var numKickedPlayers = (kickedIDs == false) ? '0' : kickedIDs.length;
				console.log("A Host disconnected. ID: " + socket.id + "\n.....Connected Hosts(total): " + (games.length - 1) + "\n.....Connected Players(total): " + conPlayers + "\n.....Game ID: " + game.getId() + "\n.....The Players in the game(" + numKickedPlayers + ") were kicked and notified.\n\n");
				//console.log(games);
				if (kickedIDs != false) {
					if (manageLostPlayers(socket, kickedIDs)) { //manageLostPlayers return true when finnished
						//delete game from games array
						games.remove(returnGamesIndex(game.getId()));
					}
				} else {
					games.remove(returnGamesIndex(game.getId()));
				}
				//console.log(games);
				delete kickedIDs;
				delete conPlayers;
			}
			delete game;
		}
		delete disconnSocket;
	});
});

function manageLostPlayers(socket, lostPlayers) {
	for (s = 0; s < lostPlayers.length; s++) {
		sockets.remove(returnSocketsIndex(lostPlayers[s]));
		socket.to(lostPlayers[s]).emit('update', ['closed', '']);
	}
	return true;
}

function returnGamesIndex(gameID) {
	for (g = 0; g < games.length; g++){
		if (games[g].getId() == gameID) {
			return g;
		}
	}
	return '';
}

function returnSocketsIndex(socketID) {
	for (u = 0; u < sockets.length; u++){
		if (sockets[u][0] == socketID) {
			return u;
		}
	}
	return '';
}


function updateQueue(socket, updatedQueue) {
	for (i = 0; i < updatedQueue.length; i++) {
		if (updatedQueue[i][1] < 1) {
			//new player
			//console.log("Updated Player " + updatedQueue[i][0] + " to play");
			socket.to(updatedQueue[i][0]).emit('update', ['play', '']);
		} else {
			//update queue
			//console.log("Updated Player " + updatedQueue[i][0] + " to queue pos " + updatedQueue[i][1]);
			socket.to(updatedQueue[i][0]).emit('update', ['queue', updatedQueue[i][1]]);
		}
	}
}

function isPlayer(id) {
	for (i = 0; i < sockets.length; i++) {
		if (sockets[i][0] == id) {
			if (sockets[i][1] == 'play') {
				//is player: return true and game-id
				return [true, sockets[i][2]];
			} else if (sockets[i][1] == 'host') {
				//is host: return false and game-id
				return [false, sockets[i][2]];
			}
		}
	}
	return [false, false];
}

function getGame(id) {
	for (i = 0; i < games.length; i++) {
		if (games[i].getId() == id) {
			return games[i];
		}
	}
	return false;
}

Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};
