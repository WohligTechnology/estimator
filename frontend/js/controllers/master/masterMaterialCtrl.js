myApp.controller('masterMaterialCtrl', function ($scope, $uibModal, toastr, masterMaterialService, TemplateService, usersRoleService) {

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
    $scope.bulkMaterials = []; //- for multiple records deletion
    $scope.checkAll = false; //- for all records selection
    $scope.checkboxStatus = false; //- for multiple records selection
    //- for title
    TemplateService.getTitle("MaterialMaterial");


    // *************************** default functions begin here  ********************** //
    //- to get access permissions
    $scope.getAccessPermissions = function () {
        //- for authorization
        usersRoleService.getUserCrudRole('Master', 'Material_Master', function (response) {
            if (response) {
                $scope.role = response;
                console.log('****.......... $scope.role in Material_Master...... ****', $scope.role);
            } else {
                // Infinite toastr. hide only when clicked to it.
                toastr[response.status]('', response.message, {
                    timeOut: 0,
                    extendedTimeOut: 0
                });
            }
        });
    }
    $scope.getMaterialData = function () {
        masterMaterialService.getMaterialData(function (data) {
            $scope.materialStructureData = data;
        });
    }

    // *************************** functions to be triggered form view begin here ***** //
    $scope.addOrEditMaterialCatModal = function (operation, materialCat) {
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
        masterMaterialService.addOrEditMaterialCat(materialCatData, function (data) {
            toastr.success('Material Category added/updated successfully');
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
        masterMaterialService.deleteMaterialCat(materialCatId, function (data) {
            if (data.value) {
                toastr.info(data.data);
            } else {
                toastr.error('There is some error');
            }
            $scope.cancelModal();
            $scope.getMaterialData();
        });
    }


    $scope.addOrEditMaterialSubCatModal = function (operation, materialCatId, materialSubCat) {
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
        masterMaterialService.addOrEditMaterialSubCat(materialSubCatData, materialCatId, function (data) {
            if (data.value) {
                toastr.success('Material SubCategory added successfully');
            } else {
                toastr.error('Material SubCategory is not added');
            }
            $scope.getMaterialData();
            $scope.cancelModal();
        });
    }
    //- modal to confirm material sub deletion
    $scope.deleteMaterialSubCatModal = function (materialSubCatId, getFunction) {
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
        masterMaterialService.deleteMaterialSubCat(materialSubCatId, function (data) {
            if (data.value) {
                toastr.info(data.data);
            } else {
                toastr.error('There is some error');
            }
            $scope.cancelModal();
            $scope.getMaterialData();
        });
    }


    $scope.addOrEditMaterialModal = function (type, operation, materialSubCatId, material) {
        masterMaterialService.getMaterialModalData(operation, materialSubCatId, material, function (data) {

            $scope.formData = data.material;
            if (operation == 'save') {
                $scope.formData = {
                    type: type
                }
            }
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
    $scope.addOrEditMaterial = function (materialData, materialSubCatId, type) {
        masterMaterialService.addOrEditMaterial(materialData, materialSubCatId, function (data) {
            if (data.value) {
                //toastr.success('Material added/updated successfully');
                //$scope.getMaterialData();
                if (type != 'edit') {
                    $scope.getSubCatMaterials(materialSubCatId);
                }
                if (angular.isDefined(type)) {
                    if (type == 'duplicate') {
                        toastr.success('Material Duplicated Successfully');
                    } else if (type != 'edit') {
                        toastr.success("Material added/updated Successfully");
                    }
                } else {
                    toastr.success("Material added/updated succesfully");
                    $scope.cancelModal();
                }
            } else {
                toastr.error('Material not added/updated');
            }
        });
    }
    //- instant edit particular master material
    $scope.editMaterial = function (materialId) {
        //- record is already editable so make it non-editble
        if ($scope.editMaterialId == materialId) {
            $scope.editMaterialId = '';
        } else {
            //- record is already non-editable so make it editble
            $scope.editMaterialId = materialId;
        }
    }
    //- instant edit all master materials
    $scope.instantEditAllMaterial = function (editAll) {
        if (editAll == true) {
            $scope.editAll = false;
        } else {
            $scope.editAll = true;
            toastr.info('Now you can edit any material');
        }
    }
    //- modal to confirm material deletion
    $scope.deleteMaterialModal = function (materialId, materialSubCatId, getFunction) {
        $scope.idToDelete = materialId;
        $scope.functionToCall = getFunction;
        //- because we are using same modal to keep code DRY
        $scope.subAssemblyId = materialSubCatId;
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/deletePartModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    $scope.deleteMaterial = function (materialSubCatId, materialId) {
        masterMaterialService.deleteBulkMaterials(materialId, function (data) {
            if (data.value) {
                if (data.value) {
                    toastr.info(data.data);
                } else {
                    toastr.error('There is some error');
                }
                $scope.cancelModal();
                $scope.getSubCatMaterials(materialSubCatId);
                //$scope.getMaterialData();
            } else {
                toastr.error("There is some error while deleting it");
            }
        }, 'singleMaterial');
    }

    $scope.getSubCatMaterials = function (materialSubCatId) {
        masterMaterialService.getSubCatMaterials(materialSubCatId, function (data) {
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
        // if (angular.isUndefined(keyword) || keyword == '') {
        //     if (numberOfRecords != '10') {
        //         masterMaterialService.getPaginationData(page, numberOfRecords, null, function (data) {
        //             $scope.subCatMaterials = data.results;
        //             masterMaterialService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
        //                 $scope.obj = obj;
        //             });
        //         });
        //     } else {
        //         masterMaterialService.getPaginationData(page, null, null, function (data) {
        //             $scope.subCatMaterials = data.results;
        //             masterMaterialService.getPaginationDetails(page, 10, data, function (obj) {
        //                 $scope.obj = obj;
        //             });
        //         });
        //     }
        // } else {
        masterMaterialService.getPaginationData(page, numberOfRecords, keyword, function (data) {
            $scope.subCatMaterials = data.results;
            masterMaterialService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
                $scope.obj = obj;
            });
        });
        // }
    }
    // //- to search the text in table
    // $scope.searchText = function (keyword, count) {
    //     masterMaterialService.getPaginationData(null, null, keyword, function (data) {
    //         $scope.subCatMaterials = data.results;
    //         masterMaterialService.getPaginationDetails(1, count, data, function (obj) {
    //             $scope.obj = obj;
    //         });
    //     });
    // }
    //   //- bulk materials deletion modal
    $scope.deleteBulkMaterialsModal = function (materialSubCatId, materialIdArray, getFunction) {
        $scope.idToDelete = materialIdArray;
        $scope.functionToCall = getFunction;
        //- because we are using same modal to keep code DRY
        $scope.subAssemblyId = materialSubCatId;
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/deletePartModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    //   //-to delete bulk materials
    $scope.deleteBulkMaterials = function (materialSubCatId, materials) {
        masterMaterialService.deleteBulkMaterials(materials, function (data) {
            if (data.value) {
                if (data.value) {
                    toastr.info(data.data);
                } else {
                    toastr.error('There is some error');
                }
                $scope.cancelModal();
                $scope.bulkMaterials = [];
                $scope.checkAll = false;
                $scope.checkboxStatus = false;
                $scope.getSubCatMaterials(materialSubCatId);
            } else {
                toastr.error("There is some error while deleting materials");
            }

        });
    }
    //   //- to get bulk materials
    $scope.selectBulkMaterials = function (checkboxStatus, materialId) {
        masterMaterialService.selectBulkMaterials(checkboxStatus, materialId, function (data) {
            $scope.bulkMaterials = data;
        });
    }
    //- to select all records
    $scope.selectAll = function (materials, checkAll) {
        masterMaterialService.selectAll(materials, checkAll, function (data) {
            $scope.bulkMaterials = data;
        });
    }

    //- to dismiss modal instance
    $scope.cancelModal = function () {
        $scope.modalInstance.dismiss();
        $scope.init();
    }

    $scope.helpMaterialModal = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/helpMaterialModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    $scope.duplicateMaterial = function (materialSubCatId, materialData) {
        masterMaterialService.duplicateMaterial(materialData, function (matData) {
            materialData = matData;
            $scope.addOrEditMaterial(materialData, materialSubCatId, 'duplicate');
        });

    }
    // *************************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function () {
        $scope.getAccessPermissions();
        if (angular.isDefined($scope.role)) {
            if ($scope.role.read) {
                // to get BaseMaster Data
                $scope.getMaterialData();
            }
        }
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