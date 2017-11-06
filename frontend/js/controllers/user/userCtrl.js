myApp.controller('userCtrl', function ($scope, $http, $uibModal, userService) {



  // *************************** default variables/tasks begin here ***************** //
  //- to show/hide sidebar of dashboard 
  $scope.$parent.isSidebarActive = true;
  $scope.showSaveBtn = true;
  $scope.showEditBtn = false;


  // *************************** default functions begin here  ********************** //
  //- function to get all users from database
  $scope.getUserData = function () {
    userService.getUserData(function (data) {
      $scope.userData = data.results;
      $scope.numberOfPages = Math.ceil((data.total) / 10);
      var i;
      $scope.pagesArray = [];
      for (i = 0; i < $scope.numberOfPages; i++) {
        $scope.pagesArray[i] = i + 1;
      }
    });
  }


  // *************************** functions to be triggered form view begin here ***** //
  //- modal to create new user 
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
  //- function to  create new user
  $scope.addOrEditUser = function (userData) {
    userService.addOrEditUser(userData, function (data) {
      $scope.operationStatus = "Record added successfully";
      debugger;
      $scope.getUserData();
      $scope.cancelModal();
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
      $scope.operationStatus = "Record deleted successfully";
      $scope.cancelModal();
      $scope.getUserData();
    });
  }
  // -  function for pagination of users' records
  $scope.getPaginationData = function (page) {
    debugger;
    userService.getPaginationData(function (page, data) {
      $scope.userData = data.results;
    });
  }

  //- to dismiss modal instance
  $scope.cancelModal = function () {
    $scope.modalInstance.dismiss();
  };


  // *************************** init all default functions begin here ************** //
  //- to initilize the default function 
  $scope.init = function () {
    $scope.getUserData();
  }
  $scope.init();
});