/// <reference path="../references.d.ts" />
/// <reference path="./gameManager.service.ts" />
/// <reference path="../kdarts.ts" />

module kdarts.game {

    class X01Controller {
        static $inject = ['$state', '$mdDialog', 'gameManager', 'outChart'];

        private playerIndex: number;
        private previousMatchStarterPlayerIndex: number;

        public players: Array<Player>;

        constructor(private $state: angular.ui.IStateService,
                    private $mdDialog: angular.material.IDialogService,
                    private gameManager: GameManager,
                    private outChart: any) {
            this.players = gameManager.getPlayers();
            this.playerIndex = 0;
            this.previousMatchStarterPlayerIndex = 0;
            this.players[0].setMatchStarter(true);
        }

        private winner() {
            this.$mdDialog.show(
                this.$mdDialog
                    .alert()
                    .title('Winner!')
                    .content(this.getCurrentPlayer().name + ' won!')
                    .ok('OK')
            ).then(() => {
                    if (this.gameManager.getCurrentLeg() < this.gameManager.getLegs()) {
                        this.gameManager.nextLeg();

                        if (this.players.length === 2) {
                            this.playerIndex = this.previousMatchStarterPlayerIndex === 0 ? 1 : 0;
                            this.previousMatchStarterPlayerIndex = this.playerIndex;

                            this.players[this.playerIndex].setMatchStarter(true);
                        } else {
                            this.playerIndex = 0;
                        }
                    } else {
                        // go back
                        this.$state.go('home');
                    }
                });
        }

        isLegCounterVisible() {
            return this.gameManager.getLegs() > 1;
        }

        getCurrentPlayer() {
            return this.players[this.playerIndex];
        }

        getCurrentRound() {
            return this.getCurrentPlayer().getActiveRound();
        }

        getWrittenPoints(index: number) {
            return this.getCurrentRound().darts[index].getWrittenPoints();
        }

        getThrowIndex() {
            return this.getCurrentRound().throwIndex;
        }

        setThrowIndex(index: number) {
            this.getCurrentRound().throwIndex = index;
        }

        getAvgPoints(player: Player) {
            return player.getAvg();
        }

        getLegsWon(player: Player) {
            return player.getLegsWon();
        }

        getPointsWithActiveRound(player: Player) {
            if (this.getCurrentPlayer() === player) {
                return player.getPoints() - player.getActiveRound().getPoints();
            } else {
                return player.getPoints();
            }
        }

        getOutChart(player: Player) {
            var bestOutDarts = this.outChart[player.getPoints()],
                failedOutAttempt = false;

            if (this.getCurrentPlayer() === player && angular.isDefined(bestOutDarts)) {
                var i = 0,
                    checkDartsIndex = this.getThrowIndex() < 2 ? this.getThrowIndex() : 3;

                while (i < checkDartsIndex) {
                    if (this.getCurrentRound().darts[i].getWrittenPoints() !== bestOutDarts[i] &&
                        (i !== 2 && this.getCurrentRound().darts[i].getPoints() !== 0 )) {
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
        }

        saveRound() {
            console.log('Saveround');

            this.getCurrentPlayer().saveRound(this.gameManager.isDoubleOut());

            if (this.getCurrentPlayer().getPoints() === 0) {
                console.log('WINNER!');

                this.winner();

            } else {
                if (this.playerIndex === this.players.length - 1) { // next round
                    this.playerIndex = 0;
                } else {
                    this.playerIndex += 1;
                }
            }
        }
    }

    angular.module('kdarts.game').controller('X01Controller', X01Controller);
}
