myApp.controller('estimateCtrl', function ($rootScope, $scope, $http, toastr, $uibModal, estimateService) {
  $scope.$parent.isSidebarActive = true;
  $scope.bulkEstimates = []; //- for multiple records deletion
  $scope.checkAll = false; //- for all records selection
  $scope.checkboxStatus = false; //- for multiple records selection
  //- table data
  $scope.tableData = [{
      "id": "1",
      "name": "kishori",
      "cname": "1",
      "dname": "kishori",
      "cid": "1",
      "pname": "kishori",
      "did": "1",
      "bname": "kishori",

    },
    {
      "id": "1",
      "name": "kishori",
      "cname": "1",
      "dname": "kishori",
      "cid": "1",

    },
    {
      "id": "1",
      "name": "kishori",
      "cname": "1",
      "dname": "kishori",
      "cid": "1",
    }
  ]

  //- to delete estimate 
  $scope.deleteItem = function () {
    $scope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/modal/delete.html',
      scope: $scope,
      size: 'sm',
    });
  }

  //- to edit estimate
  $scope.allEstimateEdit = function () {
    $scope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/content/estimate/estimateModal/allEstimateEdit.html',
      scope: $scope,
      size: 'md',
    });
  }

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
    // $scope.getEstimateData();
  }
  $scope.init();


});