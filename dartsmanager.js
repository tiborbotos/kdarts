(function() {

	var players = [
		{
			name: 'Randall',
			container: '.player1'
		},
		{
			name: 'Kugli',
			container: '.player2'
		},
	];

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
		$.each(players, function(i, item) {
			var player = new KDarts();
			player.init(item.name, item.container, onSaveDarts);
		});
	}

	function next() {
		$.each(players, function(i, item) {
			var selector = item.container;
			if (i != activePlayerInd) {
				$(selector + ' input.point-editor').attr('disabled', true);
				$(selector + ' a').attr('disabled', true);
			} else {
				$(selector + ' input.point-editor').attr('disabled', false);
				$(selector + ' a').attr('disabled', false);
				$(selector + ' input.point-editor').focus();
			}
		});
	}

	start();
	next();
})();