/// <reference path="../references.d.ts" />
/// <reference path="../kdarts.ts" />

module kdarts.game {


    export class GameManager {

        static $inject = ['$state', '$mdDialog'];

        private gameConfig:GameConfig;
        private currentLeg:number;
        private legs:number;
        private playerIndex: number;
        private previousMatchStarterPlayerIndex: number;

        constructor(private $state:angular.ui.IStateService,
                    private $mdDialog:angular.material.IDialogService) {
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

        createGame(config:GameConfig) {
            this.gameConfig = config;
            this.currentLeg = 0;
            this.previousMatchStarterPlayerIndex = 0;
            this.setPlayerIndex(0);

            this.nextLeg();
            this.$state.go('x01game');
        }

        nextLeg() {
            this.currentLeg += 1;

            angular.forEach(this.gameConfig.players, (player:Player) => {
                player.initialize(this.gameConfig.game);
            });
        }

        getPlayerIndex() {
            return this.playerIndex;
        }

        setPlayerIndex(value: number) {
            this.playerIndex = value;
        }

        resetGame() {
            this.currentLeg = 0;
            this.previousMatchStarterPlayerIndex = 0;
            angular.forEach(this.gameConfig.players, (player:Player) => {
                player.resetLegsWon();
            });

            this.setPlayerIndex(0);
            this.nextLeg();
            this.$state.go('x01game');
        }

        winner(player:Player) {
            this.$mdDialog.show(
                this.$mdDialog
                    .alert()
                    .title('Winner!')
                    .content(player.name + ' won!')
                    .ok('OK')
            ).then(() => {
                    if (this.getCurrentLeg() < this.getLegs()) {
                        this.nextLeg();

                        if (this.getPlayers().length === 2) {
                            this.setPlayerIndex(this.previousMatchStarterPlayerIndex === 0 ? 1 : 0);
                            this.previousMatchStarterPlayerIndex = this.getPlayerIndex();

                            this.getPlayers()[this.getPlayerIndex()].setMatchStarter(true);
                        } else {
                            this.setPlayerIndex(0);
                        }
                    } else {
                        this.$mdDialog.show(
                            this.$mdDialog
                                .confirm()
                                .title('Replay?')
                                .content('Would you like a replay?')
                                .ok('Yes')
                                .cancel('No')
                            ).then((res) => {
                                this.resetGame();
                            }).catch(() => {
                                this.$state.go('home');
                            });
                    }
                });
        }

    }

    angular.module('kdarts.game', []).service('gameManager', GameManager);
}
