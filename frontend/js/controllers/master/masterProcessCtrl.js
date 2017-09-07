myApp.controller('masterProcessCtrl', function ($rootScope, $scope, $http, $timeout, $uibModal) {
    $scope.$parent.isSidebarActive = true;
   
    //modal start
  $scope.createOrEditUom = function () {
            $scope.loginModal = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/createOrEditUom.html',
                scope: $scope,
                size: 'lg',
                windowClass: "bael-modal"

            });
        };
         //end of modal
});