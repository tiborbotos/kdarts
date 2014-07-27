function KDarts() {

	var X01 = 301;
	var points = X01;
	var shots = [];
	var containerSelector;

	this.init = function (container) {
		containerSelector = container;

		$(containerSelector + ' .point-editor').keyup(genPoints);
		$(containerSelector + ' .save').click(savePoints);
		$(containerSelector).keydown(function(event){
			if(event.keyCode == 13) {
				event.preventDefault();
				savePoints();
				return false;
			}
		});
	};

	/**
	 * Generates the current state of the points, updates the remaining points
	 */
	function genPoints() {
		var editorPoints =_editorPoints();
		updateGenAndRemainginPosts(editorPoints);
	}

	/**
	 * Saves the points from the editor
	 */
	function savePoints() {
		var editorPoints = _editorPoints();
		if (!editorPoints.empty && !editorPoints.invalid) {
			saveAndUpdatePoints(editorPoints);
		}
	}


	function saveAndUpdatePoints(editorPoints) {
		// save points
		points -= editorPoints.points;
		shots.push(editorPoints);
		$(containerSelector + ' .current-points').text(points);
		$(containerSelector + ' .shot-list').append('<span title="' + editorPoints.rawshots + '">' + points + '</span>');

		// calc avg
		var sum = X01 - points;
		var avg = Math.round(sum / shots.length);
		$(containerSelector + ' .avg').text(avg);

		// cleanup
		$(containerSelector + ' .point-editor').val('');
		$(containerSelector + ' .gen-points').text('');
		$(containerSelector + ' .remaining-points').text('');
		$(containerSelector + ' .remaining-label').hide();
	}

	function updateGenAndRemainginPosts(editorPoints) {
		// updating remaining and generated points
		if (!editorPoints.empty) {
			$(containerSelector + ' .gen-points').text(editorPoints.points);

			if (points - editorPoints.points < 180) {
				$(containerSelector + ' .remaining-label').show();
				$(containerSelector + ' .remaining-points').text(points - editorPoints.points);
			} else {
				$(containerSelector + ' .remaining-label').hide();
				$(containerSelector + ' .remaining-points').text('');
			}

		} else {
			$(containerSelector + ' .gen-points').text('');
			$(containerSelector + ' .remaining-points').text('');
			$(containerSelector + ' .remaining-label').hide();
		}

		// handling errors
		if (editorPoints.invalid) {
			$(containerSelector + ' .points-editor-container').addClass('has-error');
		} else {
			$(containerSelector + ' .points-editor-container').removeClass('has-error');
		}

		// update out suggestions
		var outContainer = $(containerSelector + ' .out-suggestions');
		outContainer.children().remove();
		var outs = out[(points - editorPoints.points).toString()];
		if (outs !== undefined && outs.length > 0 && outs[0] !== 'None') {

			$.each(outs, function (i, item) {
				outContainer.append('<span class="label label-primary">' + item.trim() + '</span>');
			});
		}
	}

	/**
	 * Formats an editor item into points
	 * @param  {String} item string representation of an item. Accepted values are numbers
	 *  between 0-20, 25, 50, and double, treble values as in a format of {[d|t]}{number|[1-20]}
	 *  AND 'db' as double bull, or 'b' as bull
	 * @return {Number}      Number value of the shoot or undefined
	 */
	function _editorItemToPoints(item) {
		var convItem = item;
		var double = false;
		var treble = false;
		if (item.length > 0 && item.toUpperCase() == 'B') {
			return 25;
		}
		if (item.length > 0 && item.toUpperCase() == 'DB') {
			return 50;
		}
		if (item.length > 0 && item.toUpperCase().indexOf('T') === 0) {
			treble = true;
			convItem = item.substr(1);
		}
		if (item.length > 0 && item.toUpperCase().indexOf('D') === 0) {
			double = true;
			convItem = item.substr(1);
		}
		var shoot = Number(convItem);
		if (!isNaN(shoot)) {
			if (shoot < 0 ||
				(shoot > 20 && shoot != 25 && shoot != 50)) {
				return undefined;
		}

		if (treble) {
			return shoot * 3;
		}
		if (double) {
			return shoot * 2;
		}
		return shoot;
	}
	// if it starts with t or d we don't want to look like an error
	if (treble || double) {
		return 0;
	}
	return undefined;
}

	/**
	 * Converts editor into points
	 * @param  {String} containerSelector jquery selector
	 * @return {Object} 
	 *  {
	 *    points: // sum of the points
	 *    darts: // array of points of darts
	 *    rawshots: // string representation
	 *    invalid: // boolean, marking that the editor contains invalid value
	 *    empty: // boolean, marking that the editor is empty
	 *  }
	 */
	function _editorPoints() {
		var pointEditor = $(containerSelector + ' .point-editor');
		var genPoints = $(containerSelector + ' .gen-points');

		var invalid = {invalid: true, empty: false};
		var empty = {invalid: false, empty: true};

		var value = pointEditor.val().trim();
		var darts = [];
		var dartsStr = value.split(' ');

		// convert and check dartsStr into darts[]
		var hasInvalid = false;
		$.each(dartsStr,function (i, item) {
			var dartPoint = _editorItemToPoints(item);
			if (dartPoint === undefined) {
				hasInvalid = true;
			}
			darts.push(dartPoint);
		});
		if (hasInvalid) {
			return invalid;
		}


		if (darts.length > 0 && darts.length <= 3) {
			var points = darts.reduce(function (l,r) { return l + r;});
			if (points > 180) {
				return invalid;
			}
			return {
				points: points,
				darts: darts,
				rawshots: dartsStr,
				invalid: false,
				empty: false,
			};
		} else {
			if (darts.length === 0) {
				return empty;
			} else if (darts.length > 3) {
				return invalid;
			}
		}
	}

}