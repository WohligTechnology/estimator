myApp.controller('masterAddonCtrl', function ($rootScope, $scope, $http, $timeout, $uibModal) {
    $scope.$parent.isSidebarActive = true;
     //modal start
    $scope.addon = function () {
        $scope.modalInstance  = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/addon/createOrEditAddonType.html',
            scope: $scope,
            size: 'lg',
        });
    };
    //end of modal
        // Delete modal start
    $scope.deleteItem = function () {
        $scope.modalInstance  = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/delete.html',
            scope: $scope,
            size: 'sm',
        });
    };
    //end of modal
});