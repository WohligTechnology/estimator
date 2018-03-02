myApp.controller('userCtrl', function ($scope, toastr, $uibModal, userService, TemplateService, usersRoleService) {



  // *************************** default variables/tasks begin here ***************** //
  //- to show/hide sidebar of dashboard 
  $scope.$parent.isSidebarActive = true;
  $scope.showSaveBtn = true;
  $scope.showEditBtn = false;
  $scope.loading = false; //- show loader when api takes time to load
  $scope.bulkUsers = []; //- for multiple records deletion
  $scope.checkAll = false; //- for all records selection
  $scope.checkboxStatus = false; //- for multiple records selection
  $scope.isEmailIdPresent = false;
  //- for cleave validation
  $scope.options = {
    mobile: {
      phone: true,
      phoneRegionCode: 'IN'
    }
  };
  //- for title
  TemplateService.getTitle("User");


  // *************************** default functions begin here  ********************** //
  $scope.getAccessPermissions = function () {
    //- for authorization
    usersRoleService.getUserCrudRole('Users', '', function (response) {
      if (response) {
        $scope.role = response;
        console.log('****.......... $scope.role in Users...... ****', $scope.role);
      } else {
        // Infinite toastr. hide only when clicked to it.
        toastr[response.status]('', response.message, {
          timeOut: 0,
          extendedTimeOut: 0
        });
      }
    });
  }
  //- get all access levels
  $scope.getAccessLevels = function () {
    userService.getAccessLevels(function (data) {
      if (data.value) {
        $scope.allRoles = data.data;
      } else {
        toastr.error('There is some error');
      }
    });
  }



  //- for pagination of users' records
  $scope.getPaginationData = function (page, numberOfRecords, keyword) {
    $scope.loading = true;
    userService.getPaginationData(page, numberOfRecords, keyword, function (data) {
      $scope.loading = false;
      $scope.userData = data.results;
      userService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
        $scope.obj = obj;
      });
    });
  }

  // *************************** functions to be triggered form view begin here ***** //
  $scope.checkEmailAvailability = function (obj) {
    userService.checkEmailAvailability(obj, function (data) {
      if (data) {
        $scope.isEmailIdPresent = true;
      } else {
        $scope.isEmailIdPresent = false;
      }
    });
  }
  //- to add or edit user 
  $scope.addOrEditUserModal = function (operation, user) {
    $scope.isEmailIdPresent = false;
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
    userService.addOrEditUser(operation, userData, function (data) {
      if (data.value) {
        $scope.cancelModal();
        if (operation == 'save') {
          toastr.success('Record added successfully');
        } else {
          toastr.success('Record updated successfully');
        }
        TemplateService.getUserDetails(userData);
      } else {
        toastr.error("There is some error");
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
    userService.deleteBulkUsers(userId, function (data) {
      if (_.isEmpty(data.data)) {
        toastr.success('Record deleted successfully');
      } else {
        toastr.error('Record cannot deleted.Dependency on ' + data.data[0].model + ' database');
      }
      $scope.cancelModal();
    }, 'singleUser');
  }
  // //- bulk users deletion modal
  // $scope.deleteBulkUsersModal = function (userIdArray, getFunction) {
  //   $scope.idsToDelete = userIdArray;
  //   $scope.functionToCall = getFunction;

  //   $scope.modalInstance = $uibModal.open({
  //     animation: true,
  //     templateUrl: 'views/content/deleteBulkModal.html',
  //     scope: $scope,
  //     size: 'md'
  //   });
  // }
  //-to delete bulk users
  $scope.deleteBulkUsers = function (users) {
    userService.deleteBulkUsers(users, function (data) {
      if (_.isEmpty(data.data)) {
        toastr.success('Record deleted successfully');
      } else {
        toastr.error('Record cannot deleted.Dependency on ' + data.data[0].model + ' database');
      }
      $scope.cancelModal();
      $scope.bulkUsers = [];
      $scope.checkAll = false;
      $scope.checkboxStatus = false;
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
    $scope.getPaginationData(1, 10);
  }


  // *************************** init all default functions begin here ************** //
  //- to initilize the default function 
  $scope.init = function () {
    $scope.getAccessPermissions();
    if (angular.isDefined($scope.role)) {
      if ($scope.role.read) {
        $scope.getPaginationData(1, 10);
      }
    }
  }
  $scope.init();

});