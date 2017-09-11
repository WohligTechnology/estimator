myApp.controller('masterShapeCtrl', function ($rootScope, $scope, $http, $timeout, $uibModal) {
    $scope.$parent.isSidebarActive = false;
    //start of tree
    $scope.shapes = [{
        "name": "Shapes 1",
    }, {
        "name": "Shapes 2",

    }, {
        "name": "Shapes 3",
    }];

    $scope.checkBox = [{
        "name": "a",
    }, {
        "name": "b",
    }, {
        "name": "c",
    }, {
        "name": "d"
    }, {
        "name": "e"
    }, {
        "name": "f"
    }, {
        "name": "g"
    }, {
        "name": "Q1"
    }, {
        "name": "Q2"
    }, {
        "name": "d"
    }, {
        "name": "d"
    }, {
        "name": "d"
    }, {
        "name": "d"
    }]


    // $scope.checkBox = _.chunk($scope.checkBox, 2);
    // for (var i = 0; i < $scope.checkBox.length; i++) {
    //     $scope.checkBox[i] = _.chunk($scope.checkBox[i], 1);
    //     console.log($scope.checkBox);
    // }
});