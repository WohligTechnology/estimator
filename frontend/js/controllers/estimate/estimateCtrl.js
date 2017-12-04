myApp.controller('estimateCtrl', function ($rootScope, $scope, $http, toastr, $uibModal, estimateService) {

  
  // *************************** default variables/tasks begin here ***************** //
  //- to show/hide sidebar of dashboard   
  $scope.$parent.isSidebarActive = true;
  $scope.bulkEstimates = []; //- for multiple records deletion
  $scope.checkAll = false; //- for all records selection
  $scope.checkboxStatus = false; //- for multiple records selection

  //- to get all estimates data
  $scope.getTableData = function () {
    estimateService.getEstimateData(function (data) {
      $scope.tableData = data.results;
    });
  }


  // *************************** functions to be triggered form view begin here ***** //     
   //- modal to delete estimate
   $scope.deleteEstimateModal = function (estimateId, getFunction) {
    $scope.idToDelete = estimateId;
    $scope.functionToCall = getFunction;

    $scope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
      scope: $scope,
      size: 'md'
    });

  }
  //- to delete estimate
  $scope.deleteEstimate = function (estimateId) {
    estimateService.deleteEstimate(estimateId, function (data) {
      toastr.info('Record deleted successfully');
      $scope.cancelModal();
      $scope.getTableData();
    });
  }

  // //- to edit estimate
  // $scope.allEstimateEdit = function () {
  //   $scope.modalInstance = $uibModal.open({
  //     animation: true,
  //     templateUrl: 'views/content/estimate/estimateModal/allEstimateEdit.html',
  //     scope: $scope,
  //     size: 'md',
  //   });
  // }

  //- to dismiss modal instance
  $scope.cancelModal = function () {
    $scope.modalInstance.dismiss();
  }
  //- modal to delete bulk estimates
  $scope.deleteBulkEstimatesModal = function (estimateIdArray, getFunction) {
    $scope.idsToDelete = estimateIdArray;
    $scope.functionToCall = getFunction;

    $scope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/content/deleteBulkModal.html',
      scope: $scope,
      size: 'md'
    });
  }
  //- to delete estimate
  $scope.deleteBulkEstimates = function (estimates) {
    estimateService.deleteBulkEstimates(estimates, function () {
      $scope.cancelModal();
      $scope.getEstimateData();
      $scope.bulkEstimates = [];
      toastr.info('Records deleted successfully', 'Estimates Deletion!');
    });
  }
  //- to get bulk estimates
  $scope.selectBulkEstimates = function (checkboxStatus, estimateId) {
    estimateService.selectBulkEstimates(checkboxStatus, estimateId, function (data) {
      $scope.bulkEstimates = data;
    });
  }
  //- to select all records
  $scope.selectAll = function (estimates, checkboxStatus) {
    estimateService.selectAll(estimates, checkboxStatus, function (data) {
      $scope.bulkEstimates = data;
    });
  }


  // *************************** init all default functions begin here ************** //
  //- to initilize the default function 
  $scope.init = function () {
    $scope.getTableData();
  }
  $scope.init();


});