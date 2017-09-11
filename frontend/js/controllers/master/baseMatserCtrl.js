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
    //UOM tree
    $scope.uom = [{
        "name": "UOM 1",
    }, {
        "name": "UOM 2",

    }, {
        "name": "UOM 3",
    }];
    //Variable tree
    $scope.variables = [{
        "name": "Variable 1",
    }, {
        "name": "Variable 2",

    }, {
        "name": "Variable 3",
    }];
    //Formulas tree
    $scope.Formula = [{
        "name": "Name 1",
    }, {
        "name": "Name 2",

    }, {
        "name": "Name 3",
    }];
    //Markups tree
    $scope.Markup = [{
        "name": "Markups Name",
    }, {
        "name": "Markups Name",

    }, {
        "name": "Markups Name",
    }];
});