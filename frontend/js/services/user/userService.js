myApp.service('userService', function ($http, $uibModal, NavigationService) {

  this.getUserData = function (callback) {
    NavigationService.boxCall('User/search', function (data) {
      var users = data.data.results;
      callback(users);
    });
  }

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

  this.addOrEditUser = function (userData, callback) {
    NavigationService.apiCall('User/save', userData, function (data) {
      var user = data.data.results[0];
      user.dob = new Date(user.dob);
      callback(user);
    });
  }

    this.deleteUser= function(userId,callback){
        var deleteUserObj = {
            _id:userId
        };
        NavigationService.delete('User/delete',deleteUserObj, function(data){
            callback(data);
        });
    }

});