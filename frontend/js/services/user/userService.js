myApp.service('userService', function ($http, $uibModal, NavigationService) {

  var bulkArray = [];
  // //- get user view
  // this.getUserData = function (callback) {
  //   NavigationService.boxCall('User/search', function (data) {
  //     callback(data.data);
  //   });
  // }
      //- get access level data
      this.getAccessLevels = function (callback) {
        NavigationService.boxCall('Role/getAccessLevels', function (data) {
          callback(data);
        });
      }
  this.checkEmailAvailability = function (obj, callback) {
    //- check email availability in 100 records
    this.getPaginationData(1, 100, undefined, function (data) {
      var users = data.results;
      var temp = false;
      _.forEach(users, function (user) {
        if (user.email == obj.email && obj._id != user._id)
          temp = true;
      });
      callback(temp);
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
  this.addOrEditUser = function (operation, userData, callback) {
    if (operation == 'update') {
      NavigationService.apiCall('User/save', userData, function (data) {
        callback(data);
      });
    } else {
      NavigationService.apiCall('User/createUser', userData, function (data) {
        callback(data);
      });
    }
  }
  //- get pagination data
  this.getPaginationData = function (pageNumber, count, searchKeyword, callback) {
    NavigationService.apiCall('User/search', {
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
  this.selectAll = function (users, checkboxStatus, callback) {
    bulkArray = [];
    if (checkboxStatus == true) {
      angular.forEach(users,  function (obj) {
        var userId = obj._id;
        bulkArray.push(userId);
      });
    }
    callback(bulkArray);
  }
  //- delete bulk users
  this.deleteBulkUsers = function (users, callback, type) {
    var tempObj = {};
    if (type == 'singleUser') {
      tempObj.idsArray = [];
      tempObj.idsArray.push(users);
    } else {
      tempObj.idsArray = users;
    }
    NavigationService.apiCall('Web/delRestrictions/User', tempObj, function (data) {
      bulkArray = [];      
      callback(data);
    });
  }

});