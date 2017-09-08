myApp.controller('baseMatserCtrl', function ($rootScope, $scope, $http, $timeout, $uibModal) {
    $scope.$parent.isSidebarActive = true;
    // Uom modal start
    $scope.createOrEditUom = function () {
        $scope.loginModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/createOrEditUom.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
      //Variable modal start
    $scope.variable = function () {
        $scope.loginModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/createOrEditVariable.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
    //Formulas modal start
    $scope.formulas = function () {
        $scope.loginModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/createOrEditFormulas.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
        //Markups modal start
    $scope.markups = function () {
        $scope.loginModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/createOrEditMarkups.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
});