myApp.controller('createEstimateCtrl', function ($rootScope, $scope, $http, $timeout, $uibModal) {


// $scope.assembly = [{}];


$scope.subAssembly = [{
        "name": "subAssName 1",
        "part": [{
            "name": "partName"
        }]
    }, {
        "name": "subAssName 2",
        "part": [{
            "name": "partName"
        }]
    }, {
        "name": "subAssName 3",
        "part": [{
            "name": "partName"
        }]
    }];
});