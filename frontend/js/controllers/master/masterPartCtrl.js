myApp.controller('masterPartCtrl', function ($scope, $uibModal, toastr, masterPartService) {

    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = false;
    //- to show/hide save & update button on pop-up according to operation
    $scope.showSaveBtn = true;
    $scope.showEditBtn = false;
    $scope.showPartView = false;
    $scope.showPartTypeProcessing = false;
    $scope.showPartTypeAddons = false;
    $scope.showPartTypeExtras = false;
    $scope.showPartTypeSize = false;
    $scope.showPartTypeMaterial = false;
    $scope.disableShape = false;
    $scope.selectedShape = {};
    $scope.showPresetSaveForm = false;
    $scope.showPresetUpdateForm = false;
    var varName = "";
    var varValue = "";
    var perimeter = 0;
    var sheetMetalArea = 0;
    var surfaceArea = 0;
    var weight = 0;
    var selectedMaterial = [];
    // $scope.formData = {};


    // *************************** default functions begin here  ********************** //
    $scope.getPartData = function () {
        masterPartService.getPartData(function (data) {
            $scope.partStructureData = data;
        });
    }

    // *************************** functions to be triggered form view begin here ***** //
    $scope.addOrEditPartTypeCatModal = function (operation, partTypeCat) {
        masterPartService.getPartTypeCatModalData(operation, partTypeCat, function (data) {
            $scope.formData = data.partTypeCat;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;
            $scope.operation = operation;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/master/part/createOrEditPartTypeCat.html',
                scope: $scope,
                size: 'md'
            });
        });
    }
    $scope.addOrEditPartTypeCat = function (operation, partTypeCatData) {
        masterPartService.addOrEditPartTypeCat(partTypeCatData, function (data) {
            if (operation == 'update') {
                toastr.success('Part Category Name Updated Successfully');

            } else {
                toastr.success('Part Category Name Added Successfully');
            }
            $scope.getPartData();
            $scope.cancelModal();
        });
    }
    $scope.deletePartTypeCatModal = function (partTypeCatId, getFunction) {
        $scope.idToDelete = partTypeCatId;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    $scope.deletePartTypeCat = function (partTypeCatId) {
        masterPartService.deletePartTypeCat(partTypeCatId, function (data) {
            if (_.isEmpty(data.data)) {
                toastr.success('Record deleted successfully');
            } else {
                toastr.error('Record cannot deleted.Dependency on ' + data.data[0].model + ' database');

            }
            $scope.getPartData();
            $scope.cancelModal();
        });
    }

    $scope.addOrEditPartTypeModal = function (operation, partTypeCatId, partType) {
        masterPartService.getPartTypeModalData(operation, partTypeCatId, partType, function (data) {
            $scope.formData = data.partType;
            $scope.partTypeCatId = data.partTypeCatId;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/master/part/createOrEditPartType.html',
                scope: $scope,
                size: 'md'
            });
        });
    }
    $scope.addOrEditPartType = function (partTypeData, partTypeCatId) {
        masterPartService.addOrEditPartType(partTypeData, partTypeCatId, function (data) {
            toastr.success('Part type  added/updated successfully');
            $scope.getPartData();
            $scope.cancelModal();
        });
    }

    $scope.deletePartType = function (partTypeId) {
        masterPartService.deletePartType(partTypeId, function (data) {
            if (_.isEmpty(data.data)) {
                toastr.success('Record deleted successfully');
            } else {
                toastr.error('Record cannot deleted.Dependency on ' + data.data[0].model + ' database');
            }
            $scope.cancelModal();
            $scope.getPartData();
        });
    }

    //- to show preset sizes after click on partType name
    //- to show partTYpe materials click on partType name
    $scope.getPartTypeSizes = function (partTypeId) {
        $scope.partTypeId = partTypeId;
        masterPartService.getPartTypeSizes(partTypeId, function (data) {
            selectedMaterial = data.materialArray;
            $scope.partTypeSizes = data.partSizes;
            $scope.partTypeMaterials = data.materials;
            $scope.showPartTypeSize = true;
            $scope.showPartTypeMaterial = true;
            $scope.disableShape = true;
        });
    }

    $scope.addNewPreset = function (operation, partTypeId) {
        $scope.presetFormData = {};
        $scope.showPresetSaveForm = true;
        $scope.showPresetUpdateForm = false;
        // $scope.selectedShape = {};

        // if sizes.length == 0 then make disableShape-->false
        $scope.disableShape = false;
        masterPartService.addNewPreset(operation, partTypeId, function (data) {
            $scope.showPartView = true;
            $scope.presetFormData = data;
            $scope.selectedShape = data.selectedShape;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;
        });
    }

    // 1149 2065 726
    // SBIN 000 6625

    //- to get/show preset view (with data in case of edit)
    //- called when click on + icon at partType (i.e. to add new preset ) &
    //- click on the preset size to edit preset 
    $scope.getPresetViewWithData = function (operation, presetData) {
        $scope.showPartView = true;
        presetData.shape.variable = presetData.variable;
        $scope.showPresetUpdateForm = true;
        $scope.showPresetSaveForm = false;

        masterPartService.getPresetViewWithData(operation, presetData, function (data) {

            $scope.presetFormData = data.presetData;
            $scope.presetFormData.thickness = data.presetData.shape.thickness;
            $scope.presetFormData.length = data.presetData.shape.length;
            $scope.presetFormData.wastage = data.presetData.shape.wastage;
            $scope.presetFormData.formFactor = data.presetData.shape.formFactor;
            $scope.presetFormData.sizeFactor = data.presetData.shape.sizeFactor;
            $scope.presetFormData.presetName = data.presetData.presetName;


            $scope.selectedShape = data.presetData.shape;
            if (angular.isDefined($scope.selectedShape.image)) {
                    $scope.presetFormData.image = $scope.selectedShape.image.file;
            }
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;
        });
    }
    //- to show all variable when shape will be selecetd by user
    $scope.showSelectedShapeData = function (shapeData) {
        _.map(shapeData.variable, function (n) {
            n.varValue = 0;
        });

        $scope.selectedShape = shapeData;
        $scope.presetFormData.thickness = shapeData.thickness;
        $scope.presetFormData.length = shapeData.length;
        $scope.presetFormData.wastage = shapeData.wastage;
        $scope.presetFormData.formFactor = shapeData.formFactor;
        $scope.presetFormData.sizeFactor = shapeData.sizeFactor;
        if (shapeData.image) {
            $scope.presetFormData.image = shapeData.image.file;
        }
        // _.map(shapeData.variable, function (n) {
        //     varName = n.varName;
        //     varValue = parseFloat(n.varValue);
        //     // perimeter = shapeData.partFormulae.perimeter;
        //     // sheetMetalArea = shapeData.partFormulae.sheetMetalArea;
        //     // surfaceArea = shapeData.partFormulae.surfaceArea;
        //     // weight = shapeData.partFormulae.weight;
        //     tempVar = varName;
        //     window[tempVar] = varValue;
        // });

        // if (angular.isDefined(shapeData.length) && shapeData.length != null) {
        //     var l = shapeData.length;
        // }
        // if (angular.isDefined(shapeData.thickness) && shapeData.thickness != null) {
        //     var t = shapeData.thickness;
        // }
        // if (angular.isDefined(shapeData.sizeFactor) && shapeData.sizeFactor != null) {
        //     var sf = shapeData.sizeFactor;
        // }
        // if (angular.isDefined(shapeData.formFactor) && shapeData.formFactor != null) {
        //     var ff = shapeData.formFactor;
        // }
        // if (angular.isDefined(shapeData.wastage) && shapeData.wastage != null) {
        //     var wtg = shapeData.wastage;
        // }

        // $scope.presetData.partFormulae.perimeter = eval(shapeData.partFormulae.perimeter);
        // $scope.presetData.partFormulae.sheetMetalArea = eval(shapeData.partFormulae.sheetMetalArea);
        // $scope.presetData.partFormulae.surfaceArea = eval(shapeData.partFormulae.surfaceArea);
        // $scope.presetData.partFormulae.weight = eval(shapeData.partFormulae.weight);
        // $scope.presetFormData.partFormulae = presetData.partFormulae;


    }
    //- to add or edir part presets 
    //- called when click on --> save/update/save as new  button 
    $scope.getPresetFinalData = function (presetData, selectedShape) {

        presetData.shape = selectedShape._id;
        presetData.variable = selectedShape.variable;
        presetData.partFormulae = {
            perimeter: 0,
            sheetMetalArea: 0,
            surfaceArea: 0,
            weight: 0
        };

        _.map(selectedShape.variable, function (n) {
            varName = n.varName;
            varValue = parseFloat(n.varValue);

            // perimeter = selectedShape.partFormulae.perimeter;
            // sheetMetalArea = selectedShape.partFormulae.sheetMetalArea;
            // surfaceArea = selectedShape.partFormulae.surfaceArea;
            // weight = selectedShape.partFormulae.weight;

            tempVar = varName;
            window[tempVar] = varValue;

        });

        if (angular.isDefined($scope.presetFormData.length) && $scope.presetFormData.length != null) {
            var l = parseFloat($scope.presetFormData.length);
        }
        if (angular.isDefined($scope.presetFormData.thickness) && $scope.presetFormData.thickness != null) {
            var t = parseFloat($scope.presetFormData.thickness);
        }
        if (angular.isDefined($scope.presetFormData.sizeFactor) && $scope.presetFormData.sizeFactor != null) {
            var sf = parseFloat($scope.presetFormData.sizeFactor);
        }
        if (angular.isDefined($scope.presetFormData.formFactor) && $scope.presetFormData.formFactor != null) {
            var ff = parseFloat($scope.presetFormData.formFactor);
        }
        if (angular.isDefined($scope.presetFormData.wastage) && $scope.presetFormData.wastage != null) {
            var wtg = parseFloat($scope.presetFormData.wastage);
        }

        presetData.partFormulae.perimeter = eval(selectedShape.partFormulae.perimeter);
        presetData.partFormulae.sheetMetalArea = eval(selectedShape.partFormulae.sheetMetalArea);
        presetData.partFormulae.surfaceArea = eval(selectedShape.partFormulae.surfaceArea);
        presetData.partFormulae.weight = eval(selectedShape.partFormulae.weight);
        $scope.presetFormData.partFormulae = presetData.partFormulae;

    }

    // $scope.changeVariableValues = function(presetData, selectedShape){

    // }
    $scope.addOrEditPartPreset = function (presetData, action) {
        masterPartService.addOrEditPartPreset(presetData, action, function (data) {
            if (_.isUndefined(data.error)) {
                toastr.success('Record added successfully');
            } else {
                toastr.error('Enter Part Details Properly');
            }

        });
    }

    //- to add material to partType 
    $scope.getMaterialData = function (partTypeId) {
        $scope.partTypeId = partTypeId;
        masterPartService.getMaterialData(selectedMaterial, function (data) {
            // $scope.matCatData = data.materialCats;
            // $scope.matSubCatData = data.materialSubCats;
            $scope.matData = data.materials;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/master/part/addMaterialToPartType.html',
                scope: $scope,
                size: 'md'
            });


        });
    };

    $scope.addMaterialToPartType = function (selectedMatId, partTypeId) {
        selectedMaterial.push(selectedMatId);
        masterPartService.addMaterialToPartType(selectedMatId, partTypeId, function (data) {
            toastr.success('Material Added To The PartType Successfully');
            $scope.cancelModal();
            $scope.getPartTypeSizes(data._id);
        });
    }

    $scope.deletePartTypeMaterialModal = function (partTypeId, materialId, getFunction) {
        $scope.idToDelete = materialId;
        $scope.functionToCall = getFunction;
        $scope.partTypeId = partTypeId;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/deleteItem.html',
            scope: $scope,
            size: 'md'
        });
    }
    $scope.deletePartTypeMaterial = function (materialId, partTypeId) {
        masterPartService.deletePartTypeMaterial(materialId, partTypeId, function (data) {
            if (_.isEmpty(data.data)) {
                toastr.success('Record deleted successfully');
            } else {

                // if(_.isEmpty(data.data)){
                //     _.remove(selectedMaterial, function (Id) {
                //         return Id == materialId;
                //     });
                //     toastr.success('Record deleted successfully');
                // }
                // else{
                toastr.error('Record cannot deleted.Dependency on ' + data.data[0].model + ' database');
            }
            $scope.cancelModal();
            $scope.getPartTypeSizes(partTypeId);
        });
    }

    // Delete part type modal
    $scope.deletePartTypeModal = function (partTypeId, getFunction) {
        $scope.idToDelete = partTypeId;
        $scope.functionToCall = getFunction;
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
            scope: $scope,
            size: 'md'
        });
    };

    //- to hide preset view
    //- called when click on cancel button on preset view
    $scope.hidePartPresetView = function () {
        $scope.showPartView = false;
    }

    //- to dismiss modal instance
    $scope.cancelModal = function () {
        $scope.modalInstance.dismiss();
    };

    // *************************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function () {
        // to get BaseMaster Data
        $scope.getPartData();
    }

    $scope.init();

});