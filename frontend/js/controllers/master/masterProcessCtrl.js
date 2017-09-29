myApp.controller('masterProcessCtrl', function ($scope, $http, $uibModal, masterProcessService) {
    
    $scope.$parent.isSidebarActive = false;
    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 

    //- to show/hide save & update button on pop-up according to operation
    $scope.showSaveBtn = true;
    $scope.showEditBtn = false;

    // *************************** default functions begin here  ********************** //

    $scope.getProcessData = function () {
        masterProcessService.getProcessData(function (data) {
        $scope.processData = data;
        });
    }

  $scope.getProcessCatData = function () {
        masterProcessService.getProcessCatData(function (data) {
            $scope.processStructureData = data;
        });
    }

    // *************************** functions to be triggered form view begin here ***** //


    $scope.addOrEditProcessModal = function (operation, process) {
           masterProcessService.getProcessModalData(operation, process, function (data) {
             $scope.formData = data.process;
             $scope.showSaveBtn = data.saveBtn;
             $scope.showEditBtn = data.editBtn;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/master/process/createOrEditProcessType.html',
                scope: $scope,
                size: 'md'
            });

        });
    }

 $scope.addOrEditProcess = function (processData) {
     masterProcessService.addOrEditProcess(processData, function (data) {

        $scope.operationStatus = "Record added successfully";
        $scope.getProcessData();
        $scope.cancelModal();
      });
    }
   
//- modal to confirm processTYpe deletion
    $scope.deleteProcessModal = function (processId, getFunction) {
      $scope.idToDelete = processId;
      $scope.functionToCall = getFunction;

      $scope.modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
        scope: $scope,
        size: 'md'
      });
    }
    $scope.deleteProcess = function (processId) {
    masterProcessService.deleteProcess(processId, function (data) {
        $scope.operationStatus = "Record deleted successfully";
        $scope.cancelModal();
        $scope.getProcessData();
      });
    }
//modal to confirm process cat creationOredit

 $scope.addOrEditProcessCatModal = function (operation, processCat) {
        console.log('**** inside addOrEditMaterialCatModal of createOrEditMaterialCtrl.js ****', operation);
        masterProcessService.getProcessCatModalData(operation, processCat, function (data) {
            $scope.formData = data.processCat;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/master/process/createOrEditProcessCat.html',
                scope: $scope,
                size: 'md'
            });
        });
    }

  $scope.addOrEditProcessCat = function (processCatData) {
        console.log('**** inside addOrEditMaterialCat of createOrEditMaterialCtrl.js ****');
        masterProcessService.addOrEditProcessCat(processCatData, function (data) {
            $scope.operationStatus = "Record added successfully";
            $scope.getProcessData();
            $scope.cancelModal();
        });
    }








    //- to dismiss modal instance
    $scope.cancelModal = function () {
        $scope.modalInstance.dismiss();
    };


   

    // $scope.processingCat = function () {
    //     $scope.modalInstance = $uibModal.open({
    //         animation: true,
    //         templateUrl: 'views/content/master/process/createOrEditProcessCat.html',
    //         scope: $scope,
    //         size: 'md',

    //     });
    // };
    //start of processing item modal

    $scope.processingItem = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/process/createOrEditProcessItem.html',
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

    // *************************** init all default functions begin here ************** //
    //- to initilize the default function 

    $scope.init = function () {
        $scope.getProcessData();
    }
    $scope.init();

});