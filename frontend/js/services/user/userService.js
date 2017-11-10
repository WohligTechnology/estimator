myApp.service('userService', function ($http, $uibModal, NavigationService) {

  var bulkArray = [];
  //- get user view
  this.getUserData = function (callback) {
    NavigationService.boxCall('User/search', function (data) {
      callback(data.data);
    });
  }
  //- get user modal data
  this.getUserModalData = function (operation, user, callback) {
    var userDataObj = {};

    if (angular.isDefined(user)) {
      userDataObj.user = user;
    }
    if (operation == "save") {
      userDataObj.saveBtn = true;
      userDataObj.editBtn = false;
    } else if (operation == "update") {
      userDataObj.saveBtn = false;
      userDataObj.editBtn = true;
    }
    callback(userDataObj);
  }
  //- add or edit user
  this.addOrEditUser = function (userData, callback) {
    NavigationService.apiCall('User/createUser', userData, function (data) {
      callback();
    });
  }
  //- delete user
  this.deleteUser = function (userId, callback) {
    var deleteUserObj = {
      _id: userId
    };
    NavigationService.delete('User/delete', deleteUserObj, function (data) {
      callback(data);
    });
  }
  //- get data of pagination
  this.getPaginationDatawithoutKeyword = function (pageNumber, callback) {
    NavigationService.apiCall('User/search', {
      page: pageNumber
    }, function (data) {
      callback(data.data);
    });
  }
  //- get pagination data with search-keyword
  this.getPaginationDataWithKeyword = function (pageNumber, count, searchKeyword, callback) {
    NavigationService.apiCall('User/search', {
      keyword: searchKeyword,
      totalRecords: count,
      page: pageNumber
    }, function (data) {
      callback(data.data);
    });
  }
  //- get page data with show records
  this.getPageDataWithShowRecords = function (pageNumber, numberOfRecords, callback) {
    NavigationService.apiCall('User/search', {
      totalRecords: numberOfRecords,
      page: pageNumber
    }, function (data) {
      callback(data.data);
    });
  }
  //- get data of seach results
  this.getSearchResult = function (searchKeyword, callback) {
    NavigationService.apiCall('User/search', {
      keyword: searchKeyword
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
  this.selectBulkUsers = function (checkboxStatus, userId, callback) {
    if (checkboxStatus == true) {
      bulkArray.push(userId);
    } else {
      _.remove(bulkArray, function (record) {
        return record == userId;
      });
    }
    callback(bulkArray);
  }
  //- form an array of Ids of all users for deletion
  this.selectAll = function(users, checkboxStatus, callback) {
    bulkArray = [];
    if (checkboxStatus == true) {
      angular.forEach(users,  function (obj) {
        var userId = obj._id;
        bulkArray.push(userId);
      });
    } else {
      angular.forEach(users,  function (obj) {
        var userId = obj._id;
        _.remove(bulkArray, function (record) {
          return record == userId;
        });
      });
    }
    callback(bulkArray);
  }
  //- delete bulk users
  this.deleteBulkUsers = function (users, callback) {
    NavigationService.apiCall('User/deleteMultipleUsers', {idsArray: users}, function (data) {
      callback();
    });
  }

});