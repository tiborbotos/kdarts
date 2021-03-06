/// <reference path="../references.d.ts" />
/// <reference path="../game/gameManager.service.ts" />
/// <reference path="../kdarts.ts" />
var kdarts;
(function (kdarts) {
    var home;
    (function (home) {
        var GameCreatorController = (function () {
            function GameCreatorController($scope, gameManager) {
                var _this = this;
                this.$scope = $scope;
                this.gameManager = gameManager;
                $scope.phase = 1;
                $scope.maxPhases = 3;
                $scope.gameConfig = {
                    game: '301',
                    legs: 1,
                    doubleIn: false,
                    doubleOut: false,
                    players: [new kdarts.Player('Player 1'), new kdarts.Player('Player 2')]
                };
                var previousPlayers = gameManager.getPlayers();
                if (previousPlayers && previousPlayers.length > 0) {
                    $scope.gameConfig.players = previousPlayers;
                    $scope.gameConfig.players.forEach(function (player) {
                        player.resetLegsWon();
                    });
                }
                $scope.playerCount = function (playerCount) {
                    _this.$scope.gameConfig.players = new Array(playerCount);
                };
                $scope.setGame = function (newGame) {
                    _this.$scope.gameConfig.game = newGame;
                };
                $scope.goBack = function () {
                    $scope.phase -= 1;
                };
                $scope.showNextPhase = function () {
                    $scope.phase += 1;
                    if ($scope.phase === 4) {
                        _this.gameManager.createGame(_this.$scope.gameConfig);
                    }
                };
            }
            GameCreatorController.$inject = ['$scope', 'gameManager'];
            return GameCreatorController;
        })();
        home.GameCreatorController = GameCreatorController;
        angular.module('kdarts.home', []).controller('GameCreatorController', GameCreatorController);
    })(home = kdarts.home || (kdarts.home = {}));
})(kdarts || (kdarts = {}));
//# sourceMappingURL=gameCreator.controller.js.map