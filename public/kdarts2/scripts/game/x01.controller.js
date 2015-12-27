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
                this.players[0].setMatchStarter(true);
            }
            X01Controller.prototype.getAvgPoints = function (player) {
                return player.getAvg();
            };
            X01Controller.prototype.getLegsWon = function (player) {
                return player.getLegsWon();
            };
            X01Controller.prototype.isLegCounterVisible = function () {
                return this.gameManager.getLegs() > 1;
            };
            X01Controller.prototype.getPlayerIndex = function () {
                return this.gameManager.getPlayerIndex();
            };
            X01Controller.prototype.setPlayerIndex = function (value) {
                this.gameManager.setPlayerIndex(value);
            };
            X01Controller.prototype.getCurrentPlayer = function () {
                return this.players[this.getPlayerIndex()];
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
                        if (this.getCurrentRound().darts[i].getWrittenPoints() !== bestOutDarts[i] && (i !== 2 && this.getCurrentRound().darts[i].getPoints() !== 0)) {
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
                var currentPlayer = this.getCurrentPlayer();
                currentPlayer.saveRound(this.gameManager.isDoubleOut());
                if (currentPlayer.getPoints() === 0) {
                    this.gameManager.setWinner(this.getCurrentPlayer());
                }
                else {
                    if (this.getPlayerIndex() === this.players.length - 1) {
                        this.setPlayerIndex(0);
                    }
                    else {
                        this.setPlayerIndex(this.getPlayerIndex() + 1);
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