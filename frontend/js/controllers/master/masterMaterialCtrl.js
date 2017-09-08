myApp.controller('masterMaterialCtrl', function ($rootScope, $scope, $http, $timeout, $uibModal) {
    $scope.$parent.isSidebarActive = false;
     //modal start
    $scope.material = function () {
        $scope.loginModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/createOrEditMaterial.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
});