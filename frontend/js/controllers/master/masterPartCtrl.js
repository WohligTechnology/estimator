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
            $scope.modalInstance  = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/master/part/createOrEditPartType.html',
                scope: $scope,
                size: 'md',

            })
        }
        //start of part type modal
    $scope.partType = function () {
        $scope.modalInstance  = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/part/createPartType.html',
            scope: $scope,
            size: 'md',

        })
    }
// //start of processing type modal
//     $scope.processing = function () {
//             $scope.modalInstance  = $uibModal.open({
//                 animation: true,
//                 templateUrl: 'views/content/master/part/addProcessingToPreset.html',
//                 scope: $scope,
//                 size: 'lg',

//             })
//         }
        // Delete modal start
    $scope.deleteItem = function () {
        $scope.modalInstance  = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/delete.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
     //AddAddon modal start
    $scope.addAddon = function () {
        $scope.modalInstance  = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/part/addAddonToPreset.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
     //AddProcessing modal start
    $scope.addProcessing = function () {
        $scope.modalInstance  = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/part/addProcessingToPreset.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
     //AddExtra modal start
    $scope.addExtra = function () {
        $scope.modalInstance  = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/part/addExtraToPreset.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
     //AddMaterial modal start
    $scope.addMaterial = function () {
        $scope.modalInstance  = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/part/addMaterialToPartType.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
    //veriables 
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
        }, {
            "name": "Thikness(t)"
        }, {
            "name": "Length(l)"
        }, {
            "name": "Wastage(w)"
        },
    ]

    $scope.checkBox = _.chunk($scope.checkBox, 2);
});