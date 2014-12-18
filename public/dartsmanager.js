var keyboardManager = {
	activeEditor: null,
	activePlayer: null,
	init: function () {
		var self = this;

		$('.keyboard .button').show().click(function (event) {
			var key = $(event.currentTarget).attr('data-key');
			if (key !== 'delete') {
				if (key === 'b' || key === 'db') {
					key = ' ' + key + ' ';	
				}
				self.activeEditor.val(self.activeEditor.val() + key);
			} else {
				self.activeEditor.val(self.activeEditor.val().substring(0, self.activeEditor.val().length - 1));
			}
			self.activePlayer.update();
		});
	}
};

var dartsManager = {
	players: [],
	activePlayerInd: 0,
	timer: null,
	gameStarted: null,
	inGame: false,

	_createPlayers: function (playerCount) {
		var i = 0,
			x01Template = $('.x01-darts-tml'),
			gameContainer = $('.row.game');

		// create player containers
		$('.x01-darts-tml').show();
		while (i < playerCount) {
			var selector = 'd-player' + (i + 1).toString();
			var p = {
					name: 'Player' + (i + 1).toString(),
					container: '.' + selector
				};
			
			var playerTml = x01Template.clone().removeClass('x01-darts-tml').addClass('x01-darts');
			playerTml.find('>div').addClass(selector).parent().addClass('dart-player-instance');
			gameContainer.append(playerTml);
			this.players.push(p);
			i += 1;
		}

		// set names
		$.each(this.players, function(i, item) {
			if ($('.player-name-' + (i + 1)).val() !== '') {
				item.name = $('.player-name-' + (i + 1)).val();
			}
		});
	},

	_setNames: function () {
		$.each(this.players, function(i, item) {
			if ($('.player-name-' + (i + 1)).val() !== '') {
				item.name = $('.player-name-' + (i + 1)).val();
			}
		});
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

		this.activePlayerInd = 0;
		this.inGame = true;
		$('.x01-darts-tml').hide();
		$.each(this.players, function(i, item) {
			console.log('init player ', item);
			item.player = new KDarts(game);
			item.player.init(item.name, item.container, self.onSaveDarts, self);
		});
		$('.game-info').text('KDarts ' + game);
		$('.js_welcome-navbar').hide();
		$('.js_x01-navbar').show();
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
		clearInterval(this.timer);
		this.inGame = false;

		$('.js_winner-navbar').show();
		var self = this;
		$('.js_winner-navbar .name').text(player.name + ' won!');
		$('#playagain').click(function () {
			$.each(self.players, function (i, item) {
				item.player.reset();
			});
			self.activePlayerInd = 0;
			self._initTimer();
			$('.js_winner-navbar').hide();
			self.inGame = true;
			self.next();
		});
		
		$('#closeplay').click(function () {
			$('.row.game .dart-player-instance').remove();
			$('.row.game').hide(350);
			$('.row.manager').show(250);
			$('.js_winner-navbar').hide();
			$('.js_x01-navbar').hide();
			$('.js_welcome-navbar').show();
		});
	},

	onSaveDarts: function (container, points, editorPoints) {
		if (points === 0) {
			this.winner(this.players[this.activePlayerInd]);
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
		var self = this;
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
				$(selector + ' input.point-editor').focus();
				$(selector).addClass('active-player');
			}
		});
	},

	create: function (playerCount, game) {
		var self = this;
		this.players = [];
		this.game = game;

		this._createPlayers(playerCount);
		this._setNames();
		this._start(game);

		this.next();
	}
};
