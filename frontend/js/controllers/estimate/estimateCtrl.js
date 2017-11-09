myApp.controller('estimateCtrl', function ($rootScope, $scope, $http, $timeout, $uibModal) {
  $scope.$parent.isSidebarActive = true;
  $scope.bulkEstimates = [];
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

//Edit Estimate modal start
    $scope.allEstimateEdit = function () {
        $scope.modalInstance  = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/allEstimateEdit.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal

});