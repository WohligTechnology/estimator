myApp.controller('enquiryCtrl', function ($scope, $state, $uibModal, enquiryService) {

  $scope.$parent.isSidebarActive = true;
 
  //$scope.ID = $routeParams.id;
  $scope.getCustomerData = function () {
    enquiryService.getCustomerData(function (data) {
      $scope.customerData = data;     
    });
  }

  $scope.getEnquiryData = function () {
    enquiryService.getEnquiryData(function (data) {
      $scope.tableData = data; 
    });
  }

  // table data
 // $scope.tableData = enquiryService.getEnquiryData();
 
  //Edit Enquries Modal
  $scope.addEnquiryModal = function () {
    $scope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/content/enquiry/createEnquiry.html',
      scope: $scope,
      size: 'md',
    });
  };


  $scope.addEnquiry = function(formData,selectedCustomer){
    formData.customerId = selectedCustomer._id;
    enquiryService.createEnquiry(formData, function(data){
      $state.go('app.editEnquiry', {enquiryId:data._id});
    });
  }

  $scope.cancelModal = function () {
      $scope.modalInstance.dismiss();
  }
  
  $scope.init = function () {
    $scope.getCustomerData();
    $scope.getEnquiryData();
    
  }

  $scope.init();

});