myApp.service('customerService', function (NavigationService) {

  var bulkArray = [];

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
      callback(data);
    });
  }
  //- delete customer
  this.deleteCustomer = function (customerId, callback) {
    var idsArray = [];
    idsArray.push(customerId);
    NavigationService.delete('Web/delRestrictions/Customer', {idsArray: idsArray}, function (data) {
      callback(data);
    });
  }

  //- get pagination data
  this.getPaginationData = function (pageNumber, count, searchKeyword, callback) {
    NavigationService.apiCall('Customer/search', {
      keyword: searchKeyword,
      totalRecords: count,
      page: pageNumber
    }, function (data) {
      callback(data.data);
    });
  }
  //- get details about pagination
  this.getPaginationDetails = function (pageNumber, count, data, callback) {
    var obj = {};
    obj.pageNumber = pageNumber;
    obj.pageStart = (pageNumber - 1) * count + 1;
    obj.total = data.total;
    if (obj.total <= pageNumber * count) {
      obj.pageEnd = obj.total;
    } else {
      obj.pageEnd = pageNumber * count;
    }
    obj.numberOfPages = Math.ceil((obj.total) / count);
    obj.pagesArray = [];
    for (var i = 0; i < obj.numberOfPages; i++) {
      obj.pagesArray[i] = i + 1;
    }
    obj.count = data.options.count;
    callback(obj);
  }
  //- form an array of bulk Ids
  this.selectBulkCustomers = function (checkboxStatus, customerId, callback) {
    if (checkboxStatus == true) {
      bulkArray.push(customerId);
    } else {
      _.remove(bulkArray, function (record) {
        return record == customerId;
      });
    }
    callback(bulkArray);
  }
  //- form an array of Ids of all customers for deletion
  this.selectAll = function (customers, checkboxStatus, callback) {
    bulkArray = [];
    if (checkboxStatus == true) {
      angular.forEach(customers,  function (obj) {
        var customerId = obj._id;
        bulkArray.push(customerId);
      });
    }
    callback(bulkArray);
  }
  //- delete bulk customers
  this.deleteBulkCustomers = function (customers, callback) {
    NavigationService.apiCall('Web/delRestrictions/Customer', {idsArray: customers}, function (data) {
      callback(data);
    });
  }

});