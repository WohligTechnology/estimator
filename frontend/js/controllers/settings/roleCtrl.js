myApp.controller('roleCtrl', function ($scope, toastr, $uibModal, roleService) {
    
    
    
      // *************************** default variables/tasks begin here ***************** //
      //- to show/hide sidebar of dashboard 
      $scope.$parent.isSidebarActive = true;
      $scope.showSaveBtn = true;
      $scope.showEditBtn = false;
    
      // *************************** default functions begin here  ********************** //
      //- function to get all users from database
    
    
    
      // *************************** functions to be triggered form view begin here ***** //
    //- to add or edit Role 
  $scope.addOrEditRoleModal = function (operation, role) {
   // roleService.getRoleModalData(operation, role, function (data) {
      // $scope.formData = data.role;
      // $scope.showSaveBtn = data.saveBtn;
      // $scope.showEditBtn = data.editBtn;
      // $scope.operation = operation;
    debugger;
      $scope.modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/content/settings/modal/createOrEditRole.html',
        scope: $scope,
        size: 'md'
      //});

    });
  }
  //
      // *************************** init all default functions begin here ************** //
      //- to initilize the default function 
      $scope.init = function () {
      }
      $scope.init();
    
    });