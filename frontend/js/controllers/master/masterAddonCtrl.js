myApp.controller('masterAddonCtrl', function ($scope, $http, $uibModal, masterAddonService) {

    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = true;
    $scope.showSaveBtn = true;
    $scope.showEditBtn = false;
    $scope.mMatSubCatData = [];
    var addonTypeSelectedData = {
        addonTypeCat: "",
        addonTypeSubCat: "",
        addonTypeRateMulUom: "",
        addonTypeQualAddInputUom: "",
        addonTypeQualKeyValueUom: "",
        addonTypeQualFinalUom: ""
    };

    // *************************** default functions begin here  ********************** //
    $scope.getAddonData = function () {
        masterAddonService.getAddonData(function (data) {
            $scope.addonData = data;
        });
    }

    // *************************** functions to be triggered form view begin here ***** //
    $scope.addOrEditAddonTypeModal = function (operation, addonType,) {
        console.log('**** inside function_name of masterAddonCtrl.js ****',addonType);
        masterAddonService.getAddonTypeModalData(operation, addonType, function (data) {
            $scope.formData = data.addonTypeData;
            $scope.mMatCatData = data.mMatData;
            $scope.mUomData = data.mUomData;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/master/addon/createOrEditAddonType.html',
                scope: $scope,
                size: 'lg',
            });
        });
    }

    $scope.addOrEditAddonType = function (addonTypeData,selectedMatCatId,selectedMatSubCatId,selectedRateUomId,selectedAdditionalUomId,selectedKinkedKeyUomId,selectedFinalUomId) {
        console.log('**** inside addonTypeData of masterAddonCtrl.js ****',addonTypeData);
        console.log('**** inside selectedMatCatId of masterAddonCtrl.js ****',selectedMatCatId);
        console.log('**** inside selectedMatSubCatId of masterAddonCtrl.js ****',selectedMatSubCatId);
        console.log('**** inside selectedRateUomId of masterAddonCtrl.js ****',selectedRateUomId);
        console.log('**** inside selectedAdditionalUomId of masterAddonCtrl.js ****',selectedAdditionalUomId);
        console.log('**** inside selectedKinkedKeyUomId of masterAddonCtrl.js ****',selectedKinkedKeyUomId);
        console.log('**** inside selectedFinalUomId of masterAddonCtrl.js ****',selectedFinalUomId);
        
        // masterAddonService.addOrEditAddonType(addonTypeData,);
    }
    $scope.deleteAddonTypeModal = function (addonId, getFunction) { }
    $scope.deleteAddonType = function (addonId) {}



    //- to push changed value in 
    $scope.valueChanged = function () {

    }



    // *************************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function () {
        $scope.getAddonData();
    }
    $scope.init();






































    //modal start
    $scope.addon = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/addon/createOrEditAddonType.html',
            scope: $scope,
            size: 'lg',
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
});