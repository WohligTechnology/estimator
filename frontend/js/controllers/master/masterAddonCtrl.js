myApp.controller('masterAddonCtrl', function ($scope, $http, $uibModal, masterAddonService) {

    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = true;
    $scope.showSaveBtn = true;
    $scope.showEditBtn = false;
    var addonTypeSelectedData = {
        addonTypeCat:"",
        addonTypeSubCat:"",
        addonTypeRateMulUom:"",
        addonTypeQualAddInputUom:"",
        addonTypeQualKeyValueUom:"",
        addonTypeQualFinalUom:""
    };

    // *************************** default functions begin here  ********************** //
    $scope.getAddonData = function () {
        masterAddonService.getAddonData(function (data) {
            $scope.addonData = data;
        });
    }

    // *************************** functions to be triggered form view begin here ***** //
    $scope.addOrEditAddonTypeModal = function (operation, addonType) {
        masterAddonService.getAddonTypeModalData(function (data) {
            $scope.formData = data.addonTypes;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/master/material/createOrEditMaterialCat.html',
                scope: $scope,
                size: 'md'
            });
        });
    }
    $scope.addOrEditMaterialCat = function (addonTypeData,) {

    }
    $scope.deleteMaterialCatModal = function (addonId,getFunction) {

    }
    $scope.deleteMaterialCat = function (addonId) {

    }

    //- to push changed value in 
    $scope.valueChanged = function(){
        
    }






    // *************************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function () {
        // to get addon Data
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