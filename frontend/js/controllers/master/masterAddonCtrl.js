myApp.controller('masterAddonCtrl', function ($rootScope, $scope, $http, $timeout, $uibModal) {
    $scope.$parent.isSidebarActive = true;
     //modal start
    $scope.addon = function () {
        $scope.loginModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/createOrEditAddonType.html',
            scope: $scope,
            size: 'lg',
        });
    };
    //end of modal
});