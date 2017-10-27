myApp.controller('enquiryCtrl', function ($scope, $state, $uibModal, enquiryService) {


    // *************************** default variables/tasks begin here ***************** //
  
    //- to show/hide sidebar of dashboard   
  $scope.$parent.isSidebarActive = true;

    // *************************** default functions begin here  ********************** //
  
    //to get all enquiries 
  $scope.getEnquiryData = function () {
    enquiryService.getEnquiryData(function (data, obj) {
      $scope.detailsActive = obj.detailsActive;
      $scope.infoActive = obj.infoActive;
      $scope.keyReqActive = obj.keyReqActive;
      $scope.techReqsActive = obj.techReqsActive;
      $scope.CommReqActive = obj.CommReqActive;
      $scope.PreQuaCriteriaActive = obj.PreQuaCriteriaActive;
      
      $scope.tableData = data; 
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
  $scope.deleteEnquiry = function (enquiryId) {
    enquiryService.deleteEnquiry(enquiryId, function (data) {
      $scope.operationStatus = "Record deleted successfully";
      $scope.cancelModal();
      $scope.getEnquiryData();
    });
  }

  //cancel modal
  $scope.cancelModal = function () {
      $scope.modalInstance.dismiss();
  }
  
  $scope.init = function () {
    $scope.getEnquiryData();   
  }
  $scope.init();

});