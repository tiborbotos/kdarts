// shared classes
var kdarts;
(function (kdarts) {
    var Player = (function () {
        function Player(name) {
            this.name = name;
            this.legsWon = 0;
        }
        Player.prototype.newRound = function () {
            this.rounds.push(new Round(this.points));
        };
        Player.prototype.lastValidDart = function () {
            var i = 2;
            while (i >= 0) {
                if (this.getActiveRound().darts[i].getShot() > 0) {
                    return this.getActiveRound().darts[i];
                }
                i--;
            }
            return this.getActiveRound().darts[0];
        };
        Player.prototype.initialize = function (game) {
            this.game = game;
            this.points = parseInt(game);
            this.maxPoints = parseInt(game);
            this.dartsCount = 0;
            this.rounds = [];
            this.winner = false;
            this.matchStarter = false;
            this.newRound();
        };
        Player.prototype.getPoints = function () {
            return this.points;
        };
        Player.prototype.getDartsCount = function () {
            return this.dartsCount;
        };
        Player.prototype.setMatchStarter = function (matchStarter) {
            this.matchStarter = matchStarter;
        };
        Player.prototype.getAvg = function () {
            if (this.dartsCount === 0) {
                return '';
            }
            else {
                var res = ((this.maxPoints - this.points) / this.dartsCount).toString();
                if (res.indexOf('.') > -1) {
                    res = res.substring(0, res.indexOf('.') + 2);
                }
                return res;
            }
        };
        Player.prototype.getActiveRound = function () {
            return this.rounds[this.rounds.length - 1];
        };
        Player.prototype.getRoundCount = function () {
            return this.rounds.length;
        };
        Player.prototype.getLegsWon = function () {
            return this.legsWon;
        };
        Player.prototype.resetLegsWon = function () {
            this.legsWon = 0;
        };
        Player.prototype.isWinner = function () {
            return this.winner;
        };
        Player.prototype.saveRound = function (doubleOut) {
            var activeRoundPoints = this.getActiveRound().getPoints();
            if (doubleOut) {
                if (this.points > activeRoundPoints && (this.points - activeRoundPoints) > 1) {
                    this.points -= activeRoundPoints;
                }
                else if (this.points === activeRoundPoints) {
                    if (this.lastValidDart().isDouble() || this.lastValidDart().shot === 50) {
                        this.points = 0;
                    }
                    else {
                        this.getActiveRound().wasted = true;
                    }
                }
                else {
                    this.getActiveRound().wasted = true;
                }
            }
            else {
                if (this.points >= activeRoundPoints) {
                    this.points -= activeRoundPoints;
                }
                else {
                    this.getActiveRound().wasted = true;
                }
            }
            if (this.points > 0) {
                this.newRound();
                this.dartsCount += 1;
            }
            else {
                this.winner = true;
                this.legsWon += 1;
            }
        };
        return Player;
    })();
    kdarts.Player = Player;
    var DartThrow = (function () {
        function DartThrow() {
            this.shot = 0;
            this.double = false;
            this.treble = false;
        }
        DartThrow.isValidShot = function (shot, double, treble) {
            if (double === void 0) { double = false; }
            if (treble === void 0) { treble = false; }
            var numberShot = parseInt(shot);
            if (isNaN(numberShot)) {
                return false;
            }
            else if (treble && (numberShot === 25 || numberShot === 50)) {
                return false;
            }
            else if (double && (numberShot === 50)) {
                return false;
            }
            else {
                return DartThrow.validShots.indexOf(numberShot) > -1;
            }
        };
        DartThrow.prototype.toggleTreble = function () {
            this.treble = !this.treble;
            if (this.double) {
                this.double = false;
            }
        };
        DartThrow.prototype.toggleDouble = function () {
            this.double = !this.double;
            if (this.treble) {
                this.treble = false;
            }
        };
        DartThrow.prototype.setDouble = function (double) {
            this.double = double;
        };
        DartThrow.prototype.setTreble = function (treble) {
            this.treble = treble;
        };
        DartThrow.prototype.isDouble = function () {
            return this.double;
        };
        DartThrow.prototype.isTreble = function () {
            return this.treble;
        };
        DartThrow.prototype.setShot = function (shot) {
            this.shot = shot;
        };
        DartThrow.prototype.getShot = function () {
            return this.shot;
        };
        DartThrow.prototype.addNumber = function (number, isDouble, isTreble) {
            var numberShot = parseInt(number);
            if (isNaN(numberShot)) {
                return false;
            }
            else if (DartThrow.isValidShot(this.shot.toString() + number, isDouble, isTreble)) {
                this.shot = parseInt(this.shot.toString() + number);
                return true;
            }
            else {
                return false;
            }
        };
        DartThrow.prototype.getPoints = function () {
            if (this.double) {
                return this.shot * 2;
            }
            else if (this.treble) {
                return this.shot * 3;
            }
            else {
                return this.shot;
            }
        };
        DartThrow.prototype.getWrittenPoints = function () {
            if (this.shot === 0) {
                return '-';
            }
            else if (this.double) {
                return 'D' + this.shot;
            }
            else if (this.treble) {
                return 'T' + this.shot;
            }
            else {
                return this.shot.toString();
            }
        };
        DartThrow.validShots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25, 50];
        return DartThrow;
    })();
    kdarts.DartThrow = DartThrow;
    var Round = (function () {
        function Round(points) {
            this.starterPoints = points;
            this.wasted = false;
            this.throwIndex = 0;
            this.darts = [new DartThrow(), new DartThrow(), new DartThrow()];
        }
        Round.prototype.getPoints = function () {
            return this.darts[0].getPoints() + this.darts[1].getPoints() + this.darts[2].getPoints();
        };
        return Round;
    })();
    kdarts.Round = Round;
})(kdarts || (kdarts = {}));
//# sourceMappingURL=kdarts.js.map