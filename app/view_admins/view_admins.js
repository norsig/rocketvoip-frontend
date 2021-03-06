'use strict';
/**
 * Module View Admins
 * Author: Marco Studerus
 */
angular.module('rocketvoip.view_admins', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view_admins', {
            templateUrl: 'view_admins/view_admins.html',
            controller: 'ViewAdminsCtrl'
        });
    }])

    .controller('ViewAdminsCtrl', function ($scope, UtilityService, AdminService, $mdDialog) {

            $scope.updateAdmins = function () {
                $scope.admins = AdminService.query();
            };

            $scope.sortType = 'userName';
            $scope.sortReverse = false;
            $scope.updateAdmins();

            $scope.showDialog = function (admin){
                UtilityService.showDialog(
                    'PanelEditAdminDialogCtrl',
                    'view_admins/panel_editAdmin.html',
                    'admin-dialog',
                    { 'admin': admin},
                    $scope.updateAdmins
                );
            };

            $scope.changeAdminPassword = function (admin){
                $mdDialog.show({
                    controller: 'ResetPasswordDialogCtrl',
                    templateUrl: 'view_admins/dialog_resetPassword.html',
                    clickOutsideToClose:true,
                    admin: admin
                })
            };
        }
    ).factory('AdminService', ['$resource', 'appConfig', function ($resource, appConfig) {
    return $resource(appConfig.BACKEND_BASE_URL + appConfig.API_ENDPOINT + '/admins/:id', {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
}]);