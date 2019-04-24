/// <reference path="../references.d.ts" />
/// <reference path="./gameManager.service.ts" />
/// <reference path="../kdarts.ts" />

module kdarts.game {

    class X01Controller {
        static $inject = ['$state', '$mdDialog', 'gameManager', 'outChart'];

        public players: Array<Player>;

        constructor(private $state: angular.ui.IStateService,
                    private $mdDialog: angular.material.IDialogService,
                    private gameManager: GameManager,
                    private outChart: any) {
            this.players = gameManager.getPlayers();
            this.players[0].setMatchStarter(true);
        }

        getAvgPoints(player: Player) {
            return player.getAvg();
        }

        getLegsWon(player: Player) {
            return player.getLegsWon();
        }

        isLegCounterVisible() {
            return this.gameManager.getLegs() > 1;
        }

        getPlayerIndex() {
            return this.gameManager.getPlayerIndex();
        }

        setPlayerIndex(value: number) {
            this.gameManager.setPlayerIndex(value);
        }

        getCurrentPlayer() {
            return this.players[this.getPlayerIndex()];
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
            var currentPlayer = this.getCurrentPlayer();

            currentPlayer.saveRound(this.gameManager.isDoubleOut());

            if (currentPlayer.getPoints() === 0) {
                this.gameManager.setWinner(this.getCurrentPlayer());
            } else {
                if (this.getPlayerIndex() === this.players.length - 1) { // next round
                    this.setPlayerIndex(0);
                } else { // next player
                    this.setPlayerIndex(this.getPlayerIndex() + 1);
                }
            }
        }
    }

    angular.module('kdarts.game').controller('X01Controller', X01Controller);
}
