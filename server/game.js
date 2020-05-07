// Initializing a class definition
class Game {
	constructor(owner, name, id, key) {
		this.owner = owner;
		this.name = name;
		this.id = id;
		this.key = key;
		this.players = [];
	}

	getOwner() {
		return this.owner;
	}

	getId() {
		return this.id;
	}

	getKey() {
		return this.key;
	}

	getPlayers() {
		return this.players;
	}

	getPlayerNum() {
		if (this.players[0] == 'free') {
			return (this.players.length - 1);
		} else {
			return this.players.length;
		}
	}

	addPlayer(id, name) {
		if (this.players[0] != 'free') {
			this.players.push([id, name, 50]);
		} else {
			this.players[0] = [id, name, 50];
		}
		if (this.players.length < 3) {
			return -1;
		} else {
			return this.players.length - 2;
		}
	}

	updateInput(id, name, val) {
		if (this.players.length > 0 && this.players[0][0] == id) {
			this.players[0][1] = name;
			this.players[0][2] = val;
			return true;
		} else if (this.players.length > 1 && this.players[1][0] == id) {
			this.players[1][1] = name;
			this.players[1][2] = val;
			return true;
		} else { //something went wrong: new input available for player that is currently in queue
			return false;
		}
	}

	getInputs() {
		var inputs = [];
		//console.log(this.players);
		if (this.players.length > 0) {
			if (this.players[0] == 'free') {
				//no player in players[0]
				inputs[0] = 'no player';
				inputs[1] = 50;
			} else {
				//player in players[0]
				inputs[0] = this.players[0][1];
				inputs[1] = this.players[0][2];
			}
		} else {
			//no player in players[0]
			inputs[0] = 'no player';
			inputs[1] = 50;
		}
		if (this.players.length > 1) {
			//player in players[1]
			inputs[2] = this.players[1][1];
			inputs[3] = this.players[1][2];
		} else {
			//no player in players[1]
			inputs[2] = 'no player';
			inputs[3] = 50;
		}
		return inputs;
	}

	deletePlayer(id) {
		//console.log("\n\nDelete Player function called for: " + id + "\n");
		var updatedQueue = [];
		var isPosDifferent = false;
		//get player index in array
		//console.log("this.players(bevor):");
		//console.log(this.players);
		//console.log("\n\n");
		for (i = 0; i < this.players.length; i++) {
			//console.log("loop round: " + i);
			//first player in array leaves ant this is the player
			if ((this.players[i][0] == id) && (i == 0)) {
				// 0  1  2 | 3   4  5  6...
				//    |  | |/   /  /  /
				// |--+--| /   /  /  /  /
				// |  |   /|  /  /  /
				// 2  1  3 | 4  5  6...
				//(0)(1)(2) (3)(4)(5)

				//player2 [index 1] is still player2 [index 1] (otherwise player2 would switch sides)
				//first in queue is future player1
				//all other players slip one forward
				//console.log("\n\n deleted player was first player");
				if (this.players.length > 2) {
					this.players[0] = this.players[2];
					updatedQueue.push([this.players[0][0], -1]);
					isPosDifferent = true;
					//console.log("...set players[0] = players[2] and pushed new player[0] to update");
					//console.log("...isPosDif = true");
					//console.log(this.players);
					//console.log("\n\n");
				} else {
					this.players[0] = 'free';
					//console.log("...players[0] = free");
					//console.log(this.players);
					//console.log("\n\n");
				}
			}

			//second player in array leaves and this is the player
			else if ((this.players[i][0] == id) && (i == 1)) {
				// 0 1   2 | 3   4  5  6...
				// |    /  |/   /  /  /
				// |   /   /   /  /  /
				// |  /   /|  /  /  /
				// 0 2   3 | 4  5  6...
				//player1 [index 0] is still player1 [index 0] (otherwise player1 would switch sides)
				//all other players slip one forward
				//console.log("\n\n deleted player was second player");
				if (this.players.length > 2) {
					this.players[1] = this.players[2];
					updatedQueue.push([this.players[1][0], 0]);
					isPosDifferent = true;
					//console.log("...set players[1] = players[2] and pushed new player[0] to update");
					//console.log("...isPosDif = true");
					//console.log(this.players);
					//console.log("\n\n");
				} else {
					this.players.pop();
					//console.log("...poped this.players");
					//console.log(this.players);
					//console.log("\n\n");
				}
			}

			//player in queue leaves and this is the player
			else if ((this.players[i][0] == id) && (i > 1)) {
				isPosDifferent = true;
				//console.log("...isPosDif = true\n\n");
			}

			//player in queue already leaved but this is NOT the leaving player, this player is in queue
			if ((i > 1) && isPosDifferent) {
				//console.log("\n\n slip players forward");
				if (this.players.length > i + 1) {
					this.players[i] = this.players[(i + 1)];
					updatedQueue.push([this.players[i][0], i - 1]);
					//console.log("players[" + i + "] = players[" + i + " + 1] and pushed new player[" + i + "] to update");
					//console.log(this.players);
					//console.log("\n\n");
				} else {
					this.players.pop();
					//console.log("...poped this.players");
					//console.log(this.players);
					//console.log("\n\n");
				}
			}
		}
		//console.log("\n\nclosed loop. results:");
		//console.log(this.players);
		//console.log(updatedQueue);
		if (updatedQueue.length > 0) {
			console.log("deletet player. return: " + updatedQueue);
			return updatedQueue;
		} else {
			console.log("deletet player. return: false");
			return false;
		}
	}

	deleteGame(){
		var ret = [];
		for (i = 0; i < this.players.length; i++) {
			if (this.players[i] != 'free') {
				ret.push(this.players[i][0]);
			}
		}
		if (ret.length != 0) {
			return ret;
		} else {
			return false;
		}
	}
}
module.exports = Game;
