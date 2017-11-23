myApp.controller('customerCtrl', function ($scope, toastr, $http, $uibModal, customerService) {


  // *************************** default variables/tasks begin here ***************** //
  //- to show/hide sidebar of dashboard 
  $scope.$parent.isSidebarActive = true;
  $scope.showSaveBtn = true;
  $scope.showEditBtn = false;
  $scope.bulkCustomers = []; // for multiple records deletion
  $scope.checkAll = false; //- for all records selection
  $scope.checkboxStatus = false; //- for multiple records selection


  // *************************** default functions begin here  ********************** //
  //- function to get all customers data
  $scope.getCustomerData = function () {
    customerService.getCustomerData(function (data) {
      $scope.customerData = data.results;
      customerService.getPaginationDetails(1, 10, data, function (obj) {
        $scope.obj = obj;
      });
    });
  }


  // *************************** functions to be triggered form view begin here ***** // 
  //- modal to addd or edit customer 
  $scope.addOrEditCustomerModal = function (operation, customer) {
    customerService.getCustomerModalData(operation, customer, function (data) {
      $scope.formData = data.customer;
      $scope.showSaveBtn = data.saveBtn;
      $scope.showEditBtn = data.editBtn;
      $scope.operation = operation;

      $scope.modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/content/customer/modal/createOrEditCustomer.html',
        scope: $scope,
        size: 'md'
      });

    });
  }
  //- to add or edit customer
  $scope.addOrEditCustomer = function (operation, customerData) {
    customerService.addOrEditCustomer(customerData, function (data) {
      if (operation == 'save') {
        toastr.success('Record added successfully');
      } else {
        toastr.success('Record updated successfully');
      }
      $scope.getCustomerData();
      $scope.cancelModal();
    });
  }
  //- customer deletion modal
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
  //- to delete customer
  $scope.deleteCustomer = function (customerId) {
    customerService.deleteCustomer(customerId, function (data) {
      toastr.success('Record deleted successfully');
      $scope.cancelModal();
      $scope.getCustomerData();
    });
  }
  //- for pagination of cusomers' records
  $scope.getPaginationData = function (page, numberOfRecords, keyword) {
    if (angular.isUndefined(keyword) || keyword == '') {
      if (numberOfRecords != '10') {
        customerService.getPageDataWithShowRecords(page, numberOfRecords, function (data) {
          $scope.customerData = data.results;
          customerService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
            $scope.obj = obj;
          });
        });
      } else {
        customerService.getPaginationDatawithoutKeyword(page, function (data) {
          $scope.customerData = data.results;
          customerService.getPaginationDetails(page, 10, data, function (obj) {
            $scope.obj = obj;
          });
        });
      }
    } else {
      customerService.getPaginationDataWithKeyword(page, numberOfRecords, keyword, function (data) {
        $scope.customerData = data.results;
        customerService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
          $scope.obj = obj;
        });
      });
    }
  }

  //- to search the text in table
  $scope.serachText = function (keyword, count) {
    customerService.getSearchResult(keyword, function (data) {
      $scope.customerData = data.results;
      customerService.getPaginationDetails(1, count, data, function (obj) {
        $scope.obj = obj;
      });
    });
  }
  //- modal to delete bulk customers
  $scope.deleteBulkCustomersModal = function (customerIdArray, getFunction) {
    $scope.idsToDelete = customerIdArray;
    $scope.functionToCall = getFunction;

    $scope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/content/deleteBulkModal.html',
      scope: $scope,
      size: 'md'
    });
  }
  //- to delete customers
  $scope.deleteBulkCustomers = function (customers) {
    customerService.deleteBulkCustomers(customers, function () {
      $scope.cancelModal();
      $scope.getCustomerData();
      $scope.bulkCustomers = [];
      toastr.success('Record deleted successfully');
    });
  }
  //- to get bulk customers
  $scope.selectBulkCustomers = function (checkboxStatus, customerId) {
    customerService.selectBulkCustomers(checkboxStatus, customerId, function (data) {
      if (data.length >= 1) {
      $scope.bulkCustomers = data;
      }
    });
  }
  //- to select all records
  $scope.selectAll = function (customers, checkboxStatus) {
    customerService.selectAll(customers, checkboxStatus, function (data) {
      $scope.bulkCustomers = data;
    });
  }
  //- to dismiss modal instance
  $scope.cancelModal = function () {
    $scope.modalInstance.dismiss();
  }

  // *************************** init all default functions begin here ************** //
  //- to initilize the default function 
  $scope.init = function () {
    // to get customer Data
    $scope.getCustomerData();
  }
  $scope.init();

});