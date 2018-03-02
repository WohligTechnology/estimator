myApp.controller('roleCtrl', function ($scope, toastr, $uibModal, roleService, TemplateService, usersRoleService) {

  // *************************** default variables/tasks begin here ***************** //
  //- to show/hide sidebar of dashboard 
  $scope.$parent.isSidebarActive = true;
  $scope.showSaveBtn = true;
  $scope.showEditBtn = false;
  $scope.moduleNames = ['Enquiry', 'Estimate', 'Customer', 'User', 'Master'];
  $scope.formData = {};
  //- for title
  TemplateService.getTitle("Role");

  //- ********************************* default variables/tasks begin here *************************** //
  //-  define all variables in this section only

  $scope.showSaveBtn = true;
  $scope.showEditBtn = false;

  //- ********************************* default functions begin here  ******************************** //
  //- define all default functions in this section only


  // *************************** default functions begin here  ********************** //
  $scope.getAccessPermissions = function () {
    //- for authorization
    usersRoleService.getUserCrudRole('Settings', 'Roles', function (response) {
        if (response) {
          $scope.role = response;
          console.log('****.......... $scope.role in Settings...... ****', $scope.role);
        } else {
          // Infinite toastr. hide only when clicked to it.
          toastr[response.status]('', response.message, {
            timeOut: 0,
            extendedTimeOut: 0
          });
        }
      
    });
  }
  //- for pagination of users' records
  $scope.getPaginationData = function (page, numberOfRecords, keyword) {
    $scope.loading = true;
    roleService.getPaginationData(page, numberOfRecords, keyword, function (data) {
      $scope.loading = false;
      $scope.roleData = data.results;
      roleService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
        $scope.obj = obj;
      });
    });
  }

  // *************************** functions to be triggered form view begin here ***** /
  //- user deletion modal
  $scope.deleteRoleModal = function (userId, getFunction) {
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
  $scope.deleteOneRole = function (userId) {
    roleService.deleteOneRole(userId, function (data) {
      if (data.value) {
        toastr.success('Record deleted successfully');
      } else {
        toastr.error('There is some error');
      }
      $scope.cancelModal();
    });
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
    roleService.deleteBulkUsers(users, function (data) {
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
    roleService.selectBulkUsers(checkboxStatus, userId, function (data) {
      $scope.bulkUsers = data;
    });
  }
  //- to select all records
  $scope.selectAll = function (users, checkboxStatus) {
    roleService.selectAll(users, checkboxStatus, function (data) {
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


  //- default data retrieve from pagination directive

  //- ********************************* functions to be triggered form view begin here *************** // 
  //- define all functions triggered from view in this section only

  // if ($stateParams.id) {
  //   //- Get roles.json file
  //   addEditRoleModuleService.findOneRole($stateParams.id, function (data) {
  //     if (_.isEmpty(data)) {
  //       toastr.success('Sorry, Something went wrong. Try Again.!!!');
  //       $state.go('app.roles');
  //     } else {
  //       $scope.roles = data;
  //       $scope.showSaveBtn = false;
  //       $scope.showEditBtn = true;
  //     }
  //   });
  // } else {
  //   $scope.roles = {};
  //   $scope.roles.project = "";
  //   // if ($.jStorage.get("loggedInUser")) {
  //   //   $scope.roles = {};
  //   //   $scope.roles.roles = $.jStorage.get("loggedInUser").accessLevel.roles;
  //   //   $scope.addRoleFlag = true;
  //   // } else {
  //   //   toastr.error("Relogin Required!");
  //   //   $state.go("login");
  //   // }
  // }

  // //Get all projects name
  // $scope.getProjects = function () {
  //   $http.get('jsons/projects.json')
  //     .then(function (projects) {
  //       $scope.projects = {};
  //       $scope.projects = projects.data;
  //     });
  // }

  // // Get Roles view from json file
  // $scope.getRolesView = function (projectName) {
  //   if (_.isEmpty(projectName)) {
  //     $scope.roles.roles = [];
  //   } else {
  //     var name = _.lowerCase(projectName);
  //     console.log("var name = _.lowerCase(projectName);", name);
  //     var jsonName = _.replace(name,/\s/g, '-'); //json name with remove string and replace by '-'

  //     console.log(" getRolesView ", jsonName);

  //     $http.get('jsons/project-roles/' + jsonName + '.json')
  //       .then(function (res) {
  //         $scope.roles.roles = res.data;
  //       });
  //   }

  // }


  // //-add role
  // $scope.addRole = function (object) {
  //   if (_.isEmpty(object)) {
  //     toastr.error('Please fill Field');
  //   } else {
  //     addEditRoleModuleService.addRole(object, function (data) {
  //       $scope.$broadcast('paginationEvent', data);
  //       toastr.success('Created Sucessfully');
  //       $state.go('app.roles');
  //     });
  //   }
  // }

  // //-update One role
  // $scope.updateRole = function (object) {
  //   var formData = {};
  //   formData._id = object._id;
  //   formData.updateData = object;
  //   addEditRoleModuleService.updateRole(formData, function (data) {
  //     $scope.$broadcast('paginationEvent', data);
  //     toastr.success('Updated Sucessfully');
  //     $state.go('app.roles');
  //   });
  // }


  // //- Select row of checkbox
  // $scope.selectRow = function (field, status) {
  //   addEditRoleModuleService.selectRow($scope.roles.roles, field, status, function (data) {
  //     $scope.roles.roles = data;
  //   });
  // }

  // //- Select sub row of checkbox
  // $scope.selectSubRow = function (field, subField, status) {
  //   addEditRoleModuleService.selectSubRow($scope.roles.roles, field, subField, status, function (data) {
  //     $scope.roles.roles = data;
  //   });
  // }


  // //- Select all checkbox
  // $scope.selectAllCheckbox = function (status) {
  //   addEditRoleModuleService.selectAllCheckbox($scope.roles.roles, status, function (data) {
  //     $scope.roles.roles = data;
  //   });
  // }

  // //- ********************************* init all default functions begin here ************************ //
  // //- Initilize the default function in this section only
  // $scope.init = function () {
  //   $scope.getProjects();
  // }
  // $scope.init();

});