function startGame(playerCount, game) {

	var i = 0;
	var players = [];
	var x01Template = $('.x01-darts-tml');
	var gameContainer = $('.row.game');

	// create player containers
	while (i < playerCount) {
		var selector = 'd-player' + (i + 1).toString();
		var p = {
				name: 'Player' + (i + 1).toString(),
				container: '.' + selector
			};
		
		var playerTml = x01Template.clone().removeClass('x01-darts-tml').addClass('x01-darts');
		playerTml.find('>div').addClass(selector);
		gameContainer.append(playerTml);
		players.push(p);
		i += 1;
	}
	console.log('players ', players);

	var activePlayerInd = 0;
	var onSaveDarts = function (container, points) {
		if (points === 0) {
			alert(players[activePlayerInd].name + ' WON!');
			activePlayerInd = -1;
			next();
		}

		if (activePlayerInd < players.length - 1) {
			activePlayerInd += 1;
		} else {
			activePlayerInd = 0;
		}

		next();
	};

	function start() {
		x01Template.hide();
		$.each(players, function(i, item) {
			console.log('init player ', item);
			var player = new KDarts(game);
			player.init(item.name, item.container, onSaveDarts);
		});
	}

	function next() {
		$.each(players, function(i, item) {
			var selector = item.container;
			if (i != activePlayerInd) {
				$(selector + ' input.point-editor').attr('disabled', true);
				$(selector + ' a').attr('disabled', true);
				$(selector).removeClass('active-player');
			} else {
				$(selector + ' input.point-editor').attr('disabled', false);
				$(selector + ' a').attr('disabled', false);
				$(selector + ' input.point-editor').focus();
				$(selector).addClass('active-player');
			}
		});
	}

	start();
	next();
}
