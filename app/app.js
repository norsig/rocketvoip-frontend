'use strict';

// Declare app level module which depends on views, and components
angular.module('rocketvoip', [
    'ngRoute',
    'ngMaterial',
    'ngStorage',
    'rocketvoip.utility_service',
    'rocketvoip.login',
    'rocketvoip.panel_editUser',
    'rocketvoip.view_dashboard',
    'rocketvoip.version',
    'rocketvoip.view_users',
    'rocketvoip.view_login',
    'rocketvoip.view_companies',
    'rocketvoip.panel_editCompany'
]).constant('appConfig', {
    'BACKEND_BASE_URL': 'https://rocketvoip.herokuapp.com',
    'API_ENDPOINT': '/v1',
    'PASSWORD_LENGTH': 16
}).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/dashboard'});
}]).run(function ($rootScope, $http, $location, $localStorage) {
    if ($localStorage.currentUser) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
    }
    $rootScope.$on('$locationChangeStart', function () {
        var publicPages = ['/login'];
        var restrictedPage = publicPages.indexOf($location.path()) === -1;
        if (restrictedPage && !$localStorage.currentUser) {
            $location.path('/login');
        }
    });
}).factory('Dialog', ['$mdPanel', function ($mdPanel) {
        return function (ctrl, templateUrl, panelClass, locals, callback) {
            var planePosition = $mdPanel.newPanelPosition().absolute().center();

            var planeConfig = {
                attachTo: angular.element(document.body),
                controller: ctrl,
                controllerAs: 'ctrl',
                position: planePosition,
                templateUrl: templateUrl,
                hasBackdrop: true,
                panelClass: panelClass,
                trapFocus: true,
                zIndex: 150,
                clickOutsideToClose: true,
                escapeToClose: true,
                locals: locals,
                focusOnOpen: true,
                onRemoving: callback
            };

            var _mdPanel = $mdPanel.create(planeConfig);
            _mdPanel.open();
            return _mdPanel;
        };
    }]);