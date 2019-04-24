/// <reference path="references.d.ts" />
/// <reference path="game/gameManager.service.ts" />

module kdarts.home {

    interface AppScope {
        close();
        openMenu();
        isGameScreen();
        getRound();
    }

    class AppController {

        static $inject = ['$scope', '$mdUtil', '$mdSidenav', '$state', 'gameManager'];

        buildToggler(navID) {
            var debounceFn = this.$mdUtil.debounce(function () {
                this.$mdSidenav(navID).toggle();
            }, 200);
            return debounceFn;
        }

        constructor(private $scope: AppScope,
                    private $mdUtil: any,
                    private $mdSidenav: any,
                    private $state: angular.ui.IStateService,
                    private gameManager: kdarts.game.GameManager) {
            this.buildToggler('left');

            console.log('Start app');

            $scope.close = () => {
                this.$mdSidenav('left').close()
                    .then(function () {
                    });
            };

            $scope.openMenu = () => {
                this.$mdSidenav('left').open();
            };

            $scope.isGameScreen = () => {
                return this.$state.current.name !== 'home';
            };

            $scope.getRound = () => {
                var players = this.gameManager.getPlayers();

                if (angular.isDefined(players)) {
                    return players[players.length - 1].getRoundCount();
                }
                return '';
            };
        }
    }

    angular.module('kdarts.app', []).controller('AppController', AppController);

}
