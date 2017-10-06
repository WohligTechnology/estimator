myApp.controller('masterAddonCtrl', function ( $scope, $http, $uibModal, masterAddonService) {
  
 // *************************** default variables/tasks begin here ***************** //
  //- to show/hide sidebar of dashboard 

   $scope.$parent.isSidebarActive = true;
   $scope.showSaveBtn = true;
   $scope.showEditBtn = false;
 
  // *************************** default functions begin here  ********************** //
  
  $scope.getAddonData = function(){
        masterAddonService.getAddonData(function (data) {
        $scope.addonData = data;
    });
  }

  // *************************** init all default functions begin here ************** //
  //- to initilize the default function 
  $scope.init = function () {
    // to get addon Data
    $scope.getAddonData();
  }

  $scope.init();



     //modal start
    $scope.addon = function () {
        $scope.modalInstance  = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/addon/createOrEditAddonType.html',
            scope: $scope,
            size: 'lg',
        });
    };
    //end of modal
        // Delete modal start
    $scope.deleteItem = function () {
        $scope.modalInstance  = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/delete.html',
            scope: $scope,
            size: 'sm',
        });
    };
    //end of modal
});