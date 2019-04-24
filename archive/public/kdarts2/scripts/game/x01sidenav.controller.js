/// <reference path="../references.d.ts" />
/// <reference path="./gameManager.service.ts" />
/// <reference path="../kdarts.ts" />
var kdarts;
(function (kdarts) {
    var game;
    (function (game) {
        var X01SidenavController = (function () {
            function X01SidenavController($state, $mdSidenav, $mdDialog) {
                this.$state = $state;
                this.$mdSidenav = $mdSidenav;
                this.$mdDialog = $mdDialog;
            }
            X01SidenavController.prototype.closeMenu = function () {
                this.$mdSidenav('left').close()
                    .then(function () {
                });
            };
            X01SidenavController.prototype.cancelGame = function () {
                var _this = this;
                var confirm = this.$mdDialog.confirm()
                    .title('Cancel Game')
                    .content('Are you sure you want to cancel the game?')
                    .ok('Yes')
                    .cancel('Cancel');
                this.$mdDialog.show(confirm).then(function () {
                    _this.closeMenu();
                    _this.$state.go('home');
                }, function () {
                    _this.closeMenu();
                });
            };
            X01SidenavController.$inject = ['$state', '$mdSidenav', '$mdDialog'];
            return X01SidenavController;
        })();
        angular.module('kdarts.game').controller('X01SidenavController', X01SidenavController);
    })(game = kdarts.game || (kdarts.game = {}));
})(kdarts || (kdarts = {}));
//# sourceMappingURL=x01sidenav.controller.js.map