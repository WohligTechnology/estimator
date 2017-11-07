myApp.service('userService', function ($http, $uibModal, NavigationService) {

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
      var user = data.data.results[0];
      user.dob = new Date(user.dob);
      callback(user);
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
  this.getPaginationData = function (pageNumber, callback) {
    NavigationService.apiCall('User/search', {
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
  this.getPaginationDetails = function (pageNumber, data, callback) {
    var obj = {};
    obj.pageStart = (pageNumber - 1) * 10 + 1;
    obj.total = data.total;
    if (obj.total <= pageNumber * 10) {
      obj.pageEnd = obj.total;
    } else {
      obj.pageEnd = pageNumber * 10;
    }
    obj.numberOfPages = Math.ceil((obj.total) / 10);
    obj.pagesArray = [];
    for (var i = 0; i < obj.numberOfPages; i++) {
      obj.pagesArray[i] = i + 1;
    }

    callback(obj);
  }
  //
  this.getPaginationDataWithKeyword = function (pageNumber, searchKeyword, callback) {
    NavigationService.apiCall('User/search', { keyword: searchKeyword, page: pageNumber }, function (data) {
      callback(data.data);
    });
  }

});