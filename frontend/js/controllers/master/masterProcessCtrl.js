myApp.controller('masterProcessCtrl', function ($scope, toastr, $uibModal, masterProcessService, TemplateService) {


    // *************************** default variables/tasks begin here ***************** //
    $scope.$parent.isSidebarActive = false; //- to show/hide sidebar of dashboard 
    $scope.showSaveBtn = true; //- to show/hide save & update button on pop-up according to operation
    $scope.showEditBtn = false;
    $scope.selectedProcessCat = {};
    $scope.bulkProcesses = [];
    // object for Validation of select in process Type
    $scope.validationSelect = {
        processCategory: "",
        quantityUom: "",
        rateUom: "",
        linkedkeyValue: "",
        finalUom: "",
        rateMultiplicationFactor: "",
        processCatValidation: "",
        quantityMultiplicationFactor: "",
        quantityUtilization: "",
        quantityWastage: "",
        errorCount: ""
    }
    //- for title
    TemplateService.getTitle("ProcessMaster");

    // *************************** default functions begin here  ********************** //
    $scope.getProcessData = function () {
        masterProcessService.getProcessData(function (data) {
            $scope.processStructureData = data;
        });
    }
    $scope.getProcessTypeData = function () {
        masterProcessService.getProcessTypeData(function (data) {
            $scope.processData = data.results;
            masterProcessService.getPaginationDetails(1, 10, data, function (obj) {
                $scope.obj = obj;
            });
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
        //Validation of select in process Catergory.
        var errorCount = 0;
        $scope.selecteduom = "";
        if (typeof (selectedUomId) == "undefined") {
            $scope.selecteduom = "select UOM.";
            errorCount++;
        } else {
            $scope.selectedUom = "";
        }
        if (errorCount == 0) {
            masterProcessService.addOrEditProcessCat(processCatData, function (data) {
                if (angular.isUndefined(data.error)) {
                    toastr.success('Record added successfully');
                    $scope.getProcessData();
                    $scope.cancelModal();
                } else {
                    toastr.error('Please enter data properly');
                }
            });
        }
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
            if (_.isEmpty(data.data)) {
                toastr.success('Record deleted successfully');
            } else {
                toastr.error('Record cannot deleted.Dependency on ' + data.data[0].model + ' database');
            }
            $scope.cancelModal();
            $scope.getProcessData();
        });
    }


    $scope.addOrEditProcessItemModal = function (operation, processCat, processItem) {
        masterProcessService.getProcessItemModalData(operation, processCat._id, processItem, function (data) {
            $scope.formData = data.processItem;
            $scope.processCat = data.processCat;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;
            $scope.processCatUom = processCat.uom.uomName;

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
            toastr.success('Record added successfully');
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
            if (_.isEmpty(data.data)) {
                toastr.success('Record deleted successfully');
            } else {
                toastr.error('Record cannot deleted.Dependency on ' + data.data[0].model + ' database');
            }
            $scope.cancelModal();
            $scope.getProcessData();
        });
    }


    $scope.addOrEditProcessTypeModal = function (operation, process) {
        masterProcessService.getProcessTypeModalData(operation, process, function (data) {

            $scope.selectedProcessCat = {};
            $scope.processCats = data.processCats;
            $scope.uoms = data.uoms;
            //- edit case
            if (angular.isDefined(data.process)) {
                $scope.formData = data.process;
                $scope.selectedProcessCat = data.process.processCat;
                $scope.selectedRateMUlFactUom = data.process.rate.uom;
                $scope.selectedQuaLinkedKeyUom = data.process.quantity.uom;
                $scope.selectedQuaFinalUom = data.process.quantity.finalUom;

                //- 2nd toggle button at MProcess  is on
                if ($scope.formData.showQuantityFields) {
                    $scope.formData.showFields = true;
                } else {
                    $scope.formData.showFields = false;
                }
                //- 1st toggle button at MProcess  is on
                if ($scope.formData.showRateFields) {
                    $scope.formData.showMulFact = true;
                } else {
                    $scope.formData.showMulFact = false;
                }
            } else { //- save case
                $scope.formData = {
                    showQuantityFields: true,
                    showRateFields: true,
                    showFields: true,
                    showMulFact: true,
                    rate: {},
                    quantity: {}
                }
                $scope.selectedProcessCat = "";
                $scope.selectedRateMUlFactUom = "";
                $scope.selectedQuaLinkedKeyUom = "";
                $scope.selectedQuaFinalUom = "";
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

        masterProcessService.validationOfProcessType(processData, selectedProcessCatId, selectedRateMUlFactUom, selectedQuaLinkedKeyUom, selectedQuaFinalUom, function (data) {
            $scope.validationSelect = data;
            if ($scope.validationSelect.errorCount == 0) {
                masterProcessService.addOrEditProcessType(processData, function (data) {
                    if (angular.isUndefined(data.error)) {
                        toastr.success('Record added successfully');
                        $scope.getProcessTypeData();
                        $scope.cancelModal();
                    } else {
                        toastr.error('Please enter data properly');
                    }
                });
            }
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
            if (_.isEmpty(data.data)) {
                toastr.success('Record deleted successfully');
            } else {
                toastr.error('Record cannot deleted.Dependency on ' + data.data[0].model + ' database');
            }
            $scope.cancelModal();
            $scope.getProcessTypeData();
        });
    }


    //- to dismiss modal instance
    $scope.cancelModal = function () {
        $scope.modalInstance.dismiss();
    };

    //- function for pagination of processes' records
    $scope.getPaginationData = function (page, numberOfRecords, keyword) {
        // if (angular.isUndefined(keyword) || keyword == '') {
        //     if (numberOfRecords != '10') {
        //         masterProcessService.getPaginationData(page, numberOfRecords, null, function (data) {
        //             $scope.processData = data.results;
        //             masterProcessService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
        //                 $scope.obj = obj;
        //             });
        //         });
        //     } else {
        //         masterProcessService.getPaginationData(page, null, null, function (data) {
        //             $scope.processData = data.results;
        //             masterProcessService.getPaginationDetails(page, 10, data, function (obj) {
        //                 $scope.obj = obj;
        //             });
        //         });
        //     }
        // } else {
        masterProcessService.getPaginationData(page, numberOfRecords, keyword, function (data) {
            $scope.processData = data.results;
            masterProcessService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
                $scope.obj = obj;
            });
        });
        // }
    }
    // //- function to search the text in table
    // $scope.serachText = function (keyword, count) {
    //     masterProcessService.getSearchResult(null, null, keyword, function (data) {
    //         $scope.processData = data.results;
    //         masterProcessService.getPaginationDetails(1, count, data, function (obj) {
    //             $scope.obj = obj;
    //         });
    //     });
    // }
    //- to dismiss modal instance
    $scope.cancelModal = function () {
        $scope.modalInstance.dismiss();
    }

    //- modal to confirm bulk processes deletion
    $scope.deleteBulkProcessesModal = function (processIdArray, getFunction) {
        $scope.idsToDelete = processIdArray;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/deleteBulkModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    //- function to delete process
    $scope.deleteBulkProcesses = function (processes) {
        masterProcessService.deleteBulkProcesses(processes, function (data) {
            if (_.isEmpty(data.data)) {
                toastr.success('Record deleted successfully');
            } else {
                toastr.error('Record cannot deleted.Dependency on ' + data.data[0].model + ' database');
            }
            $scope.cancelModal();
            $scope.getProcessTypeData();
            $scope.bulkProcesses = [];
        });
    }
    //- function to get bulk processes
    $scope.selectBulkProcesses = function (checkboxStatus, processId) {
        masterProcessService.selectBulkProcesses(checkboxStatus, processId, function (data) {
            $scope.bulkProcesses = data;
        });
    }
    //- to select all records
    $scope.selectAll = function (processes, checkboxStatus) {
        masterProcessService.selectAll(processes, checkboxStatus, function (data) {
            $scope.bulkProcesses = data;
        });
    }
    //- to select Nos or Hrs
    //- 2nd toggle button
    $scope.setToggleForQuantity = function (formData) {
        formData.showQuantityFields = !formData.showQuantityFields;
        formData.showFields = formData.showQuantityFields;
    }
    //- to select Nos or Hrs
    //- 1st toggle button
    $scope.setToggleForRate = function (formData) {
        formData.showRateFields = !formData.showRateFields;
        formData.showMulFact = formData.showRateFields;
    }

    // *************************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function () {
        $scope.getProcessTypeData();
        $scope.getProcessData();
    }
    $scope.init();

});