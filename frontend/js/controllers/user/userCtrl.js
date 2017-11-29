myApp.controller('userCtrl', function ($scope, toastr, $uibModal, userService) {



  // *************************** default variables/tasks begin here ***************** //
  //- to show/hide sidebar of dashboard 
  $scope.$parent.isSidebarActive = true;
  $scope.showSaveBtn = true;
  $scope.showEditBtn = false;
  $scope.bulkUsers = []; //- for multiple records deletion
  $scope.checkAll = false; //- for all records selection
  $scope.checkboxStatus = false; //- for multiple records selection
  //- for cleave validation
  $scope.options = {
    phone: {
      phone: true
    }
  };


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
  //- to add or edit user 
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
  //- to add or edit user
  $scope.addOrEditUser = function (operation, userData) {
    userService.addOrEditUser(userData, function () {
      $scope.getUserData();
      $scope.cancelModal();
      if (operation == 'save') {
        toastr.info('Record added successfully');
      } else {
        toastr.info('Record updated successfully');
      }
    });
  }
  //- user deletion modal
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
  //- to delete user
  $scope.deleteUser = function (userId) {
    userService.deleteUser(userId, function (data) {
      $scope.cancelModal();
      $scope.getUserData();
      toastr.info('Record deleted successfully');
    });
  }
  //- for pagination of users' records
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
  //- to search the text in table
  $scope.serachText = function (keyword, count) {
    userService.getSearchResult(keyword, function (data) {
      $scope.userData = data.results;
      userService.getPaginationDetails(1, count, data, function (obj) {
        $scope.obj = obj;
      });
    });
  }
  //- bulk users deletion modal
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
  //-to delete bulk users
  $scope.deleteBulkUsers = function (users) {
    userService.deleteBulkUsers(users, function () {

      $scope.cancelModal();
      $scope.bulkUsers = [];
      $scope.checkAll = false;
      $scope.checkboxStatus = false;
      $scope.getUserData();
      toastr.info('Record deleted successfully', 'User Deletion!');
    });
  }
  //- to get bulk users
  $scope.selectBulkUsers = function (checkboxStatus, userId) {
    userService.selectBulkUsers(checkboxStatus, userId, function (data) {
      $scope.bulkUsers = data;
    });
  }
  //- to select all records
  $scope.selectAll = function (users, checkboxStatus) {
    userService.selectAll(users, checkboxStatus, function (data) {
      $scope.bulkUsers = data;
    });
  }
  //- to dismiss modal instance
  $scope.cancelModal = function () {
    $scope.modalInstance.dismiss();
  }


  // *************************** init all default functions begin here ************** //
  //- to initilize the default function 
  $scope.init = function () {
    $scope.getUserData();
  }
  $scope.init();

});