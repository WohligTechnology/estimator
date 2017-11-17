myApp.controller('createOrEditEnquiryCtrl', function ($stateParams, toastr, $uibModal, $interpolate, $state, $scope, $http, createOrEditEnquiryService, createOrEditEstimateService) {

  // *************************** default variables/tasks begin here ***************** //

  //- to show/hide sidebar of dashboard 
  $scope.$parent.isSidebarActive = false;
  $scope.showEstimateBtn = false;
  $scope.formData = {
    enquiryDetails: {},
    enquiryInfo: {},
    keyRequirement: {},
    technicalRequirement: {},
    commercialRequirement: {},
    preQualificationCriteria: {}
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
      toastr.success('Record Added Successfully', 'EnquiryData Added!');
      if (angular.isUndefined(formData._id)) {}
    });
  }
  $scope.saveAssemblyNameModal = function (enquiryId) {
    $scope.enquiryId = enquiryId;
    //- get assembly name to create 
    //   createOrEditEnquiryService.getAllAssemblyNumbers(function (data) {
    //    $scope.assemblyData = data;
    $scope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/content/enquiry/enquiryModal/getAssemblyName.html',
      scope: $scope,
      size: 'md',
    });
    //   });
  }
  $scope.saveAssemblyName = function (assName, enquiryId) {
    createOrEditEnquiryService.saveAssemblyName(assName, enquiryId, function (data) {
      $state.go('app.createEstimate', {
        'estimateId': data._id
      });
    });
  }

  // $scope.importAssembly = function (estimateId, assemblyNumber) {
  //   $state.go('app.createEstimate', {
  //     'estimateId': estimateId, //- right now it is static but in future it will be dynamic
  //     'assemblyNumber':assemblyNumber
  //   });
  // }
  //- dismiss current modalInstance
  $scope.cancelModal = function () {
    $scope.modalInstance.dismiss();
  }

  // *************************** init all default functions begin here ************** //
  //- to initilize the default function  
  $scope.init = function () {
    $scope.getEnquiryObj();
    $scope.getCustomerData();
  }

  $scope.init();



});