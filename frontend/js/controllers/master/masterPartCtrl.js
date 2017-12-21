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
            toastr.success('Record deleted successfully');
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
            toastr.success('Part type deleted successfully');
            $scope.cancelModal();
            $scope.getPartData();
        });
    }

    //- to show preset sizes after click on partType name
    //- to show partTYpe materials click on partType name
    $scope.getPartTypeSizes = function (partTypeId) {
        $scope.partTypeId = partTypeId;
        masterPartService.getPartTypeSizes(partTypeId, function (data) {
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
            debugger;
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
        debugger;
        masterPartService.getPresetViewWithData(operation, presetData, function (data) {
            debugger;
            $scope.presetFormData = data.presetData;
            $scope.presetFormData.thickness = data.presetData.shape.thickness;
            $scope.presetFormData.length = data.presetData.shape.length;
            $scope.presetFormData.wastage = data.presetData.shape.wastage;
            $scope.presetFormData.formFactor = data.presetData.shape.formFactor;
            $scope.presetFormData.sizeFactor = data.presetData.shape.sizeFactor;
            $scope.presetFormData.presetName = data.presetData.shape.thickness;
            
            $scope.selectedShape = data.presetData.shape;
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
    }
    //- to add or edir part presets 
    //- called when click on --> save/update/save as new  button 
    $scope.getPresetFinalData = function (presetData, selectedShape) {

        presetData.shape = selectedShape._id;
        presetData.variable = selectedShape.variable;
        presetData.partFormulae = {
            perimeter: "",
            sheetMetalArea: "",
            surfaceArea: "",
            weight: ""
        };

        _.map(selectedShape.variable, function (n) {
            varName = n.varName;
            varValue = parseInt(n.varValue);
            perimeter = selectedShape.partFormulae.perimeter;
            sheetMetalArea = selectedShape.partFormulae.sheetMetalArea;
            surfaceArea = selectedShape.partFormulae.surfaceArea;
            weight = selectedShape.partFormulae.weight;

            tempVar = varName;
            window[tempVar] = varValue;

        });

        presetData.partFormulae.perimeter = eval(selectedShape.partFormulae.perimeter);
        presetData.partFormulae.sheetMetalArea = eval(selectedShape.partFormulae.sheetMetalArea);
        presetData.partFormulae.surfaceArea = eval(selectedShape.partFormulae.surfaceArea);
        presetData.partFormulae.weight = eval(selectedShape.partFormulae.weight);
        $scope.presetFormData.partFormulae = presetData.partFormulae;

    }
    $scope.addOrEditPartPreset = function (presetData, action) {
        // console.log('**** inside addOrEditPartPreset of masterPartCtrl.js ****',partTypeId);
        masterPartService.addOrEditPartPreset(presetData, action, function (data) {
            toastr.success('Record added successfully');
        });
    }

    //- to add material to partType 
    $scope.getMaterialData = function (partTypeId) {
        $scope.partTypeId = partTypeId;
        masterPartService.getMaterialData(function (data) {
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
            toastr.success('Material deleted successfully');
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