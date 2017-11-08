myApp.controller('customerCtrl', function ($scope, $http, $uibModal, customerService) {

  // *************************** default variables/tasks begin here ***************** //

  //- to show/hide sidebar of dashboard 
  $scope.$parent.isSidebarActive = true;
  $scope.showSaveBtn = true;
  $scope.showEditBtn = false;

  // *************************** default functions begin here  ********************** //

  //- function to get all customers data
  $scope.getCustomerData = function () {
    customerService.getCustomerData(function (data) {
      $scope.customerData = data.results;
      customerService.getPaginationDetails(1, data, function (obj) {
        $scope.obj = obj;
      });
    });
  }


  // *************************** functions to be triggered form view begin here ***** // 

  //- modal to create new customer 
  $scope.addOrEditCustomerModal = function (operation, customer) {
    customerService.getCustomerModalData(operation, customer, function (data) {
      $scope.formData = data.customer;
      $scope.showSaveBtn = data.saveBtn;
      $scope.showEditBtn = data.editBtn;

      $scope.modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/content/customer/modal/createOrEditCustomer.html',
        scope: $scope,
        size: 'md'
      });

    });
  }
  //- function to  create new customer
  $scope.addOrEditCustomer = function (customerData) {
    customerService.addOrEditCustomer(customerData, function (data) {

      $scope.operationStatus = "Record added successfully";
      $scope.getCustomerData();
      $scope.cancelModal();
    });
  }

  //- modal to confirm customer deletion
  $scope.deleteCustomerModal = function (customerId, getFunction) {
    $scope.idToDelete = customerId;
    $scope.functionToCall = getFunction;

    $scope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
      scope: $scope,
      size: 'md'
    });
  }
  //- function to delete user
  $scope.deleteCustomer = function (customerId) {
    customerService.deleteCustomer(customerId, function (data) {
      $scope.operationStatus = "Record deleted successfully";
      $scope.cancelModal();
      $scope.getCustomerData();
    });
  }

  //- function for pagination of cusomers' records
  $scope.getPaginationData = function (page, keyword) {
    if (angular.isUndefined(keyword) || keyword == '') {
      customerService.getPaginationDatawithoutKeyword(page, function (data) {
        $scope.customerData = data.results;
        customerService.getPaginationDetails(page, data, function (obj) {
          $scope.obj = obj;
        });
      });
    } else {
      customerService.getPaginationDataWithKeyword(page, keyword, function (data) {
        $scope.customerData = data.results;
        customerService.getPaginationDetails(page, data, function (obj) {
          $scope.obj = obj;
        });
      });
    }
  }

  //- function to search the text in table
  $scope.serachText = function (keyword) {
    customerService.getSearchResult(keyword, function (data) {
      $scope.customerData = data.results;
      customerService.getPaginationDetails(1, data, function (obj) {
        $scope.obj = obj;
      });
    });
  }

  //- to dismiss modal instance
  $scope.cancelModal = function () {
    $scope.modalInstance.dismiss();
  };


  // *************************** init all default functions begin here ************** //

  //- to initilize the default function 
  $scope.init = function () {
    // to get customer Data
    $scope.getCustomerData();
  }
  $scope.init();

});