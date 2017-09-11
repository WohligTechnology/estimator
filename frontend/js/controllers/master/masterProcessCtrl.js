myApp.controller('masterProcessCtrl', function ($rootScope, $scope, $http, $timeout, $uibModal) {
    $scope.$parent.isSidebarActive = false;

    //modal start
    $scope.createOrEditProcessType = function () {
        $scope.loginModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/createOrEditProcessType.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
          //start of processing cat modal

    $scope.processingCat = function () {
        $scope.loginModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/createOrEditProcessCat.html',
            scope: $scope,
            size: 'md',

        });
    };
      //start of processing item modal

    $scope.processingItem = function () {
        $scope.loginModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/createOrEditProcessItem.html',
            scope: $scope,
            size: 'md',

        });
    };
    
    //start of tree
    $scope.processCat = [{
        "name": "processCat 1",
        "processItems": [{
            "name": "process Items 1",
        }, ]
    }, {
        "name": "processCat 2",
        "processItems": [{
            "name": "process Items 1",
        }, {
            "name": "process Items 2"
        }, {
            "name": "process Items 3"
        }]
    }, {
        "name": "processCat 3",
        "materialSub": [{
            "name": "process Items 1"
        }]
    }];
});