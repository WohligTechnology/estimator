myApp.controller('masterProcessCtrl', function ($rootScope, $scope, $http, $timeout, $uibModal) {
    $scope.$parent.isSidebarActive = true;

    //modal start
    $scope.createOrEditProcessType = function () {
        $scope.loginModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/createOrEditProcessType.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
});