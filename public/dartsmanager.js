var keyboardManager = {
	isMobile: false,
	activeEditor: null,
	activePlayer: null,

	init: function () {
		var self = this;

		$('.keyboard').show();
		$('.keyboard .button').click(function (event) {
			var key = $(event.currentTarget).attr('data-key');
			if (key === 'delete') {
				self.activeEditor.val(self.activeEditor.val().substring(0, self.activeEditor.val().length - 1));
				self.activePlayer.update();
			} else if (key === 'enter') {
				self.activePlayer.save();
			} else {
				if (key === 'b' || key === 'db') {
					key = ' ' + key + ' ';
				}
				self.activeEditor.val(self.activeEditor.val() + key);
				self.activePlayer.update();
			}
		});

		$('.keyboard .button').click(function (event) {
			var target = $(event.currentTarget);
			target.addClass('clicked');
			setTimeout(function () {
				target.removeClass('clicked');
			}, 200);
		});
	}
};

var dartsManager = {
	players: [],
	round: 1,
	matchId: '',
	activePlayerInd: 0,
	timer: null,
	gameStarted: null,
	inGame: false,

	_createPlayers: function (playerCount) {
		this.players = [];
		var x01Template = $('.x01-darts-tml'),
			gameContainer = $('.row.game'),
			self = this,
			users = userManager.getPlayers(),
			i = 0,
			player,
			selector;
		
		this.matchId = Math.floor(Math.random() * 10000000).toString();
		while (i < playerCount) {
			if (i < users.length) {
				user = users[i];
			} else { // fake user
				user = {
					username: 'Player ' + (i + 1).toString()
				};
				if ($('.js_player' + (i + 1) + '-name').val().trim() !== '') {
					user.username = $('.js_player' + (i + 1) + '-name').val();
				}
			}
			
			selector = 'd-player' + (i + 1).toString();
			player = {
				name: user.username,
				container: '.' + selector,
				user: user
			};
			gameContainer.append(createTemplate(selector));
			self.players.push(player);
			i += 1;
		}

		function createTemplate(selector) {
			var playerTml = x01Template.clone().removeClass('x01-darts-tml').addClass('x01-darts');
			playerTml.find('>div').addClass(selector).parent().addClass('dart-player-instance').show();
			return playerTml;
		}
	},

	_zeroEx: function (n) {
		if (n > 0) {
			if (n < 10) {
				return '0' + n;
			} else {
				return n.toString();
			}
		} else {
			return '00';
		}
	},

	_start: function (game) {
		var self = this;

		this.round = 0;
		this.activePlayerInd = 0;
		this.inGame = true;
		$('.x01-darts-tml').hide();
		$.each(this.players, function(i, item) {
			console.log('init player ', item);
			if (item.user.initStats) {
				item.user.initStats(self.matchId, self.game);
			}
			item.player = new KDarts(game);
			item.player.init(item.name, item.container, self.onSaveDarts, self);
		});
		$('.game-info').text('KDarts ' + game);
		$('.js_welcome-navbar').hide();
		$('.js_x01-navbar').show();
		$('.js_abort-game').show().click(function () {
			if (confirm('Are you sure you want to abort this game? All data will be lost!')) {
				self.closePlay();
			}
		});
		this._initTimer();
	},

	_initTimer: function () {
		var self = this;
		$('.js_timer').text('00:00').show();
		this.gameStarted = Math.floor((new Date()).getTime() / 1000);
		this.timer = setInterval(function () {
			var now = Math.floor((new Date()).getTime() / 1000),
				elapsed = now - self.gameStarted,
				elapsedMins = Math.floor(elapsed / 60),
				elapsedSec = elapsed - (elapsedMins * 60),
				elapsedT = self._zeroEx(elapsedMins) + ':' + self._zeroEx(elapsedSec);
			$('.js_timer').text(elapsedT);
		}, 1000);
	},

	winner: function (player) {
		var self = this;
		clearInterval(this.timer);
		this.inGame = false;

		$('.js_abort-game').hide();
		$('.js_winner-navbar').show();
		$('.js_winner-navbar .name').text(player.name + ' won!');

		$('#playagain').click(function () {
			$.each(self.players, function (i, item) {
				item.player.reset();
			});
			self.activePlayerInd = 0;
			self._initTimer();
			$('.js_winner-navbar').hide();
			$('.js_abort-game').show();
			self.inGame = true;
			self.next();
		});

		$.each(this.players, function (i, player) {
			if (player.user.savePoints) {
				player.user.savePoints();
			}
		});

		$('#closeplay').click(this.closePlay.bind(this));
	},

	closePlay: function () {
		clearInterval(this.timer);
		this.inGame = false;

		$('.row.game .dart-player-instance').remove();
		$('.row.game').hide(350);
		$('.row.manager').show(250);
		$('.js_winner-navbar').hide();
		$('.js_x01-navbar').hide();
		$('.js_welcome-navbar').show();
	},

	onSaveDarts: function (container, points, editorPoints) {
		var player = this.players[this.activePlayerInd],
			user = player.user;

		if (user.registerPoints) {
			user.registerPoints(editorPoints, this.round, points);
		}

		if (points === 0) {
			this.winner(player);
		} else {
			if (this.activePlayerInd < this.players.length - 1) {
				this.activePlayerInd += 1;
			} else {
				this.activePlayerInd = 0;
			}

			this.next();
		}
	},

	next: function () {
		var self = this,
			player;
		if (this.activePlayerInd === 0) {
			this.round += 1;
		}

		$.each(this.players, function(i, item) {
			var selector = item.container;
			if (i != self.activePlayerInd) {
				$(selector + ' input.point-editor').attr('disabled', true);
				$(selector + ' a').attr('disabled', true);
				$(selector).removeClass('active-player');
			} else {
				var activeEditor = $(selector + ' input.point-editor');
				keyboardManager.activeEditor = activeEditor;
				keyboardManager.activePlayer = self.players[i].player;
				activeEditor.attr('disabled', false);
				$(selector + ' a').attr('disabled', false);
				if (!keyboardManager.isMobile) {
					$(selector + ' input.point-editor').focus();
				}
				$(selector).addClass('active-player');
			}
		});
	},

	create: function (playerCount, game) {
		this.game = game;

		this._createPlayers(playerCount);
		this._start(game);
		this.next();

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			keyboardManager.isMobile = true;
			keyboardManager.init();
		}

	}
};
