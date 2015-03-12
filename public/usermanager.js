function User(user, sessionId) {
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
			game: game,
			winner: false
		};
	};

	this.registerPoints = function (editorPoints, round, remainingpoints) {
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

	this.savePoints = function (winner) {
		var save = this.stats,
			i,
			c,
			avg9 = 0,
			shots,
			dartCount = 0,
			shotList,
			doubleOut = false,
			remainingPoints = this.stats.game,
			checkoutTries = 0;

		for (i = 0; i < 3 && i < this.stats.shots.length; i++) {
			avg9 += this.stats.shots[i].points;
		}

		// calculate out stats
		for (i = 0; i < this.stats.shots.length; i++) {
			shots = this.stats.shots[i],
			shotList = [KDartsHelper.editorItemToPoints(shots.shot1),
				KDartsHelper.editorItemToPoints(shots.shot2),
				KDartsHelper.editorItemToPoints(shots.shot3)];

			for (c = 0; c < shotList.length; c++) {
				if (!isNaN(Number(shotList[c]))) {
					dartCount += 1;
					if (doubleOut) {
						// TODO
					}
					else {
						if (remainingPoints <= 20 || remainingPoints === 25 || remainingPoints === 50) {
							checkoutTries +=1;
						}
					}

					remainingPoints -= shotList[c];
				}
			}

			if (shots.points === 180) {
				save.pointswith180 = (save.pointswith180 || 0) + 1;
			} else if (shots.points >= 140) {
				save.pointsover140 = (save.pointsover140 || 0) + 1;
			} else if (shots.points >= 100) {
				save.pointsover100 = (save.pointsover100 || 0) + 1;
			}
		}

		if (winner) {
			save.checkoutfrom = this.stats.shots[this.stats.shots.length - 1].points;
		}
		save.game = this.stats.game;
		save.checkoutshots = checkoutTries;
		save.avg9 = avg9 / 3;
		save.avg = (this.stats.game - remainingPoints) / this.stats.shots.length;
		save.winner = winner || false;
		save.dartcount = dartCount;

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
		this.players[playerInd] = new User(user, sessionId);
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