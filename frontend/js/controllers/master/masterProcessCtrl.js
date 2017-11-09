myApp.controller('masterProcessCtrl', function ($scope, $http, $uibModal, masterProcessService) {


    // *************************** default variables/tasks begin here ***************** //
    $scope.$parent.isSidebarActive = false;    //- to show/hide sidebar of dashboard 
    $scope.showSaveBtn = true;                 //- to show/hide save & update button on pop-up according to operation
    $scope.showEditBtn = false;
    $scope.selectedProcessCat = {};
    $scope.bulkProcesses = [];


    // *************************** default functions begin here  ********************** //
    $scope.getProcessData = function () {
        masterProcessService.getProcessData(function (data) {
            $scope.processStructureData = data;
        });
    }
    $scope.getProcessTypeData = function () {
        masterProcessService.getProcessTypeData(function (data) {
            $scope.processData = data;
        });
    }


    // *************************** functions to be triggered form view begin here ***** //
    $scope.addOrEditProcessCatModal = function (operation, processCat) {
        masterProcessService.getProcessCatModalData(operation, processCat, function (data) {
            $scope.selectedUom = {};
            $scope.uoms = data.uoms;
            $scope.formData = data.processCat;

            if (angular.isDefined(data.processCat)) {
                $scope.selectedUom = data.processCat.uom;
            }

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
    $scope.addOrEditProcessCat = function (processCatData, selectedUomId) {
        processCatData.uom = selectedUomId;
        masterProcessService.addOrEditProcessCat(processCatData, function (data) {
            $scope.operationStatus = "Record added successfully";
            $scope.getProcessData();
            $scope.cancelModal();
        });
    }
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


    $scope.addOrEditProcessTypeModal = function (operation, process) {
        masterProcessService.getProcessTypeModalData(operation, process, function (data) {

            $scope.selectedProcessCat = {};
            $scope.formData = data.process;
            $scope.processCats = data.processCats;
            $scope.uoms = data.uoms;

            if (angular.isDefined(data.process)) {
                $scope.selectedProcessCat = data.process.processCat;
                $scope.selectedRateMUlFactUom = data.process.rate.uom;
                $scope.selectedQuaLinkedKeyUom = data.process.quantity.uom;
                $scope.selectedQuaFinalUom = data.process.quantity.finalUom;

            }
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
    $scope.addOrEditProcessType = function (processData, selectedProcessCatId, selectedRateMUlFactUom, selectedQuaLinkedKeyUom, selectedQuaFinalUom) {
        processData.processCat = selectedProcessCatId;
        processData.rate.uom = selectedRateMUlFactUom;
        processData.quantity.uom = selectedQuaLinkedKeyUom;
        processData.quantity.finalUom = selectedQuaFinalUom;
        masterProcessService.addOrEditProcessType(processData, function (data) {
            $scope.operationStatus = "Record added successfully";
            $scope.getProcessTypeData();
            $scope.cancelModal();
        });
    }
    $scope.deleteProcessTypeModal = function (processId, getFunction) {
        $scope.idToDelete = processId;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    $scope.deleteProcessType = function (processId) {
        masterProcessService.deleteProcessType(processId, function (data) {
            $scope.operationStatus = "Record deleted successfully";
            $scope.cancelModal();
            $scope.getProcessTypeData();
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