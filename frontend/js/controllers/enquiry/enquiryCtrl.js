myApp.controller('enquiryCtrl', function ($scope, $state, $uibModal, enquiryService) {


  // *************************** default variables/tasks begin here ***************** //

  //- to show/hide sidebar of dashboard   
  $scope.$parent.isSidebarActive = true;

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
      enquiryService.getPaginationDetails(1, data, function (obj) {
        $scope.total = obj.total;
        $scope.pageStart = obj.pageStart;
        $scope.pageEnd = obj.pageEnd;
        $scope.numberOfPages = obj.numberOfPages;
        $scope.pagesArray = obj.pagesArray;
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
  $scope.getPaginationData = function (page) {
    enquiryService.getPaginationData(page, function (data) {
      $scope.tableData = data;
      enquiryService.getPaginationDetails(page, data, function (obj) {
        $scope.total = obj.total;
        $scope.pageStart = obj.pageStart;
        $scope.pageEnd = obj.pageEnd;
        $scope.numberOfPages = obj.numberOfPages;
        $scope.pagesArray = obj.pagesArray;
      });
    });
  }

  //- function to search the text in table
  $scope.serachText = function (keyword) {
    enquiryService.getSearchResult(keyword, function (data) {
      $scope.tableData = data;
    });
  }

  //- to dismiss modal instance
  $scope.cancelModal = function () {
    $scope.modalInstance.dismiss();
  }


  // *************************** init all default functions begin here ************** //

  //- to initilize the default function   
  $scope.init = function () {
    $scope.getEnquiryData();
  }
  $scope.init();

});