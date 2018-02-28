myApp.controller('masterExtraCtrl', function ($scope, toastr, $uibModal, masterExtraService, TemplateService) {


  // *************************** default variables/tasks begin here ***************** //
  //- to show/hide sidebar of dashboard 
  $scope.$parent.isSidebarActive = true;
  $scope.showSaveBtn = true;
  $scope.showEditBtn = false;
//  $scope.bulkExtras = [];
  //- for title
  TemplateService.getTitle("ExtraMaster");



  // *************************** default functions begin here  ********************** //
  //- function to get all extras data
  $scope.getPaginationData = function (page, numberOfRecords, keyword) {
    masterExtraService.getPaginationData(page, numberOfRecords, keyword, function (data) {
      $scope.extraData = data.results;
      masterExtraService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
        $scope.obj = obj;
      });
    });
  }


  // *************************** functions to be triggered form view begin here ***** // 
  //- modal to create new extra 
  $scope.addOrEditExtraModal = function (operation, extra) {
    //- obj for validation of select 
    $scope.extraMaster = {
      rateUom: "",
      quantityUOm: ""
    }
    masterExtraService.getExtraModalData(operation, extra, function (data) {

      $scope.formData = data.extra;
      $scope.uoms = data.uoms;

      if (operation == "update") {
        $scope.selectedRateUom = extra.rate.uom;
        $scope.selectedQuantityUom = extra.quantity.uom;
      } else {
        $scope.selectedRateUom = "";
        $scope.selectedQuantityUom = "";
      }

      $scope.showSaveBtn = data.saveBtn;
      $scope.showEditBtn = data.editBtn;
      $scope.modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/content/master/extra/createOrEditExtra.html',
        scope: $scope,
        size: 'md'
      });
    });
  }
  //- function to  create new customer
  $scope.addOrEditExtra = function (extraData, selectedRateUom, selectedQuantityUom) {
    extraData.rate.uom = selectedRateUom;
    extraData.quantity = {
      uom: selectedQuantityUom
    }
    var errorCount = 0;
    if (_.isEmpty(selectedRateUom)) {
      $scope.extraMaster.rateUom = "Select UOM for Rate."
      errorCount++;
    }
    if (_.isEmpty(selectedQuantityUom)) {
      $scope.extraMaster.quantityUom = "Select UOM for Quantity."
      errorCount++;
    }
    if (errorCount == 0) {
      masterExtraService.addOrEditExtra(extraData, function (data) {
        toastr.success('Extra added/updated successfully');
        $scope.cancelModal();
      });
    }
  }

  //- modal to confirm extra deletion
  $scope.deleteExtraModal = function (extraId, getFunction) {
    $scope.idToDelete = extraId;
    $scope.functionToCall = getFunction;

    $scope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
      scope: $scope,
      size: 'md'
    });
  }
  //- function for  extra deletion
  $scope.deleteExtra = function (extraId) {
    masterExtraService.deleteBulkExtras(extraId, function (data) {
      if (_.isEmpty(data.data)) {
        toastr.success('Record deleted successfully');
      } else {
        toastr.error('Record cannot deleted.Dependency on ' + data.data[0].model + ' database');
      }
      $scope.cancelModal();
    },'singleExtra');
  }

  //- to dismiss modal instance
  $scope.cancelModal = function () {
    $scope.modalInstance.dismiss();
    $scope.getPaginationData(1, 10);
  }
  //- function to delete extra
  $scope.deleteBulkExtras = function (extras) {
    masterExtraService.deleteBulkExtras(extras, function (data) {
      if (_.isEmpty(data.data)) {
        toastr.success('Record deleted successfully');
      } else {
        toastr.error('Record cannot deleted.Dependency on ' + data.data[0].model + ' database');
      }
      $scope.cancelModal();
      $scope.bulkExtras = [];
      $scope.checkAll = false;
      $scope.checkboxStatus = false;
    });
  }
  //- function to get bulk extras
  $scope.selectBulkExtras = function (checkboxStatus, addonId) {
    masterExtraService.selectBulkExtras(checkboxStatus, addonId, function (data) {
      $scope.bulkExtras = data;
    });
  }
  //- to select all records
  $scope.selectAll = function (extras, checkboxStatus) {
    masterExtraService.selectAll(extras, checkboxStatus, function (data) {
      $scope.bulkExtras = data;
    });
  }


  // *************************** init all default functions begin here ************** //
  //- to initilize the default function 
  $scope.init = function () {
    $scope.getPaginationData(1, 10);
  }
  $scope.init();

});