/// <reference path="../references.d.ts" />
/// <reference path="../kdarts.ts" />
var kdarts;
(function (kdarts) {
    var game;
    (function (game) {
        var GameManager = (function () {
            function GameManager($state, $mdDialog) {
                this.$state = $state;
                this.$mdDialog = $mdDialog;
            }
            GameManager.prototype.getPlayers = function () {
                if (angular.isUndefined(this.gameConfig)) {
                    return undefined;
                }
                return this.gameConfig.players;
            };
            GameManager.prototype.isDoubleOut = function () {
                return this.gameConfig.doubleOut;
            };
            GameManager.prototype.getCurrentLeg = function () {
                return this.currentLeg;
            };
            GameManager.prototype.getLegs = function () {
                return this.gameConfig.legs;
            };
            GameManager.prototype.createGame = function (config) {
                this.gameConfig = config;
                this.currentLeg = 0;
                this.previousMatchStarterPlayerIndex = 0;
                this.setPlayerIndex(0);
                this.nextLeg();
                this.$state.go('x01game');
            };
            GameManager.prototype.nextLeg = function () {
                var _this = this;
                this.currentLeg += 1;
                angular.forEach(this.gameConfig.players, function (player) {
                    player.initialize(_this.gameConfig.game);
                });
            };
            GameManager.prototype.getPlayerIndex = function () {
                return this.playerIndex;
            };
            GameManager.prototype.setPlayerIndex = function (value) {
                this.playerIndex = value;
            };
            GameManager.prototype.resetGame = function () {
                this.currentLeg = 0;
                this.previousMatchStarterPlayerIndex = 0;
                angular.forEach(this.gameConfig.players, function (player) {
                    player.resetLegsWon();
                });
                this.setPlayerIndex(0);
                this.nextLeg();
                this.$state.go('x01game');
            };
            GameManager.prototype.setWinner = function (player) {
                var _this = this;
                this.$mdDialog.show(this.$mdDialog.alert().title('Winner!').content(player.name + ' won!').ok('OK')).then(function () {
                    if (_this.getCurrentLeg() < _this.getLegs()) {
                        _this.nextLeg();
                        if (_this.getPlayers().length === 2) {
                            _this.setPlayerIndex(_this.previousMatchStarterPlayerIndex === 0 ? 1 : 0);
                            _this.previousMatchStarterPlayerIndex = _this.getPlayerIndex();
                            _this.getPlayers()[_this.getPlayerIndex()].setMatchStarter(true);
                        }
                        else {
                            _this.setPlayerIndex(0);
                        }
                    }
                    else {
                        _this.$mdDialog.show(_this.$mdDialog.confirm().title('Replay?').content('Would you like a replay?').ok('Yes').cancel('No')).then(function (res) {
                            _this.resetGame();
                        }).catch(function () {
                            _this.$state.go('home');
                        });
                    }
                });
            };
            GameManager.$inject = ['$state', '$mdDialog'];
            return GameManager;
        })();
        game.GameManager = GameManager;
        angular.module('kdarts.game', []).service('gameManager', GameManager);
    })(game = kdarts.game || (kdarts.game = {}));
})(kdarts || (kdarts = {}));
//# sourceMappingURL=gameManager.service.js.map