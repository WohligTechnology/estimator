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
    //start of shape modal

    
    $scope.shape = function () {
        $scope.loginModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/createOrEditShape.html',
            scope: $scope,
            size: 'lg',
        });
    };
    //end of modal
});