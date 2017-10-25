myApp.controller('masterPartCtrl', function ($scope, $uibModal, masterPartService) {

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
    $scope.selectedShape = {};
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

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/master/material/createOrEditMaterialCat.html',
                scope: $scope,
                size: 'md'
            });
        });
    }
    $scope.addOrEditPartTypeCat = function (partTypeCatData) {
        masterPartService.addOrEditPartTypeCat(partTypeCatData, function (data) {
            $scope.operationStatus = "Record added successfully";
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
            $scope.operationStatus = "Record deleted successfully";
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
            $scope.operationStatus = "Record added successfully";
            $scope.getPartData();
            $scope.cancelModal();
        });
    }
    $scope.deletePartTypeModal = function (materialSubCatId, getFunction) {
        $scope.idToDelete = materialSubCatId;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    $scope.deletePartType = function (materialSubCatId) {
        masterPartService.deleteMaterialSubCat(materialSubCatId, function (data) {
            $scope.operationStatus = "Record deleted successfully";
            $scope.cancelModal();
            $scope.getMaterialData();
        });
    }



    //- to show preset sizes after click on partType name
    $scope.getPartTypeSizes = function (partTypeId) {
        masterPartService.getPartTypeSizes(partTypeId, function (data) {
            $scope.partTypeSizes = data;
            $scope.showPartTypeSize = true;
        });

    }

    //-
    $scope.addNewPreset = function(operation, partTypeId){
        masterPartService.addNewPreset(operation, partTypeId, function (data) {
            $scope.showPartView = true;
            $scope.presetFormData = data;
            console.log('**** inside $scope.presetFormData of masterPartCtrl.js & data is ****',$scope.presetFormData);
        });
    }
    //- to get/show preset view (with data in case of edit)
    //- called when click on + icon at partType (i.e. to add new preset )    &
    //- click on the preset size to edit preset 
    $scope.getPresetViewWithData = function (operation, presetData) {
        
        $scope.showPartView = true;

        masterPartService.getPresetViewWithData(operation, presetData, function (data) {
            $scope.presetFormData = data.presetData;
            $scope.shapeData = data.shapeData;
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
            varValue = n.varValue;
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
    $scope.addOrEditPartPreset = function (presetData,partTypeId) {
        // console.log('**** inside addOrEditPartPreset of masterPartCtrl.js ****',partTypeId);
        masterPartService.addOrEditPartPreset(presetData, function(data){
            $scope.operationStatus = "Record added successfully";
        });
    }
    
    
    
    
    
    
    
    
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

















































    //start of tree


    //start of part type category modal
    $scope.partTypeCat = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/part/createOrEditPartType.html',
            scope: $scope,
            size: 'md',

        })
    }
    //start of part type modal
    $scope.partType = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/part/createPartType.html',
            scope: $scope,
            size: 'md',

        })
    }

    // Delete modal start
    $scope.deleteItem = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/delete.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
    //AddAddon modal start
    $scope.addAddon = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/part/addAddonToPreset.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
    //AddProcessing modal start
    $scope.addProcessing = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/part/addProcessingToPreset.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
    //AddExtra modal start
    $scope.addExtra = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/part/addExtraToPreset.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
    //AddMaterial modal start
    $scope.addMaterial = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/part/addMaterialToPartType.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
    //veriables 
    $scope.checkBox = [

        {
            "name": "a",
        }, {
            "name": "b",
        }, {
            "name": "c",
        }, {
            "name": "d"
        }, {
            "name": "e"
        }, {
            "name": "f"
        }, {
            "name": "g"
        }, {
            "name": "q1"
        }, {
            "name": "q2"
        }, {
            "name": "Thikness(t)"
        }, {
            "name": "Length(l)"
        }, {
            "name": "Wastage(w)"
        },
    ]

    $scope.checkBox = _.chunk($scope.checkBox, 2);
});