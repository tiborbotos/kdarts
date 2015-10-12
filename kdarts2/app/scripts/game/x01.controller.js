/// <reference path="../references.d.ts" />
/// <reference path="./gameManager.service.ts" />
/// <reference path="../kdarts.ts" />
var kdarts;
(function (kdarts) {
    var game;
    (function (game) {
        var X01Controller = (function () {
            function X01Controller($state, $mdDialog, gameManager, outChart) {
                this.$state = $state;
                this.$mdDialog = $mdDialog;
                this.gameManager = gameManager;
                this.outChart = outChart;
                this.players = gameManager.getPlayers();
                this.playerIndex = 0;
                this.previousMatchStarterPlayerIndex = 0;
                this.players[0].setMatchStarter(true);
            }
            X01Controller.prototype.winner = function () {
                var _this = this;
                this.$mdDialog.show(this.$mdDialog
                    .alert()
                    .title('Winner!')
                    .content(this.getCurrentPlayer().name + ' won!')
                    .ok('OK')).then(function () {
                    if (_this.gameManager.getCurrentLeg() < _this.gameManager.getLegs()) {
                        _this.gameManager.nextLeg();
                        if (_this.players.length === 2) {
                            _this.playerIndex = _this.previousMatchStarterPlayerIndex === 0 ? 1 : 0;
                            _this.previousMatchStarterPlayerIndex = _this.playerIndex;
                            _this.players[_this.playerIndex].setMatchStarter(true);
                        }
                        else {
                            _this.playerIndex = 0;
                        }
                    }
                    else {
                        // go back
                        _this.$state.go('home');
                    }
                });
            };
            X01Controller.prototype.isLegCounterVisible = function () {
                return this.gameManager.getLegs() > 1;
            };
            X01Controller.prototype.getCurrentPlayer = function () {
                return this.players[this.playerIndex];
            };
            X01Controller.prototype.getCurrentRound = function () {
                return this.getCurrentPlayer().getActiveRound();
            };
            X01Controller.prototype.getWrittenPoints = function (index) {
                return this.getCurrentRound().darts[index].getWrittenPoints();
            };
            X01Controller.prototype.getThrowIndex = function () {
                return this.getCurrentRound().throwIndex;
            };
            X01Controller.prototype.setThrowIndex = function (index) {
                this.getCurrentRound().throwIndex = index;
            };
            X01Controller.prototype.getAvgPoints = function (player) {
                return player.getAvg();
            };
            X01Controller.prototype.getLegsWon = function (player) {
                return player.getLegsWon();
            };
            X01Controller.prototype.getPointsWithActiveRound = function (player) {
                if (this.getCurrentPlayer() === player) {
                    return player.getPoints() - player.getActiveRound().getPoints();
                }
                else {
                    return player.getPoints();
                }
            };
            X01Controller.prototype.getOutChart = function (player) {
                var bestOutDarts = this.outChart[player.getPoints()], failedOutAttempt = false;
                if (this.getCurrentPlayer() === player && angular.isDefined(bestOutDarts)) {
                    var i = 0, checkDartsIndex = this.getThrowIndex() < 2 ? this.getThrowIndex() : 3;
                    while (i < checkDartsIndex) {
                        if (this.getCurrentRound().darts[i].getWrittenPoints() !== bestOutDarts[i] &&
                            (i !== 2 && this.getCurrentRound().darts[i].getPoints() !== 0)) {
                            failedOutAttempt = true;
                        }
                        i++;
                    }
                    if (failedOutAttempt) {
                        console.log('Failed out attempt');
                        bestOutDarts = this.outChart[this.getPointsWithActiveRound(player)];
                        if (angular.isDefined(bestOutDarts) && (2 - this.getThrowIndex()) >= bestOutDarts.length) {
                            failedOutAttempt = false;
                        }
                    }
                }
                return {
                    darts: bestOutDarts,
                    failedOutAttempt: failedOutAttempt
                };
            };
            X01Controller.prototype.saveRound = function () {
                console.log('Saveround');
                this.getCurrentPlayer().saveRound(this.gameManager.isDoubleOut());
                if (this.getCurrentPlayer().getPoints() === 0) {
                    console.log('WINNER!');
                    this.winner();
                }
                else {
                    if (this.playerIndex === this.players.length - 1) {
                        this.playerIndex = 0;
                    }
                    else {
                        this.playerIndex += 1;
                    }
                }
            };
            X01Controller.$inject = ['$state', '$mdDialog', 'gameManager', 'outChart'];
            return X01Controller;
        })();
        angular.module('kdarts.game').controller('X01Controller', X01Controller);
    })(game = kdarts.game || (kdarts.game = {}));
})(kdarts || (kdarts = {}));
//# sourceMappingURL=x01.controller.js.map