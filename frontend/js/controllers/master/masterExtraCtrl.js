myApp.controller('masterExtraCtrl', function ($rootScope, $scope, $http, $timeout, $uibModal) {
    $scope.$parent.isSidebarActive = true;
      //Extra modal start
    $scope.extra = function () {
        $scope.extraModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/extra/createOrEditExtra.html',
            scope: $scope,
            size: 'md',
        });
    };
});