'use strict';

angular.module('rocketvoip.panel_editUser', [])
    .controller('PanelDialogCtrl', ['$scope', 'mdPanelRef', 'user', 'updateUser', function ($scope, mdPanelRef, user, updateUser) {

        this.closeDialog = function () {
            mdPanelRef.close().then(function () {
                mdPanelRef.destroy();
            });
        };

        this.setPlaneTitle = function () {
            if ($scope.user == null) {
                $scope.title = "Add a new User"
            } else {
                $scope.title = "Edit User '" + $scope.user.name + "'";
            }
        };

        this.saveUser = function () {
            if ($scope.user && $scope.user.name && $scope.user.phone) {
                //TODO: Persist User
                if ($scope.user.id == undefined) {
                    //TODO: Set ID of User
                    $scope.user.id = Math.random() * (55555); //For Demo
                }
                updateUser($scope.user);

                this.closeDialog();
            }
        };

        $scope.user = angular.copy(user);
        this.setPlaneTitle();
    }]);