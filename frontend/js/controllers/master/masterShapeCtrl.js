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

    $scope.checkBox = [
     
        {
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
        "name": "q1"
    }, {
        "name": "q2"
    },
        {
        "name": "Thikness(t)"
    }, {
        "name": "Length(l)"
    }, {
        "name": "Wastage(w)"
    },]


    $scope.checkBox = _.chunk($scope.checkBox, 3);
  
  
});