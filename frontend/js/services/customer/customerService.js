myApp.controller('customerCtrl', function ($rootScope, $scope, $http, $timeout, $uibModal) {
  $scope.$parent.isSidebarActive = true;
  $scope.$on('$viewContentLoaded', function () {
    // initialize core components
    App.initAjax();
  });

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

  //modal start
  $scope.edit = function () {
    $scope.editModal = $uibModal.open({
      animation: true,
      templateUrl: 'views/modal/edit.html',
      scope: $scope,
      size: 'md',


    });
  };
  //end of modal
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


});