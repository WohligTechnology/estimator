myApp.service('customerService', function ($http, NavigationService, $uibModal) {

  //- get customer view
  this.getCustomerData = function (callback) {
    NavigationService.boxCall('Customer/search', function (data) {
      callback(data.data);
    });
  }
  //- get customer modal data
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
  //- add or edit customer
  this.addOrEditCustomer = function (customerData, callback) {

    NavigationService.apiCall('Customer/save', customerData, function (data) {
      var customer = data.data.results;
      callback(customer);
    });
  }
  //- delete customer
  this.deleteCustomer = function (customerId, callback) {
    var deleteCustomerObj = {
      _id: customerId
    };
    NavigationService.delete('Customer/delete', deleteCustomerObj, function (data) {
      callback(data);
    });
  }
  //- get data of pagination
  this.getPaginationData = function (pageNumber, callback) {
    NavigationService.apiCall('Customer/search', {
      page: pageNumber
    }, function (data) {
      callback(data.data);
    });
  }
  //- get data of seach results
  this.getSearchResult = function (searchKeyword, callback) {
    NavigationService.apiCall('Customer/search', {
      keyword: searchKeyword
    }, function (data) {
      callback(data.data.results);
    });
  }
  //- get details about pagination
  this.getPaginationDetails = function(pageNumber, data, callback){
    var obj = {};
    obj.pageStart = (pageNumber-1)*10+1;
    obj.total = data.total;
    if(obj.total <= pageNumber*10){
      obj.pageEnd = obj.total;
    } else {
      obj.pageEnd = pageNumber*10;
    } 
    obj.numberOfPages = Math.ceil((obj.total) / 10);
    obj.pagesArray = [];
    for (var i = 0; i < obj.numberOfPages; i++) {
      obj.pagesArray[i] = i + 1;
    }
    callback(obj);
  }

});