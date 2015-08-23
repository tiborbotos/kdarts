/// <reference path="../references.d.ts" />
/// <reference path="../game/gameManager.service.ts" />
/// <reference path="../kdarts.ts" />

module kdarts.home {

    interface GameCreatorScope {
        phase: number;
        maxPhases: number;

        gameConfig: kdarts.GameConfig;

        setGame(newGame: string);
        playerCount(playerCount);
        goBack();
        showNextPhase();
    }

    export class GameCreatorController {

        static $inject = ['$scope', 'gameManager'];

        constructor(private $scope:GameCreatorScope, private gameManager:kdarts.game.GameManager) {
            $scope.phase = 1;
            $scope.maxPhases = 3;
            $scope.gameConfig = {
                game: '301',
                legs: 1,
                doubleIn: false,
                doubleOut: false,
                players: [new Player('Player 1'), new Player('Player 2')]
            };

            $scope.playerCount = (playerCount) => {
                this.$scope.gameConfig.players = new Array(playerCount);
            };

            $scope.setGame = (newGame: string) => {
                this.$scope.gameConfig.game = newGame;
            };

            $scope.goBack = () => {
                $scope.phase -= 1;
            };

            $scope.showNextPhase = () => {
                $scope.phase += 1;

                if ($scope.phase === 3) {
                    this.setupPlayers();
                } else if ($scope.phase === 4) {
                    this.gameManager.createGame(this.$scope.gameConfig);
                }
            };
        }

        setupPlayers() {
            var i = 0;
            while (i < this.$scope.gameConfig.players.length) {
                this.$scope.gameConfig.players[i] = new Player(('Player ' + (i + 1)));
                i += 1;
            }
        }
    }

    angular.module('kdarts.home', []).controller('GameCreatorController', GameCreatorController);
}
