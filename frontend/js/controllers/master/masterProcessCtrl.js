myApp.controller('masterProcessCtrl', function ($scope, $http, $uibModal, masterProcessService) {


    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = false;

    //- to show/hide save & update button on pop-up according to operation

    $scope.showSaveBtn = true;
    $scope.showEditBtn = false;

    // *************************** default functions begin here  ********************** //

    $scope.getProcessData = function () {
        masterProcessService.getProcessData(function (data) {
            $scope.processStructureData = data;
        });
    }

    $scope.getProcessTypeData = function () {
   
        masterProcessService.getProcessTypeData(function (data) {
                
            $scope.processData = data;
             console.log("lnvlk", $scope.processData );
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
            $scope.getProcessTypeData();
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
            $scope.getProcessTypeData();
        });
    }

    //modal to confirm process cat creationOredit
    $scope.addOrEditProcessCatModal = function (operation, processCat) {
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
        masterProcessService.addOrEditProcessCat(processCatData, function (data) {
            $scope.operationStatus = "Record added successfully";
            $scope.getProcessData();
            $scope.cancelModal();
        });
    }

    //- modal to confirm process cat deletion
    $scope.deleteProcessCatModal = function (processCatId, getFunction) {
        $scope.idToDelete = processCatId;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    $scope.deleteProcessCat = function (processCatId) {
        masterProcessService.deleteProcessCat(processCatId, function (data) {
            $scope.operationStatus = "Record deleted successfully";
            $scope.cancelModal();
            $scope.getProcessData();
        });
    }

    //modal to confirm process processItems creationOredit
    $scope.addOrEditProcessItemModal = function (operation, processCatId, processItem) {
        masterProcessService.getProcessItemModalData(operation, processCatId, processItem, function (data) {
            $scope.formData = data.processItem;
            $scope.processCat = data.processCat;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/master/process/createOrEditProcessItem.html',
                scope: $scope,
                size: 'md'
            });
        });
    }
    $scope.addOrEditProcessItem = function (processItemData, processCatId) {
        masterProcessService.addOrEditProcessItem(processItemData, processCatId, function (data) {
            $scope.operationStatus = "Record added successfully";
            $scope.getProcessData();
            $scope.cancelModal();
        });
    }

    //- modal to confirm item deletion
    $scope.deleteProcessItemModal = function (processItemId, getFunction) {
        $scope.idToDelete = processItemId;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    $scope.deleteProcessItem = function (processItemId) {
        masterProcessService.deleteProcessItem(processItemId, function (data) {
            $scope.operationStatus = "Record deleted successfully";
            $scope.cancelModal();
            $scope.getProcessData();
        });
    }

    //- to dismiss modal instance
    $scope.cancelModal = function () {
        $scope.modalInstance.dismiss();
    };

    // *************************** init all default functions begin here ************** //
    //- to initilize the default function 

    $scope.init = function () {
        $scope.getProcessTypeData();
        $scope.getProcessData();
    }
    $scope.init();

});