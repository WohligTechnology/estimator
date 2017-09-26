myApp.controller('masterMaterialCtrl', function ($scope, $http, $uibModal, masterMaterialService) {

    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = false;
    //- to show/hide save & update button on pop-up according to operation
    $scope.showSaveBtn = true;
    $scope.showEditBtn = false;

    // *************************** default functions begin here  ********************** //
    $scope.getMaterialData = function () {
        masterMaterialService.getMaterialData(function (data) {
            $scope.materialData = data;
        });
    }

    // *************************** functions to be triggered form view begin here ***** //

    $scope.addOrEditMaterialCatModal = function (operation, materialCat) {
        console.log('**** inside addOrEditMaterialCatModal of createOrEditMaterialCtrl.js ****',operation);
    }
    $scope.addOrEditMaterialCat = function (materialCatData) {
        console.log('**** inside addOrEditMaterialCat of createOrEditMaterialCtrl.js ****');
    }
    //- modal to confirm material cat deletion
    $scope.deleteMaterialCatModal = function (materialCatId, getFunction) {
        console.log('**** inside deleteMaterialCatModal of createOrEditMaterialCtrl.js ****',getFunction);
    }
    $scope.deleteMaterialCat = function (materialCatId) {
        console.log('**** inside deleteMaterialCat of createOrEditMaterialCtrl.js ****');
    }



    $scope.addOrEditMaterialSubCatModal = function (operation, materialSubCat) {
        console.log('**** inside addOrEditMaterialSubCatModal of createOrEditMaterialCtrl.js ****',operation);
    }
    $scope.addOrEditMaterialSubCat = function (materialSubCatData) {
        console.log('**** inside addOrEditMaterialSubCat of createOrEditMaterialCtrl.js ****');
    }
    //- modal to confirm material sub deletion
    $scope.deleteMaterialSubCatModal = function (materialSubCatId, getFunction) {
        console.log('**** inside deleteMaterialSubCatModal of createOrEditMaterialCtrl.js ****',getFunction);
    }
    $scope.deleteMaterialSubCat = function (materialSubCatId) {
        console.log('**** inside deleteMaterialSubCat of createOrEditMaterialCtrl.js ****');
    }



    $scope.addOrEditMaterialModal = function (operation, material) {
        console.log('**** inside addOrEditMaterialModal of createOrEditMaterialCtrl.js ****',operation);
    }
    $scope.addOrEditMaterial = function (materialData) {
        console.log('**** inside addOrEditMaterial of createOrEditMaterialCtrl.js ****');
    }
    //- modal to confirm material deletion
    $scope.deleteMaterialModal = function (materialId, getFunction) {
        console.log('**** inside deleteMaterialModal of createOrEditMaterialCtrl.js ****',getFunction);
    }
    $scope.deleteMaterial = function (materialId) {
        console.log('**** inside deleteMaterial of createOrEditMaterialCtrl.js ****');
    }

    // *************************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function () {
        // to get BaseMaster Data
        $scope.getMaterialData();
    }

    $scope.init();

































    //modal start
    $scope.material = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/material/createOrEditMaterial.html',
            scope: $scope,
            size: 'md',
        });
    };
    // category modal start
    $scope.category = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/material/createOrEditMaterialCat.html',
            scope: $scope,
            size: 'md',
        });
    };
    // subCategory modal start
    $scope.subCategory = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/material/createOrEditmaterialSubCat.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
    // Delete modal start
    $scope.deleteItem = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/delete.html',
            scope: $scope,
            size: 'sm',
        });
    };
    //end of modal
    //start of tree
    // $scope.materialCat = [{
    //     "name": "materialCat 1",
    //     "materialSub": [{
    //         "name": "MaterialSub Cat 1",
    //         "material": [{
    //             "name": "Material 1"
    //         }, {
    //             "name": "Material 2"
    //         }]
    //     }, ]
    // }, {
    //     "name": "materialCat 2",
    //     "materialSub": [{
    //         "name": "MaterialSub Cat 1",
    //         "material": [{
    //             "name": "Material 1"
    //         }, {
    //             "name": "Material 2"
    //         }]

    //     }, {
    //         "name": "MaterialSub Cat 2"
    //     }, {
    //         "name": "MaterialSub Cat 3"
    //     }]
    // }, {
    //     "name": "materialCat 3",
    //     "materialSub": [{
    //         "name": "MaterialSub Cat 1"
    //     }]
    // }];



});