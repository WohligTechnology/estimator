myApp.controller('roleCtrl', function ($scope, toastr, $uibModal, roleService) {



  // *************************** default variables/tasks begin here ***************** //
  //- to show/hide sidebar of dashboard 
  $scope.$parent.isSidebarActive = true;
  $scope.showSaveBtn = true;
  $scope.showEditBtn = false;

  // *************************** default functions begin here  ********************** //
  //- function to get all roles from database
  $scope.getRoleData = function () {
    roleService.getRoleData(function (data) {
      //$scope.roleData = data;
    });
  }


  // *************************** functions to be triggered form view begin here ***** //
  //- modal to add or edit Role 
  $scope.addOrEditRoleModal = function (operation, role) {
    //roleService.getRoleModalData(operation, role, function (data) {
    // $scope.formData = data.role;
    // $scope.showSaveBtn = data.saveBtn;
    // $scope.showEditBtn = data.editBtn;
    // $scope.operation = operation;
    $scope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/content/settings/modal/createOrEditRole.html',
      scope: $scope,
      size: 'md'
    });

    // });
  }
  //- to add or edit role 
  $scope.addOrEditRole = function (role) {
    // roleService.addOrEditRole(role, function(data) {

    // });
  }
  //- role deletion modal
  $scope.deleteRoleModal = function (roleId, getFunction) {
    $scope.idToDelete = roleId;
    $scope.functionToCall = getFunction;

    $scope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
      scope: $scope,
      size: 'md'
    });
  }
  //- to delete user
  $scope.deleteUser = function (roleId) {
    //roleService.deleteRole(roleId, function (data) {
    $scope.cancelModal();
    // $scope.getRoleData();
    toastr.info('Record deleted successfully');
    // });
  }
  //- to dismiss modal instance
  $scope.cancelModal = function () {
    $scope.modalInstance.dismiss();
  }


  //
  // *************************** init all default functions begin here ************** //
  //- to initilize the default function 
  $scope.init = function () {
    $scope.getRoleData();
  }
  $scope.init();

});