/// <reference path="../references.d.ts" />
/// <reference path="./gameManager.service.ts" />
/// <reference path="../kdarts.ts" />

module kdarts.game {

    class X01SidenavController {
        static $inject = ['$state', '$mdSidenav', '$mdDialog'];

        constructor(private $state: angular.ui.IStateService, private $mdSidenav: any, private $mdDialog:angular.material.IDialogService) {
        }

        closeMenu() {
            this.$mdSidenav('left').close()
                .then(function () {
                });
        }

        cancelGame() {
            var confirm = this.$mdDialog.confirm()
                .title('Cancel Game')
                .content('Are you sure you want to cancel the game?')
                .ok('Yes')
                .cancel('Cancel');
            this.$mdDialog.show(confirm).then(() => {
                this.closeMenu();
                this.$state.go('home');
            }, () => {
                this.closeMenu();
            });
        }
    }

    angular.module('kdarts.game').controller('X01SidenavController', X01SidenavController);
}