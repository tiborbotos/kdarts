/// <reference path="references.d.ts" />
/// <reference path="game/gameManager.service.ts" />
var kdarts;
(function (kdarts) {
    var home;
    (function (home) {
        var AppController = (function () {
            function AppController($scope, $mdUtil, $mdSidenav, $state, gameManager) {
                var _this = this;
                this.$scope = $scope;
                this.$mdUtil = $mdUtil;
                this.$mdSidenav = $mdSidenav;
                this.$state = $state;
                this.gameManager = gameManager;
                this.buildToggler('left');
                console.log('Start app');
                $scope.close = function () {
                    _this.$mdSidenav('left').close().then(function () {
                    });
                };
                $scope.openMenu = function () {
                    _this.$mdSidenav('left').open();
                };
                $scope.isGameScreen = function () {
                    return _this.$state.current.name !== 'home';
                };
                $scope.getRound = function () {
                    var players = _this.gameManager.getPlayers();
                    if (angular.isDefined(players)) {
                        return players[players.length - 1].getRoundCount();
                    }
                    return '';
                };
            }
            AppController.prototype.buildToggler = function (navID) {
                var debounceFn = this.$mdUtil.debounce(function () {
                    this.$mdSidenav(navID).toggle();
                }, 200);
                return debounceFn;
            };
            AppController.$inject = ['$scope', '$mdUtil', '$mdSidenav', '$state', 'gameManager'];
            return AppController;
        })();
        angular.module('kdarts.app', []).controller('AppController', AppController);
    })(home = kdarts.home || (kdarts.home = {}));
})(kdarts || (kdarts = {}));
//# sourceMappingURL=app.controller.js.map