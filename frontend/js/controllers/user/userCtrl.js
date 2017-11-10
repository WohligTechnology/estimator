myApp.controller('userCtrl', function ($scope, $http, $timeout, $uibModal, userService) {



  // *************************** default variables/tasks begin here ***************** //
  //- to show/hide sidebar of dashboard 
  $scope.$parent.isSidebarActive = true;
  $scope.showSaveBtn = true;
  $scope.showEditBtn = false;
  $scope.bulkUsers = [];
  $scope.operationStatus = '';


  // *************************** default functions begin here  ********************** //
  //- function to get all users from database
  $scope.getUserData = function () {
    userService.getUserData(function (data) {
      $scope.userData = data.results;
      userService.getPaginationDetails(1, 10, data, function (obj) {
        $scope.obj = obj;
      });
    });
  }


  // *************************** functions to be triggered form view begin here ***** //
  //- modal to create new user 
  $scope.addOrEditUserModal = function (operation, user) {
    userService.getUserModalData(operation, user, function (data) {
      $scope.formData = data.user;
      $scope.showSaveBtn = data.saveBtn;
      $scope.showEditBtn = data.editBtn;
      $scope.operation = operation;

      $scope.modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/content/user/modal/createOrEditUser.html',
        scope: $scope,
        size: 'md'
      });

    });
  }
  //- function to  create new user
  $scope.addOrEditUser = function (operation, userData) {
    userService.addOrEditUser(userData, function () {
      $scope.getUserData();
      $scope.cancelModal();
      if(operation == 'save'){
        $scope.operationStatus = "Record added successfully";
      } else {
        $scope.operationStatus = "Record updated successfully";
      }
      $timeout(function () {
        $scope.operationStatus = "";
      }, 3000);

    });
  }

  //- modal to confirm user deletion
  $scope.deleteUserModal = function (userId, getFunction) {
    $scope.idToDelete = userId;
    $scope.functionToCall = getFunction;

    $scope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
      scope: $scope,
      size: 'md'
    });
  }
  //- function to delete user
  $scope.deleteUser = function (userId) {
    userService.deleteUser(userId, function (data) {
      $scope.cancelModal();
      $scope.getUserData();
      $scope.operationStatus = "***   Record deleted successfully   ***";
      $timeout(function () {
        $scope.operationStatus = "";        
      }, 3000);
    });
  }
  //- function for pagination of users' records
  $scope.getPaginationData = function (page, numberOfRecords, keyword) {
    if (angular.isUndefined(keyword) || keyword == '') {
      if (numberOfRecords != '10') {
        userService.getPageDataWithShowRecords(page, numberOfRecords, function (data) {
          $scope.userData = data.results;
          userService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
            $scope.obj = obj;
          });
        });
      } else {
        userService.getPaginationDatawithoutKeyword(page, function (data) {
          $scope.userData = data.results;
          userService.getPaginationDetails(page, 10, data, function (obj) {
            $scope.obj = obj;
          });
        });
      }
    } else {
      userService.getPaginationDataWithKeyword(page, numberOfRecords, keyword, function (data) {
        $scope.userData = data.results;
        userService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
          $scope.obj = obj;
        });
      });
    }
  }
  //- function to search the text in table
  $scope.serachText = function (keyword, count) {
    userService.getSearchResult(keyword, function (data) {
      $scope.userData = data.results;
      userService.getPaginationDetails(1, count, data, function (obj) {
        $scope.obj = obj;
      });
    });
  }
  //- to dismiss modal instance
  $scope.cancelModal = function () {
    $scope.modalInstance.dismiss();
  }

  //- modal to confirm bulk users deletion
  $scope.deleteBulkUsersModal = function (userIdArray, getFunction) {
    $scope.idsToDelete = userIdArray;
    $scope.functionToCall = getFunction;

    $scope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/content/deleteBulkModal.html',
      scope: $scope,
      size: 'md'
    });
  }
  //- function to delete user
  $scope.deleteBulkUsers = function (users) {
    userService.deleteBulkUsers(users, function () {
      $scope.getUserData();      
      $scope.cancelModal();
      $scope.bulkUsers = [];
      $scope.operationStatus = "***   Records deleted successfully   ***";      
    
      $timeout(function () {
        $scope.operationStatus = "";        
      }, 3000);
    });
  }
  //- function to get bulk users
  $scope.selectBulkUsers = function (checkboxStatus, userId) {
    userService.selectBulkUsers(checkboxStatus, userId, function (data) {
      if (data.length >= 1) {
        $scope.recordSelected = true;
      } else {
        $scope.recordSelected = false;
      }
      $scope.bulkUsers = data;
    });
  }
  //- to select all records
  $scope.selectAll = function (users, checkboxStatus) {
    userService.selectAll(users, checkboxStatus, function (data) {
      $scope.bulkUsers = data;
    });
  }

  // *************************** init all default functions begin here ************** //
  //- to initilize the default function 
  $scope.init = function () {
    $scope.getUserData();
  }
  $scope.init();

});