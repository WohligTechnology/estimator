myApp.service('customerService', function ($http, NavigationService, $uibModal) {

  //- get customer view

  this.getCustomerData = function (callback) {
    NavigationService.boxCall('Customer/search', function (data) {
      var customers = data.data.results;
      callback(customers);
    });
  }

  this.getCustomerModalData = function (operation, customer, callback) {
    var customerDataObj = {};

    if (angular.isDefined(customer)) {
      customerDataObj.customer = customer;
    }
    if (operation == "save") {
      customerDataObj.saveBtn = true;
      customerDataObj.editBtn = false;
    } else if (operation == "update") {
      customerDataObj.saveBtn = false;
      customerDataObj.editBtn = true;
    }
    callback(customerDataObj);
  }

  this.addOrEditCustomer = function (customerData, callback) {
    
    NavigationService.apiCall('Customer/save', customerData, function (data) {
      var customer = data.data.results;
      callback(customer);
    });
  }

  this.deleteCustomer = function (customerId, callback) {
    var deleteCustomerObj = {
      _id: customerId
    };
    NavigationService.delete('Customer/delete', deleteCustomerObj, function (data) {
      callback(data);
    });
  }


});