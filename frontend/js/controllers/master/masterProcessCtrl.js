myApp.controller('masterProcessCtrl', function ($rootScope, $scope, $http, $timeout, $uibModal) {

   // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = false;
     //- to show/hide save & update button on pop-up according to operation
     $scope.showSaveBtn = true;
     $scope.showEditBtn = false;
    
    // *************************** default functions begin here  ********************** //

    $scope.getProcessData = function(){
          masterProcessService.getProcessData(function (data) {
            $scope.processData = data;
        });
    }




    //modal start
    $scope.createOrEditProcessType = function () {
        $scope.modalInstance  = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/process/createOrEditProcessType.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
          //start of processing cat modal

    $scope.processingCat = function () {
        $scope.modalInstance  = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/process/createOrEditProcessCat.html',
            scope: $scope,
            size: 'md',

        });
    };
      //start of processing item modal

    $scope.processingItem = function () {
        $scope.modalInstance  = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/process/createOrEditProcessItem.html',
            scope: $scope,
            size: 'md',

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