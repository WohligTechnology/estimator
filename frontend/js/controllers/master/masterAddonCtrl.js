myApp.controller('masterAddonCtrl', function ($scope, $http, toastr, $uibModal, masterAddonService) {


  // *************************** default variables/tasks begin here ***************** //
  //- to show/hide sidebar of dashboard 
  $scope.$parent.isSidebarActive = true;
  $scope.showSaveBtn = true;
  $scope.showEditBtn = false;
  $scope.mMatSubCatData = [];
  $scope.bulkAddons = [];


  // *************************** default functions begin here  ********************** //
  //- function to get all addons data
  $scope.getAddonData = function () {
    masterAddonService.getAddonData(function (data) {
      $scope.addonData = data.results;
      masterAddonService.getPaginationDetails(1, 10, data, function (obj) {
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
      toastr.info('Record added successfully', 'Addon Creation!');
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
      toastr.info('Record deleted successfully', 'Addon Deletion!');
      $scope.getAddonData();
      $scope.cancelModal();
    });
  }

  //- function for pagination of master addons' records
  $scope.getPaginationData = function (page, numberOfRecords, keyword) {
    if (angular.isUndefined(keyword) || keyword == '') {
      if (numberOfRecords != '10') {
        masterAddonService.getPageDataWithShowRecords(page, numberOfRecords, function (data) {
          $scope.addonData = data.results;
          masterAddonService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
            $scope.obj = obj;
          });
        });
      } else {
        masterAddonService.getPaginationDatawithoutKeyword(page, function (data) {
          $scope.addonData = data.results;
          masterAddonService.getPaginationDetails(page, 10, data, function (obj) {
            $scope.obj = obj;
          });
        });
      }
    } else {
      masterAddonService.getPaginationDataWithKeyword(page, numberOfRecords, keyword, function (data) {
        $scope.addonData = data.results;
        masterAddonService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
          $scope.obj = obj;
        });
      });
    }
  }

  //- function to search the text in table
  $scope.serachText = function (keyword, count) {
    masterAddonService.getSearchResult(keyword, function (data) {
      $scope.addonData = data.results;
      masterAddonService.getPaginationDetails(1, count, data, function (obj) {
        $scope.obj = obj;
      });
    });
  }

  //- to dismiss modal instance
  $scope.cancelModal = function () {
    $scope.modalInstance.dismiss();
  }

  //- modal to confirm bulk addons deletion
  $scope.deleteBulkAddonsModal = function (addonIdArray, getFunction) {
    $scope.idsToDelete = addonIdArray;
    $scope.functionToCall = getFunction;

    $scope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/content/deleteBulkModal.html',
      scope: $scope,
      size: 'md'
    });
  }
  //- function to delete addon
  $scope.deleteBulkAddons = function (addons) {
    masterAddonService.deleteBulkAddons(addons, function () {
      $scope.cancelModal();
      $scope.getAddonData();
      $scope.bulkAddons = [];
      toastr.info('Records added successfully', 'Addons Deletion!');
    });
  }
  //- function to get bulk addons
  $scope.selectBulkAddons = function (checkboxStatus, addonId) {
    masterAddonService.selectBulkAddons(checkboxStatus, addonId, function (data) {
      $scope.bulkAddons = data;
    });
  }
  //- to select all records
  $scope.selectAll = function (addons, checkboxStatus) {
    masterAddonService.selectAll(addons, checkboxStatus, function (data) {
      $scope.bulkAddons = data;
    });
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