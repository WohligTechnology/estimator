myApp.controller('enquiryCtrl', function ($scope, $state, $uibModal, enquiryService) {


  // *************************** default variables/tasks begin here ***************** //
  //- to show/hide sidebar of dashboard   
  $scope.$parent.isSidebarActive = true;
  $scope.bulkEnquiries = [];

  
  // *************************** default functions begin here  ********************** //
  //- function to get all enquiries data 
  $scope.getEnquiryData = function () {
    enquiryService.getEnquiryData(function (data, obj) {
      $scope.detailsActive = obj.detailsActive;
      $scope.infoActive = obj.infoActive;
      $scope.keyReqActive = obj.keyReqActive;
      $scope.techReqsActive = obj.techReqsActive;
      $scope.CommReqActive = obj.CommReqActive;
      $scope.PreQuaCriteriaActive = obj.PreQuaCriteriaActive;

      $scope.tableData = data.results;
      enquiryService.getPaginationDetails(1, 10, data, function (obj) {
        $scope.obj = obj;
      });
    });
  }


  // *************************** functions to be triggered form view begin here ***** //      
  //- modal to confirm Enquiry deletion
  $scope.deleteEnquiryModal = function (enquiryId, getFunction) {
    $scope.idToDelete = enquiryId;
    $scope.functionToCall = getFunction;

    $scope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
      scope: $scope,
      size: 'md'
    });

  }
  //- function for  enquiry deletion
  $scope.deleteEnquiry = function (enquiryId) {
    enquiryService.deleteEnquiry(enquiryId, function (data) {
      $scope.operationStatus = "Record deleted successfully";
      $scope.cancelModal();
      $scope.getEnquiryData();
    });
  }

  //-  function for pagination of enquiries' records
  $scope.getPaginationData = function (page, numberOfRecords, keyword) {
    if (angular.isUndefined(keyword) || keyword == '') {
      if (numberOfRecords != '10') {
        enquiryService.getPageDataWithShowRecords(page, numberOfRecords, function (data) {
          $scope.tableData = data.results;
          enquiryService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
            $scope.obj = obj;
          });
        });
      } else {
        enquiryService.getPaginationDatawithoutKeyword(page, function (data) {
          $scope.tableData = data.results;
          enquiryService.getPaginationDetails(page, 10, data, function (obj) {
            $scope.obj = obj;
          });
        });
      }
    } else {
      enquiryService.getPaginationDataWithKeyword(page, numberOfRecords, keyword, function (data) {
        $scope.tableData = data.results;
        enquiryService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
          $scope.obj = obj;
        });
      });
    }
  }

  //- function to search the text in table
  $scope.serachText = function (keyword, count) {
    enquiryService.getSearchResult(keyword, function (data) {
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

  //- modal to confirm bulk enquiries deletion
  $scope.deleteBulkEnquiriesModal = function (enquiryIdArray, getFunction) {
    $scope.idsToDelete = enquiryIdArray;
    $scope.functionToCall = getFunction;

    $scope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/content/deleteBulkModal.html',
      scope: $scope,
      size: 'md'
    });
  }
  //- function to delete enquiry
  $scope.deleteBulkEnquiries = function (enquiries) {
    enquiryService.deleteBulkEnquiries(enquiries, function (data) {
      $scope.operationStatus = "Records deleted successfully";
      $scope.cancelModal();
      $scope.getEnquiryData();
    });
  }
  //- function to get bulk enquiries
  $scope.selectBulkEnquiries = function (checkboxStatus, enquiryId) {
    enquiryService.selectBulkEnquiries(checkboxStatus, enquiryId, function (data) {
      if (data.length >= 1) {
        $scope.recordSelected = true;
      } else {
        $scope.recordSelected = false;
      }
      $scope.bulkEnquiries = data;
    });
  }
  //- to select all records
  $scope.selectAll = function (enquiries, checkboxStatus) {
    enquiryService.selectAll(enquiries, checkboxStatus, function (data) {
      $scope.bulkEnquiries = data;
    });
  }


  // *************************** init all default functions begin here ************** //
  //- to initilize the default function   
  $scope.init = function () {
    $scope.getEnquiryData();
  }
  $scope.init();

});