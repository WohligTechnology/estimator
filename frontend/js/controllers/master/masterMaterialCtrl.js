myApp.controller('masterMaterialCtrl', function ($scope, $uibModal, toastr, masterMaterialService) {

    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = false;
    //- to show/hide save & update button on pop-up according to operation
    $scope.showSaveBtn = true;
    $scope.showEditBtn = false;
    $scope.disableit = true;
    $scope.editAll = false; // to make all the records instant editable
    // $scope.formData = {
    //     datasheet:[]
    // };
    // $scope.bulkMaterials = []; //- for multiple records deletion
    // $scope.checkAll = false; //- for all records selection
    // $scope.checkboxStatus = false; //- for multiple records selection


    // *************************** default functions begin here  ********************** //
    $scope.getMaterialData = function () {
        masterMaterialService.getMaterialData(function (data) {
            $scope.materialStructureData = data;
        });
    }

    // *************************** functions to be triggered form view begin here ***** //
    $scope.addOrEditMaterialCatModal = function (operation, materialCat) {
        console.log('**** inside addOrEditMaterialCatModal of createOrEditMaterialCtrl.js ****', operation);
        masterMaterialService.getMaterialCatModalData(operation, materialCat, function (data) {
            $scope.formData = data.materialCat;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/master/material/createOrEditMaterialCat.html',
                scope: $scope,
                size: 'md'
            });
        });
    }
    $scope.addOrEditMaterialCat = function (materialCatData) {
        console.log('**** inside addOrEditMaterialCat of createOrEditMaterialCtrl.js ****');
        masterMaterialService.addOrEditMaterialCat(materialCatData, function (data) {
            $scope.operationStatus = "Record added successfully";
            $scope.getMaterialData();
            $scope.cancelModal();
        });
    }
    //- modal to confirm material cat deletion
    $scope.deleteMaterialCatModal = function (materialCatId, getFunction) {
        $scope.idToDelete = materialCatId;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    $scope.deleteMaterialCat = function (materialCatId) {
        console.log('**** inside deleteMaterialCat of createOrEditMaterialCtrl.js ****');
        masterMaterialService.deleteMaterialCat(materialCatId, function (data) {
            $scope.operationStatus = "Record deleted successfully";
            $scope.cancelModal();
            $scope.getMaterialData();
        });
    }


    $scope.addOrEditMaterialSubCatModal = function (operation, materialCatId, materialSubCat) {
        console.log('**** inside addOrEditMaterialSubCatModal of createOrEditMaterialCtrl.js ****', materialSubCat);
        masterMaterialService.getMaterialSubCatModalData(operation, materialCatId, materialSubCat, function (data) {
            $scope.formData = data.materialSubCat;
            $scope.catId = data.catId;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/master/material/createOrEditMaterialSubCat.html',
                scope: $scope,
                size: 'md'
            });
        });
    }
    $scope.addOrEditMaterialSubCat = function (materialSubCatData, materialCatId) {
        // materialSubCatData.catId = materialCatId;
        console.log('**** inside addOrEditMaterialSubCat of createOrEditMaterialCtrl.js ****', materialSubCatData);
        console.log('**** inside addOrEditMaterialSubCat of createOrEditMaterialCtrl.js ****', materialCatId);
        masterMaterialService.addOrEditMaterialSubCat(materialSubCatData, materialCatId, function (data) {
            $scope.operationStatus = "Record added successfully";
            $scope.getMaterialData();
            $scope.cancelModal();
        });
    }
    //- modal to confirm material sub deletion
    $scope.deleteMaterialSubCatModal = function (materialSubCatId, getFunction) {
        console.log('**** inside deleteMaterialSubCatModal of createOrEditMaterialCtrl.js ****', getFunction);
        $scope.idToDelete = materialSubCatId;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    $scope.deleteMaterialSubCat = function (materialSubCatId) {
        console.log('**** inside deleteMaterialSubCat of createOrEditMaterialCtrl.js ****');
        masterMaterialService.deleteMaterialSubCat(materialSubCatId, function (data) {
            $scope.operationStatus = "Record deleted successfully";
            $scope.cancelModal();
            $scope.getMaterialData();
        });
    }


    $scope.addOrEditMaterialModal = function (operation, materialSubCatId, material) {
        console.log('**** inside addOrEditMaterialModal of createOrEditMaterialCtrl.js ****', materialSubCatId);
        masterMaterialService.getMaterialModalData(operation, materialSubCatId, material, function (data) {           
            console.log('**** inside function_name of masterMaterialCtrl.js ****', data);

            $scope.formData = data.material;           
            $scope.subCatId = data.materialSubCategory; // pass it to parameter of addOrEditMaterial
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/master/material/createOrEditMaterial.html',
                scope: $scope,
                size: 'md'
            });
        });
    }
    $scope.addOrEditMaterial = function (materialData, materialSubCatId) {
        console.log('**** inside addOrEditMaterial of createOrEditMaterialCtrl.js ****', materialSubCatId);
        masterMaterialService.addOrEditMaterial(materialData, materialSubCatId, function (data) {
            $scope.operationStatus = "Record added successfully";
            $scope.getMaterialData();
            $scope.cancelModal();
        });
    }
    //- instant edit particular master material
    $scope.editMaterial = function (materialId) {
        $scope.editMaterialId = materialId;
    }
    //- instant edit all master materials
    $scope.instantEditAllMaterial = function (editAll) {
        if (editAll == true) {
            $scope.editAll = false;
        } else {
            $scope.editAll = true;
        }
    }
    //- modal to confirm material deletion
    $scope.deleteMaterialModal = function (materialId, getFunction) {
        console.log('**** inside deleteMaterialModal of createOrEditMaterialCtrl.js ****', getFunction);
        $scope.idToDelete = materialId;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    $scope.deleteMaterial = function (materialId) {
        console.log('**** inside deleteMaterial of createOrEditMaterialCtrl.js ****');
        masterMaterialService.deleteMaterial(materialId, function (data) {
            $scope.operationStatus = "Record deleted successfully";
            $scope.cancelModal();
            $scope.getMaterialData();
        });
    }

    $scope.getSubCatMaterials = function (materialSubCatId) {
        masterMaterialService.getSubCatMaterials(materialSubCatId, function (data) {
            console.log('**** inside getSubCatMaterials of masterMaterialCtrl.js & data is ****', data);
            $scope.subCatMaterials = data.results;
            $scope.selectedSubACat = materialSubCatId;
            $scope.disableit = false;
            $scope.getMaterialData();
            masterMaterialService.getPaginationDetails(1, 10, data, function (obj) {
                $scope.obj = obj;
            });
        });
    }

    $scope.changeMaterialType = function (type, materialSubCatId) {
        masterMaterialService.changeMaterialType(type, materialSubCatId, function (data) {
            $scope.getSubCatMaterials(materialSubCatId);
        });
    }


    //- for pagination of materials' records
    $scope.getPaginationData = function (page, numberOfRecords, keyword) {
        if (angular.isUndefined(keyword) || keyword == '') {
            if (numberOfRecords != '10') {
                masterMaterialService.getPageDataWithShowRecords(page, numberOfRecords, function (data) {
                    $scope.subCatMaterials = data.results;
                    masterMaterialService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
                        $scope.obj = obj;
                    });
                });
            } else {
                masterMaterialService.getPaginationDatawithoutKeyword(page, function (data) {
                    $scope.subCatMaterials = data.results;
                    masterMaterialService.getPaginationDetails(page, 10, data, function (obj) {
                        $scope.obj = obj;
                    });
                });
            }
        } else {
            masterMaterialService.getPaginationDataWithKeyword(page, numberOfRecords, keyword, function (data) {
                $scope.subCatMaterials = data.results;
                masterMaterialService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
                    $scope.obj = obj;
                });
            });
        }
    }
    //- to search the text in table
    $scope.serachText = function (keyword, count) {
        masterMaterialService.getSearchResult(keyword, function (data) {
            $scope.subCatMaterials = data.results;
            masterMaterialService.getPaginationDetails(1, count, data, function (obj) {
                $scope.obj = obj;
            });
        });
    }
    //   //- bulk materials deletion modal
    //   $scope.deleteBulkMaterialsModal = function (materialIdArray, getFunction) {
    //     $scope.idsToDelete = materialIdArray;
    //     $scope.functionToCall = getFunction;

    //     $scope.modalInstance = $uibModal.open({
    //       animation: true,
    //       templateUrl: 'views/content/deleteBulkModal.html',
    //       scope: $scope,
    //       size: 'md'
    //     });
    //   }
    //   //-to delete bulk materials
    //   $scope.deleteBulkMaterials = function (materials) {
    //     masterMaterialService.deleteBulkMaterials(materials, function () {

    //       $scope.cancelModal();
    //       $scope.bulkMaterials = [];
    //       $scope.checkAll = false;
    //       $scope.checkboxStatus = false;
    //       $scope.getMaterialData();
    //       toastr.info('Record deleted successfully', 'Material Deletion!');
    //     });
    //   }
    //   //- to get bulk materials
    //   $scope.selectBulkMaterials = function (checkboxStatus, materialId) {
    //     masterMaterialService.selectBulkMaterials(checkboxStatus, materialId, function (data) {
    //       $scope.bulkMaterials = data;
    //     });
    //   }
    //   //- to select all records
    //   $scope.selectAll = function (materials, checkboxStatus) {
    //     masterMaterialService.selectAll(materials, checkboxStatus, function (data) {
    //       $scope.bulkMaterials = data;
    //     });
    //   }

    //- to dismiss modal instance
    $scope.cancelModal = function () {
        $scope.modalInstance.dismiss();
    }

    // *************************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function () {
        // to get BaseMaster Data
        $scope.getMaterialData();
    }

    $scope.init();

































    //modal start
    $scope.material = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/material/createOrEditMaterial.html',
            scope: $scope,
            size: 'md',
        });
    };
    // category modal start
    $scope.category = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/material/createOrEditMaterialCat.html',
            scope: $scope,
            size: 'md',
        });
    };
    // subCategory modal start
    $scope.subCategory = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/material/createOrEditmaterialSubCat.html',
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
    //end of modal
    //start of tree
    // $scope.materialCat = [{
    //     "name": "materialCat 1",
    //     "materialSub": [{
    //         "name": "MaterialSub Cat 1",
    //         "material": [{
    //             "name": "Material 1"
    //         }, {
    //             "name": "Material 2"
    //         }]
    //     }, ]
    // }, {
    //     "name": "materialCat 2",
    //     "materialSub": [{
    //         "name": "MaterialSub Cat 1",
    //         "material": [{
    //             "name": "Material 1"
    //         }, {
    //             "name": "Material 2"
    //         }]

    //     }, {
    //         "name": "MaterialSub Cat 2"
    //     }, {
    //         "name": "MaterialSub Cat 3"
    //     }]
    // }, {
    //     "name": "materialCat 3",
    //     "materialSub": [{
    //         "name": "MaterialSub Cat 1"
    //     }]
    // }];



});