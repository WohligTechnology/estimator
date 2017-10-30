
myApp.controller('createOrEditEnquiryCtrl', function ($stateParams, $interpolate,  $timeout, $state, $scope, $http, createOrEditEnquiryService) {

    // *************************** default variables/tasks begin here ***************** //
 
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = false;  

    
    // *************************** default functions begin here  ********************** //

    $scope.getEnquiryObj = function(){
      createOrEditEnquiryService.getEnquiryObj($stateParams.enquiryId, function(data){
        $scope.formData = data;
      });
    }
    $scope.getCustomerData = function () {
      createOrEditEnquiryService.getCustomerData(function (data) {
        $scope.customerData = data;     
      });
    }
    $scope.getDefaultStatusMessage = function(){
      $scope.operationStatus = "";
    }

    
    // *************************** functions to be triggered form view begin here ***** //      
       
  $scope.addEnquiryData = function(formData, operation){  
    createOrEditEnquiryService.createEnquiry(formData, function(data){
      $scope.operationStatus = "Record Added Successfully";
      console.log('**** formData ****',formData); 
      if(angular.isUndefined(formData._id)){
        //$state.go('app.editEnquiry', {enquiryId:data._id});
        var url = $interpolate('/enquiry/edit/:' + data._id)($scope);
        console.log('**** url ****', url);
      }      
      $timeout(function () {
        $scope.operationStatus="";
      }, 5000);
    });
  }

  $scope.init = function () {
  $scope.getEnquiryObj(); 
  $scope.getCustomerData();  
  $scope.getDefaultStatusMessage();  
  }
  
  $scope.init();
  


});