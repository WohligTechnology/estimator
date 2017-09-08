myApp.controller('masterMaterialCtrl', function ($rootScope, $scope, $http, $timeout, $uibModal) {
    $scope.$parent.isSidebarActive = false;
    //modal start
    $scope.material = function () {
        $scope.loginModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/createOrEditMaterial.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal

    $scope.materialCat = [{
        "name": "materialCat 1",
        "materialSub": [{
            "name": "MaterialSub Cat 1",
            "material": [{
                "name": "Material 1"
            }, {
                "name": "Material 2"
            }]
        }, ]
    }, {
        "name": "materialCat 2",
        "materialSub": [{
            "name": "MaterialSub Cat 1",
            "material": [{
                "name": "Material 1"
            }, {
                "name": "Material 2"
            }]

        }, {
            "name": "MaterialSub Cat 2"
        }, {
            "name": "MaterialSub Cat 3"
        }]
    }, {
        "name": "materialCat 3",
        "materialSub": [{
            "name": "MaterialSub Cat 1"
        }]
    }];



});