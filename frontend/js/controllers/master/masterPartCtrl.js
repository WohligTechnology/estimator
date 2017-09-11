myApp.controller('masterPartCtrl', function ($rootScope, $scope, $http, $timeout, $uibModal) {
    $scope.$parent.isSidebarActive = false;
    //start of tree
    $scope.partCat = [{
        "name": "partCat 1",
        "partType": [{
            "name": "Part Type 1",
        }, ]
    }, {
        "name": "partCat 2",
        "partType": [{
            "name": "Part Type 1",
        }, {
            "name": "Part Type 2"
        }, {
            "name": "Part Type 3"
        }]
    }, {
        "name": "partCat 3",
        "partType": [{
            "name": "Part Type 1"
        }]
    }];

    //start of part type category modal

    $scope.partTypeCat = function () {
            $scope.loginModal = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/createOrEditPartType.html',
                scope: $scope,
                size: 'md',

            })
        }
        //start of part type modal

    $scope.partType = function () {
            $scope.loginModal = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/createPartType.html',
                scope: $scope,
                size: 'md',

            })
        }

        //start of processing type modal

    $scope.processing = function () {
        $scope.loginModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/addProcessingToPreset.html',
            scope: $scope,
            size: 'lg',

        })
    }
});