myApp.controller('masterAddonCtrl', function ($scope, $http, $uibModal, masterAddonService) {

  // *************************** default variables/tasks begin here ***************** //

  //- to show/hide sidebar of dashboard 
  $scope.$parent.isSidebarActive = true;
  $scope.showSaveBtn = true;
  $scope.showEditBtn = false;
  $scope.mMatSubCatData = [];


  // *************************** default functions begin here  ********************** //

  //- function to get all addons data
  $scope.getAddonData = function () {
    masterAddonService.getAddonData(function (data) {
      $scope.addonData = data.results;
      masterAddonService.getPaginationDetails(1, data, function (obj) {
        $scope.obj = obj;
      });
    });
  }


  // *************************** functions to be triggered form view begin here ***** //

  //- modal to create new addon  
  $scope.addOrEditAddonTypeModal = function (operation, addonType) {

    masterAddonService.getAddonTypeModalData(operation, addonType, function (data) {
      console.log('**** inside function_name of masterAddonCtrl.js ****', data);
      $scope.formData = data.addonTypeData;
      $scope.mMatCatData = data.mMatData;
      $scope.mUomData = data.mUomData;
      $scope.showSaveBtn = data.saveBtn;
      $scope.showEditBtn = data.editBtn;

      if (angular.isDefined(data.addonTypeData)) {
        $scope.selectedMatCat = $scope.formData.materialCat;
        $scope.selectedMatSubCat = $scope.formData.materialSubCat;
        $scope.selectedRateUom = $scope.formData.rate.uom;
        $scope.selectedAdditionalUom = $scope.formData.quantity.additionalInputUom;
        $scope.selectedKinkedKeyUom = $scope.formData.quantity.linkedKeyUom;
        $scope.selectedFinalUom = $scope.formData.quantity.finalUom;
      }

      $scope.modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/content/master/addon/createOrEditAddonType.html',
        scope: $scope,
        size: 'lg',
      });
    });
  }
  //- function to  create new addon     
  $scope.addOrEditAddonType = function (addonTypeData, selectedMatCatId, selectedMatSubCatId, selectedRateUomId, selectedAdditionalUomId, selectedKinkedKeyUomId, selectedFinalUomId) {
    addonTypeData.materialCat = selectedMatCatId;
    addonTypeData.materialSubCat = selectedMatSubCatId;
    addonTypeData.rate.uom = selectedRateUomId;
    addonTypeData.quantity.additionalInputUom = selectedAdditionalUomId;
    addonTypeData.quantity.linkedKeyUom = selectedKinkedKeyUomId;
    addonTypeData.quantity.finalUom = selectedFinalUomId;

    masterAddonService.addOrEditAddonType(addonTypeData, function (data) {
      $scope.successMessage = "Addon Added successfully..";
      $scope.getAddonData();
      $scope.cancelModal();
    });

  }

  //- modal to confirm addon deletion
  $scope.deleteAddonTypeModal = function (addonId, getFunction) {
    $scope.idToDelete = addonId;
    $scope.functionToCall = getFunction;
    $scope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
      scope: $scope,
      size: 'md'
    });
  }
  //- function for addon deletion
  $scope.deleteAddonType = function (addonId) {
    masterAddonService.deleteAddonType(addonId, function (data) {
      $scope.operationStatus = "Record deleted successfully";
      $scope.getAddonData();
      $scope.cancelModal();
    });
  }

  //- function for pagination of master addons' records
  $scope.getPaginationData = function (page, keyword) {
    if (angular.isUndefined(keyword) || keyword == '') {
      masterAddonService.getPaginationDatawithoutKeyword(page, function (data) {
        $scope.addonData = data.results;
        masterAddonService.getPaginationDetails(page, data, function (obj) {
          $scope.obj = obj;
        });
      });
    } else {
      masterAddonService.getPaginationDataWithKeyword(page, keyword, function (data) {
        $scope.addonData = data.results;
        masterAddonService.getPaginationDetails(page, data, function (obj) {
          $scope.obj = obj;
        });
      });
    }
  }

  //- function to search the text in table
  $scope.serachText = function (keyword) {
    masterAddonService.getSearchResult(keyword, function (data) {
      $scope.addonData = data.results;
      masterAddonService.getPaginationDetails(1, data, function (obj) {
        $scope.obj = obj;
      });
    });
  }

  //- to dismiss modal instance
  $scope.cancelModal = function () {
    $scope.modalInstance.dismiss();
  };


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