myApp.controller('createOrEditEnquiryCtrl', function ($stateParams, $uibModal, $interpolate, $timeout, $state, $scope, $http, createOrEditEnquiryService) {

  // *************************** default variables/tasks begin here ***************** //

  //- to show/hide sidebar of dashboard 
  $scope.$parent.isSidebarActive = false;
  $scope.showEstimateBtn = false;
  $scope.operationStatus = "";
  $scope.formData = {
    enquiryDetails:{},
    enquiryInfo:{},
    keyRequirement:{},
    technicalRequirement:{},
    commercialRequirement:{},
    preQualificationCriteria:{}
  };


  if (angular.isDefined($stateParams.enquiryId)) {
    $scope.showEstimateBtn = true;
    $scope.enquiryId = $stateParams.enquiryId;
  }


  // *************************** default functions begin here  ********************** //

  $scope.getEnquiryObj = function () {
    createOrEditEnquiryService.getEnquiryObj($stateParams.enquiryId, function (data) {
      $scope.formData = data;
    });
  }
  $scope.getCustomerData = function () {
    createOrEditEnquiryService.getCustomerData(function (data) {
      $scope.customerData = data;
    });
  }


  // *************************** functions to be triggered form view begin here ***** //      

  $scope.addEnquiryData = function (formData, operation) {
    createOrEditEnquiryService.createEnquiry(formData, function (data) {
      $scope.operationStatus = "Record Added Successfully";
      if (angular.isUndefined(formData._id)) {
        
      }

      $timeout(function () {
        $scope.operationStatus = "";
      }, 5000);
    });
  }
  $scope.saveAssemblyNameModal = function (enquiryId) {
    $scope.enquiryId = enquiryId;
    //- get assembly name to create 
    $scope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/content/enquiry/enquiryModal/getAssemblyName.html',
      scope: $scope,
      size: 'md',
    });
  }
  $scope.saveAssemblyName = function (assName, enquiryId) {
    createOrEditEnquiryService.saveAssemblyName(assName, enquiryId, function (data) {
      $state.go('app.createEstimate',{'estimateId':data._id});
    });
  }

  // *************************** init all default functions begin here ************** //
  //- to initilize the default function  
  $scope.init = function () {
    $scope.getEnquiryObj();
    $scope.getCustomerData();
  }

  $scope.init();



});