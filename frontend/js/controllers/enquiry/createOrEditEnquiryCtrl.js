
myApp.controller('createOrEditEnquiryCtrl', function ($stateParams, $scope, $http,createOrEditEnquiryService) {

    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 

    // *************************** default functions begin here  ********************** //
    
    // *************************** functions to be triggered form view begin here ***** //    
 
    $scope.$parent.isSidebarActive = false;
    if(angular.isDefined($stateParams.enquiryId)){
    }

   $scope.addEnquiryData = function(formData){
      console.log('**** inside function_name of createOrEditEnquiry00000000000000000Ctrl.js ****', formData);  
      createOrEditEnquiryService.createEnquiry(formData, function(data){

        });
    }


});