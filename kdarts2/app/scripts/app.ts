/// <reference path="./references.d.ts" />
/// <reference path="./game/gameManager.service.ts" />

module kdarts {

    angular
        .module('kdartsApp', [
            'kdarts.app',
            'kdarts.home',
            'kdarts.game',

            'ngAnimate',
            'ngAria',
            'ngMaterial',
            'ngMdIcons',
            'ui.router'
        ])
        .config(['$stateProvider', function ($stateProvider:angular.ui.IStateProvider) {

            $stateProvider.state('site', {
                abstract: true,
                views: {}
            }).state('home', {
                parent: 'site',
                url: '/home',
                views: {
                    'content@': {
                        controller: 'GameCreatorController',
                        templateUrl: 'scripts/home/gameCreator.html'
                    }
                }
            }).state('x01game', {
                parent: 'site',
                url: '/game',
                views: {
                    'content@': {
                        controller: 'X01Controller as x01Controller',
                        templateUrl: 'scripts/game/x01.html'
                    },
                    'sidenav@': {
                        controller: 'X01SidenavController as x01SidenavController',
                        templateUrl: 'scripts/game/x01sidenav.html'
                    }
                },
                resolve: {
                    players: ['$q', '$timeout', '$state', 'gameManager',
                        function ($q:ng.IQService, $timeout:ng.ITimeoutService, $state:angular.ui.IStateService, gameManager:kdarts.game.GameManager) {
                            if (angular.isUndefined(gameManager.getPlayers()) || gameManager.getPlayers().length === 0) {
                                $timeout(() => {
                                    $state.go('home');
                                });
                                return $q.reject();
                            }
                            var result = $q.defer();
                            result.resolve(gameManager.getPlayers());
                            return result.promise;
                        }]
                }
            });
        }]);


    angular.element(document).ready(function () {
        angular.bootstrap(document, ['kdartsApp']);
    });

}
