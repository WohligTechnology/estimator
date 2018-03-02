myApp.controller('addOrEditRoleCtrl', function ($scope, toastr, $stateParams, roleService, TemplateService, $http) {



  // *************************** default variables/tasks begin here ***************** //
  //- to show/hide sidebar of dashboard 
  $scope.$parent.isSidebarActive = true;
  $scope.showSaveBtn = true;
  $scope.showEditBtn = false;
    //-  to hide perission columns temporary
  $scope.showPermission = false;
  //- for title
  TemplateService.getTitle("Role");
  //-  check wherther it is edit or
  if ($stateParams.id) {
    //- Get roles.json file
    roleService.findOneRole($stateParams.id, function (data) {
      if (_.isEmpty(data)) {
        toastr.success('Sorry, Something went wrong. Try Again.!!!');
        $state.go('app.roles');
      } else {
        $scope.roles = data;
        $scope.showSaveBtn = false;
        $scope.showEditBtn = true;
      }
    });
  } else {
    $scope.roles = {};
    $scope.getRolesView();
  }

  //- ********************************* default functions begin here  ******************************** //
  //- define all default functions in this section only


  //- default data retrieve from pagination directive

  //- ********************************* functions to be triggered form view begin here *************** // 
  //- define all functions triggered from view in this section only

  // Get Roles view from json file
  $scope.getRolesView = function () {
    $http.get('jsons/estimator.json')
      .then(function (res) {
        debugger;
        console.log("res : ", res.data);
        $scope.roles.roles = res.data;
      });
  }




  //-add role
  $scope.addRole = function (object) {
    if (_.isEmpty(object)) {
      toastr.error('Please fill Field');
    } else {
      roleService.addRole(object, function (data) {
        $scope.$broadcast('paginationEvent', data);
        toastr.success('Created Sucessfully');
        $state.go('app.roles');
      });
    }
  }

  //-update One role
  $scope.updateRole = function (object) {
    roleService.updateRole(object, function (data) {
      $scope.$broadcast('paginationEvent', data);
      toastr.success('Updated Sucessfully');
      $state.go('app.roles');
    });
  }


  //- Select row of checkbox
  $scope.selectRow = function (field, status) {
    roleService.selectRow($scope.roles.roles, field, status, function (data) {
      $scope.roles.roles = data;
    });
  }

  //- Select sub row of checkbox
  $scope.selectSubRow = function (field, subField, status) {
    roleService.selectSubRow($scope.roles.roles, field, subField, status, function (data) {
      $scope.roles.roles = data;
    });
  }


  //- Select all checkbox
  $scope.selectAllCheckbox = function (status) {
    roleService.selectAllCheckbox($scope.roles.roles, status, function (data) {
      $scope.roles.roles = data;
    });
  }

  //- ********************************* init all default functions begin here ************************ //
  //- Initilize the default function in this section only
  // $scope.init = function () {

  // }
  // $scope.init();

});