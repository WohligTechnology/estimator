myApp.controller('customerCtrl', function ($scope, $http, $uibModal) {
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
    "bname": "kishori"
  }, {
    "id": "1",
    "name": "kishori",
    "cname": "1",
    "dname": "kishori",
    "cid": "1",

  }, {
    "id": "1",
    "name": "kishori",
    "cname": "1",
    "dname": "kishori",
    "cid": "1",
  }];

  $scope.tempvar = [{
    "id": "1",
    "name": "kishori",
    "cname": "1",
    "dname": "kishori",
    "cid": "1",
    "pname": "kishori",
    "did": "1",
    "bname": "kishori"
  }, {
    "id": "1",
    "name": "kishori",
    "cname": "1",
    "dname": "kishori",
    "cid": "1",

  }, {
    "id": "1",
    "name": "kishori",
    "cname": "1",
    "dname": "kishori",
    "cid": "1",
  }];
  //customer modal start
  $scope.customer = function () {
    $scope.customerModal = $uibModal.open({
      animation: true,
      templateUrl: 'views/content/customer/modal/createOrEditCustomer.html',
      scope: $scope,
      size: 'md',
    });
  };
  //end of modal
  //view modal start
  $scope.view = function () {
    $scope.customerModal = $uibModal.open({
      animation: true,
      templateUrl: 'views/content/customer/modal/viewCustomer.html',
      scope: $scope,
      size: 'md',
    });
  };
  //end of modal
  // Delete modal start
  $scope.deleteItem = function () {
    $scope.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/modal/delete.html',
      scope: $scope,
      size: 'sm',
    });
  };
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
  // $("#checkAll").click(function () {
  //   $('input:checkbox').not(this).prop('checked', this.checked);
  // });


});