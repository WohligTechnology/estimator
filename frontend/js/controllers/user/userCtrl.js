myApp.controller('userCtrl', function ($scope, $http, $uibModal, userService) {
  $scope.$parent.isSidebarActive = true;


  // *************************** default variables/tasks begin here ***************** //
  //- to show/hide sidebar of dashboard 
  $scope.$parent.isSidebarActive = true;
  $scope.showSaveBtn = true;
  $scope.showEditBtn = false;


  // *************************** default functions begin here  ********************** //
  $scope.getUserData = function () {
    userService.getUserData(function (data) {
      $scope.userData = data;
    });
  }


  // *************************** functions to be triggered form view begin here ***** //

  $scope.addOrEditUserModal = function (operation, user) {
    userService.getUserModalData(operation, user, function (data) {
      $scope.formData = data.user;
      $scope.showSaveBtn = data.saveBtn;
      $scope.showEditBtn = data.editBtn;

      $scope.modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/content/user/modal/createOrEditUser.html',
        scope: $scope,
        size: 'md'
      });

    });
  }
  $scope.addOrEditUser = function (userData) {
    userService.addOrEditUser(userData, function (data) {
      $scope.operationStatus = "Record added successfully";
      $scope.getUserData();
      $scope.cancelModal();  
    });
  }
  //- modal to confirm UOM deletion
  $scope.deleteUomModal = function (uomId, getFunction) {
    $scope.idToDelete = uomId;
    $scope.functionToCall = getFunction;

  }
  $scope.deleteUom = function (uomId) {
    baseMatserService.deleteUom(uomId, function (data) {

    });
  }




  //- to dismiss modal instance
  $scope.cancelModal = function () {
    $scope.modalInstance.dismiss();
  };


  // *************************** init all default functions begin here ************** //
  //- to initilize the default function 
  $scope.init = function () {
    // to get BaseMaster Data
    $scope.getUserData();
  }

  $scope.init();

});