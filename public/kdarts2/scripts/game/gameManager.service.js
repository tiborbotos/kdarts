/// <reference path="../references.d.ts" />
/// <reference path="../kdarts.ts" />
var kdarts;
(function (kdarts) {
    var game;
    (function (game) {
        var GameManager = (function () {
            function GameManager($state) {
                this.$state = $state;
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
            GameManager.$inject = ['$state'];
            return GameManager;
        })();
        game.GameManager = GameManager;
        angular.module('kdarts.game', []).service('gameManager', GameManager);
    })(game = kdarts.game || (kdarts.game = {}));
})(kdarts || (kdarts = {}));
//# sourceMappingURL=gameManager.service.js.map