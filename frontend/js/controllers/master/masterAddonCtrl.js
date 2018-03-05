myApp.controller('masterAddonCtrl', function ($scope, toastr, $uibModal, masterAddonService, TemplateService, usersRoleService) {


  // *************************** default variables/tasks begin here ***************** //
  //- to show/hide sidebar of dashboard 
  $scope.$parent.isSidebarActive = true;
  $scope.showSaveBtn = true;
  $scope.showEditBtn = false;
  $scope.mMatSubCatData = [];
  $scope.bulkAddons = [];
  //- for title
  TemplateService.getTitle("AddonMaster");

  // obj for validation of select for Master Addon
  $scope.masterAddon = {
    materialCategory: "",
    materialSubCategory: "",
    UOM1: "",
    UOM2: "",
    UOM3: "",
    finalUOM: "",
    linkedkeyValue: ""
  }


  // *************************** default functions begin here  ********************** //
  //- to get access permissions
  $scope.getAccessPermissions = function () {
    //- for authorization
    usersRoleService.getUserCrudRole('Master', 'Addon_Master', function (response) {
      if (response) {
        $scope.role = response;
        console.log('****.......... $scope.role in Addon_Master...... ****', $scope.role);
      } else {
        // Infinite toastr. hide only when clicked to it.
        toastr[response.status]('', response.message, {
          timeOut: 0,
          extendedTimeOut: 0
        });
      }
    });
  }
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

      $scope.mMatCatData = data.mMatData;
      $scope.mUomData = data.mUomData;
      $scope.showSaveBtn = data.saveBtn;
      $scope.showEditBtn = data.editBtn;

      if (angular.isDefined(data.addonTypeData)) {
        $scope.formData = data.addonTypeData;
        $scope.selectedMatCat = $scope.formData.materialCat;
        $scope.selectedMatSubCat = $scope.formData.materialSubCat;
        $scope.selectedRateUom = $scope.formData.rate.uom;
        $scope.selectedAdditionalUom = $scope.formData.quantity.additionalInputUom;
        $scope.selectedKinkedKeyUom = $scope.formData.quantity.linkedKeyUom;
        $scope.selectedFinalUom = $scope.formData.quantity.finalUom;
      } else {
        $scope.formData = {
          showQuantityFields: true,
          showRateFields: true,
          rate: {},
          quantity: {},
          allowAtAssSubAss: false
        }
        $scope.selectedMatCat = "";
        $scope.selectedMatSubCat = "";
        $scope.selectedRateUom = "";
        $scope.selectedAdditionalUom = "";
        $scope.selectedKinkedKeyUom = "";
        $scope.selectedFinalUom = "";
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
    $scope.validationObj = {};
    masterAddonService.getValidationStatus(addonTypeData, function (tempObj) {
      $scope.validationObj = tempObj;
      if (tempObj.errorCount == 0) {
        masterAddonService.addOrEditAddonType(addonTypeData, function (data) {
          if (data.value) {
            toastr.success('Addon added/updated successfully');
            $scope.getAddonData();
            $scope.cancelModal();
          } else {
            toastr.error('There is some error while adding it');
          }
        });
      }
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
      if (_.isEmpty(data.data)) {
        toastr.success('Record deleted successfully');
      } else {
        toastr.error('Record cannot deleted.Dependency on ' + data.data[0].model + ' database');
      }
      $scope.getAddonData();
      $scope.cancelModal();
    });
  }

  //- function for pagination of master addons' records
  $scope.getPaginationData = function (page, numberOfRecords, keyword) {
    // if (angular.isUndefined(keyword) || keyword == '') {
    //   if (numberOfRecords != '10') {
    //     masterAddonService.getPaginationData(page, numberOfRecords, null, function (data) {
    //       $scope.addonData = data.results;
    //       masterAddonService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
    //         $scope.obj = obj;
    //       });
    //     });
    //   } else {
    //     masterAddonService.getPaginationData(page, null, null, function (data) {
    //       $scope.addonData = data.results;
    //       masterAddonService.getPaginationDetails(page, 10, data, function (obj) {
    //         $scope.obj = obj;
    //       });
    //     });
    //   }
    // } else {
    masterAddonService.getPaginationData(page, numberOfRecords, keyword, function (data) {
      $scope.addonData = data.results;
      masterAddonService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
        $scope.obj = obj;
      });
    });
    // }
  }

  // //- function to search the text in table
  // $scope.serachText = function (keyword, count) {
  //   masterAddonService.getPaginationData(null, null, keyword, function (data) {
  //     $scope.addonData = data.results;
  //     masterAddonService.getPaginationDetails(1, count, data, function (obj) {
  //       $scope.obj = obj;
  //     });
  //   });
  // }

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
    masterAddonService.deleteBulkAddons(addons, function (data) {
      if (_.isEmpty(data.data)) {
        toastr.success('Record deleted successfully');
      } else {
        toastr.error('Record cannot deleted.Dependency on ' + data.data[0].model + ' database');
      }
      $scope.cancelModal();
      $scope.getAddonData();
      $scope.bulkAddons = [];
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
  //- to select Nos or Hrs
  //- 2nd toggle button
  $scope.setToggleForQuantity = function (formData) {
    formData.showQuantityFields = !formData.showQuantityFields;
    // formData.showFields = formData.showQuantityFields;
  }
  //- to select Nos or Hrs
  //- 1st toggle button
  $scope.setToggleForRate = function (formData) {
    formData.showRateFields = !formData.showRateFields;
    // formData.showMulFact = formData.showRateFields;
  }

  // *************************** init all default functions begin here ************** //
  //- to initilize the default function 
  $scope.init = function () {
    $scope.getAccessPermissions();
    if (angular.isDefined($scope.role)) {
      if ($scope.role.read) {
        $scope.getAddonData();
      }
    }
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