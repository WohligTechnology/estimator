
myApp.controller('createOrEditEnquiryCtrl', function ($rootScope, $scope, $http, $timeout, $uibModal, createOrEditEnquiryService) {

    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = false;
    $scope.formData; 

    // *************************** default functions begin here  ********************** //
    $scope.getCustomerData = function () {
        createOrEditEnquiryService.getCustomerData(function (data) {
          $scope.customerData = data;
        });
      }
    
    



    // *************************** functions to be triggered form view begin here ***** //    
    $scope.addDetails = function(formData){
        console.log('**** formData ****',formData);
        createOrEditEnquiryService.createDetail(formData);
    }

    $scope.init = function () {
        $scope.getCustomerData();
      }
        $scope.init();

});