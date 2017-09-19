myApp.controller('userCtrl', function ($rootScope, $scope, $http, $timeout, $uibModal) {
  $scope.$parent.isSidebarActive = true;

  $scope.$on('$viewContentLoaded', function () {
    // initialize core components
    App.initAjax();
  });
  //modal Create or Edit user
   $scope.createOrEdit = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/user/modal/createOrEditUser.html',
            scope: $scope,
            size: 'md',
        });
    };
     //modal view user
   $scope.viewUser = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/user/modal/viewUser.html',
            scope: $scope,
            size: 'md',
        });
    };
  // Delete modal start
  $scope.deleteItem = function () {
    $scope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/modal/delete.html',
      scope: $scope,
      size: 'sm',
    });
  };
  //table data
  $scope.tableData = [{
      "id": "1",
      "name": "kishori",
      "cname": "1",
      "dname": "kishori",
      "cid": "1",
      "pname": "kishori",
      "did": "1",
      "bname": "kishori",

    },
    {
      "id": "1",
      "name": "kishori",
      "cname": "1",
      "dname": "kishori",
      "cid": "1",

    },
    {
      "id": "1",
      "name": "kishori",
      "cname": "1",
      "dname": "kishori",
      "cid": "1",
    }
  ]

  
  //start of pagination 
  $scope.totalItems = 64;
  $scope.currentPage = 4;

  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function () {
    $log.log('Page changed to: ' + $scope.currentPage);
  };

  $scope.maxSize = 5;
  $scope.bigTotalItems = 175;
  $scope.bigCurrentPage = 1;

  //end of pagination
  //start of checkbox
  $("#checkAll").click(function () {
    $('input:checkbox').not(this).prop('checked', this.checked);
  });
  // set sidebar closed and body solid layout mode
  $rootScope.settings.layout.pageContentWhite = true;
  $rootScope.settings.layout.pageBodySolid = false;
  $rootScope.settings.layout.pageSidebarClosed = false;

});