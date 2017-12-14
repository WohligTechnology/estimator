myApp.controller('createOrEditEnquiryCtrl', function ($stateParams, toastr, $uibModal, $interpolate, $state, $scope, createOrEditEnquiryService) {

  // *************************** default variables/tasks begin here ***************** //

  //- to show/hide sidebar of dashboard 
  $scope.$parent.isSidebarActive = false;
  $scope.showEstimateBtn = false;
  $scope.editPermmission = false;
  $scope.formData = {
    enquiryDetails: {},
    enquiryInfo: {},
    keyRequirement: {},
    technicalRequirement: {},
    commercialRequirement: {},
    preQualificationCriteria: {}
  };
  $scope.options = {
    mobile: {
      phone: true,
      phoneRegionCode: 'IN'
    }
  };


  if (angular.isDefined($stateParams.enquiryId)) {
    $scope.showEstimateBtn = true;
    $scope.enquiryId = $stateParams.enquiryId;
    $scope.editPermmission = true;
  }


  // *************************** default functions begin here  ********************** //
  //- to get enquiry object
  $scope.getEnquiryObj = function () {
    createOrEditEnquiryService.getEnquiryObj($stateParams.enquiryId, function (data) {
      $scope.formData = data;
      if ($stateParams.enquiryId) {
        $scope.formData.enquiryDetails.estimator = data.enquiryDetails.estimator;
        $scope.formData.customerDataObj = data.customerId;
      }
    });
    //- to get all customer names and their locations
    createOrEditEnquiryService.getCustomerData(function (data) {
      $scope.customerData = data;
    });
    //- to get all user names
    createOrEditEnquiryService.getUserData(function (data) {
      $scope.userData = data;
    });
    //- to get all versions data
    createOrEditEnquiryService.getEstimateVersionData($scope.enquiryId, function (data) {
      $scope.versionData = data;
    });
  }


  // *************************** functions to be triggered form view begin here ***** //      
  //- add  enquiry data
  $scope.addEnquiryData = function (formData) {
    createOrEditEnquiryService.createEnquiry(formData, function (data) {
      if ($scope.editPermmission) {
        toastr.success('Enquiry Updated Successfully');
      } else {
        toastr.success('Enquiry Added Successfully');
        $state.go('app.editEnquiry', {
          'enquiryId': data._id
        });
      }
    });
  }
  //- to bind customer data to formData
  $scope.setCustomerData = function (customerDataObj) {
    $scope.formData.enquiryDetails.customerLocation = customerDataObj.location;
    $scope.formData.enquiryDetails.customerId = customerDataObj._id;
    $scope.formData.enquiryDetails.customerName = customerDataObj.customerName;
    $scope.formData.commercialRequirement.paymentTerms = customerDataObj.paymentTerms;
  }
  //- to bind user name to formData
  $scope.setEstimator = function (userDataObj) {
    $scope.formData.enquiryDetails.estimator = userDataObj._id;
  }
  //- to add assembly or to import assembly
  $scope.saveAssemblyNameModal = function (enquiryId) {
    $scope.enquiryId = enquiryId;
    //- get assembly name to create 
    createOrEditEnquiryService.getAllAssemblyNumbers(function (data) {
      $scope.assemblyData = data;
      $scope.modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/content/enquiry/enquiryModal/getAssemblyName.html',
        scope: $scope,
        size: 'md',
      });
    });
  }
  //- create new assembly
  $scope.saveAssemblyName = function (assName, enquiryId) {
    createOrEditEnquiryService.saveAssemblyName(assName, enquiryId, function (data) {
      $state.go('app.createEstimate', {
        'estimateId': data._id
      });
    });
  }
  //- import assembly
  $scope.importAssembly = function (assemblyNumber) {
    createOrEditEnquiryService.getImportAssemblyData(assemblyNumber, function (data) {
      $state.go('app.createEstimate', {
        'estimateId': data._id,
      });
    });
  }
  //- dismiss current modalInstance
  $scope.cancelModal = function () {
    $scope.modalInstance.dismiss();
  }

  // *************************** init all default functions begin here ************** //
  //- to initilize the default function  
  $scope.init = function () {
    $scope.getEnquiryObj();
  }

  $scope.init();



});