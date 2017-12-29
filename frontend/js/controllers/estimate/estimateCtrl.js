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
      $scope.tableData = data;
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
      if(_.isEmpty(data.data)){
        toastr.success('Record deleted successfully');
      }
      else{
        toastr.error('Record cannot deleted.Dependency on '+ data.data[0].model + ' database');
      }
      $scope.cancelModal();
      $scope.getTableData();
    });
  }
  //- for pagination of estimates' records
  $scope.getPaginationData = function (page, numberOfRecords, keyword) {
    if (angular.isUndefined(keyword) || keyword == '') {
      if (numberOfRecords != '10') {
        estimateService.getPaginationData(page, numberOfRecords, null, function (data) {
          $scope.tableData = data.results;
          estimateService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
            $scope.obj = obj;
          });
        });
      } else {
        estimateService.getPaginationData(page, null, null, function (data) {
          $scope.tableData = data.results;
          estimateService.getPaginationDetails(page, 10, data, function (obj) {
            $scope.obj = obj;
          });
        });
      }
    } else {
      estimateService.getPaginationData(page, numberOfRecords, keyword, function (data) {
        $scope.tableData = data.results;
        estimateService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
          $scope.obj = obj;
        });
      });
    }
  }

  //- to search the text in the table
  $scope.serachText = function (keyword, count) {
    enquiryService.getPaginationData(null, null, keyword, function (data) {
      $scope.tableData = data.results;
      enquiryService.getPaginationDetails(1, count, data, function (obj) {
        $scope.obj = obj;
      });
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
    estimateService.deleteBulkEstimates(estimates, function (data) {
      if(_.isEmpty(data.data)){
        toastr.success('Record deleted successfully');
      }
      else{
        toastr.error('Record cannot deleted.Dependency on '+ data.data[0].model + ' database');
      }
      $scope.cancelModal();
      $scope.getEstimateData();
      $scope.bulkEstimates = [];
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