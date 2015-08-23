/// <reference path="../references.d.ts" />
/// <reference path="../kdarts.ts" />

module kdarts.game {


    export class GameManager {

        static $inject = ['$state'];

        private gameConfig: GameConfig;
        private currentLeg: number;
        private legs: number;

        constructor(private $state: angular.ui.IStateService){
        }

        getPlayers() {
            if (angular.isUndefined(this.gameConfig)) {
                return undefined;
            }
            return this.gameConfig.players;
        }

        isDoubleOut() {
            return this.gameConfig.doubleOut;
        }

        getCurrentLeg() {
            return this.currentLeg;
        }

        getLegs() {
            return this.gameConfig.legs;
        }

        createGame(config: GameConfig) {
            this.gameConfig = config;
            this.currentLeg = 0;

            this.nextLeg();
            this.$state.go('x01game');
        }

        nextLeg() {
            this.currentLeg += 1;

            angular.forEach(this.gameConfig.players, (player:Player) => {
                player.initialize(this.gameConfig.game);
            });
        }

    }

    angular.module('kdarts.game', []).service('gameManager', GameManager);
}
