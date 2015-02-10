function User(playerIndex, user, sessionId) {
	this.playerIndex = playerIndex;
	this.sessionId = sessionId;
	this.user = user;
	this.username = user.username;
	this.sessionTimer = setInterval(updateSession.bind(this), 1000 * 60 * 5);

	this.logout = function () {
		this.sessionId = '';
		updateSession.call(this);
		clearInterval(this.sessionTimer);
	};

	this.stats = {};

	this.initStats = function (matchId, game) {
		this.stats = {
			userid: this.user.id,
			matchid: matchId,
			started: +new Date(),
			shots: [],
			game: game
		};
	};

	this.registerPoints = function (editorPoints, round, remainingpoints) {
		var self = this;
		if (remainingpoints === 0 && userManager.playerCount() > 1) {
			this.stats.winner = true;
		}
		this.stats.shots.push({
			points: editorPoints.points,
			round: round,
			shot1: editorPoints.rawshots[0],
			shot2: editorPoints.rawshots[1],
			shot3: editorPoints.rawshots[2]
		});
	};

	this.savePoints = function (matchId) {
		var save = this.stats,
			i,
			avg9 = 0;
		for (i = 0; i < 3 && i < this.stats.shots.length; i++) {
			avg9 += this.stats.shots[i].points;
		}
		save.avg9 = avg9 / 3;
		save.avg = this.stats.game / this.stats.shots.length;

		dpd.stats.post(save, function (result, err) {
			if (err) {
				console.log('Error during stat saving :(', err);
			} else {
				console.log('Saved successfully!', result);
			}
		});
	};

	function updateSession() {
		console.log('updateSession');
		var self = this;

		dpd.users.get(this.user.id, function (loginUser, loginError) {
			dpd.users.put({id: user.id, sessionrenew: self.sessionId}, loginUser, function (result, err) {
				if (err) {
					console.log('Error during session update!', err);
				} else {
					self.sessionId = result.sessionid;
					console.log('Session updated!', result);
				}
			});
		});
	}
}

var userManager = {
	players: {},

	login: function (playerInd, user, sessionId) {
		this.players[playerInd] = new User(playerInd, user, sessionId);
	},

	logout: function (playerInd) {
		this.players[playerInd].logout();
		delete this.players[playerInd];
	},

	isLoggedIn: function (playerName) {
		var found = false;
		$.each(this.players, function (i, player) {
			if (player.user.username.toUpperCase() === playerName.toUpperCase()) {
				found = true;
			}
		});
		return found;
	},

	playerCount: function () {
		var count = 0;
		for(var key in this.players) {
			count += 1;
		}
		return count;
	},

	getPlayers: function () {
		var res = [];
		$.each(this.players, function (i, player) {
			res.push(player);
		});
		return res;
	}
};