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
    // $scope.formData = {};


    // *************************** default functions begin here  ********************** //
    $scope.getPartData = function () {
        masterPartService.getPartData(function (data) {
            $scope.partStructureData = data;
        });
    }

    // *************************** functions to be triggered form view begin here ***** //
    $scope.addOrEditPartTypeCatModal = function (operation, partTypeCat) {
        console.log('**** inside addOrEditPartTypeCatModal of createOrEditMaterialCtrl.js ****', operation);
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
        console.log('**** inside addOrEditPartTypeCat of createOrEditMaterialCtrl.js ****');
        masterPartService.addOrEditPartTypeCat(partTypeCatData, function (data) {
            $scope.operationStatus = "Record added successfully";
            $scope.getPartData();
            $scope.cancelModal();
        });
    }
    //- modal to confirm material cat deletion
    $scope.deletePartTypeCatModal = function (partTypeCatId, getFunction) {
        console.log('**** inside deleteMaterialCatModal of createOrEditMaterialCtrl.js ****', getFunction);
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
        console.log('**** inside addOrEditPartTypeModal of masterPartCtrl.js & data is ****', partTypeCatId);
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


    $scope.addOrEditPartPreset = function (presetData,selectedShape) {
        presetData.shape = selectedShape; 
        console.log('**** inside $scope.selectedShape of masterPartCtrl.js ****',selectedShape);
        console.log('**** inside presetData of masterPartCtrl.js ****',presetData);

        // we have all the thing reqiured to save preset excepting size
        // once we get the size then make a proper preset object & save it directly 
        
    }
    $scope.getPartTypeSizes = function (partTypeId) {
        masterPartService.getPartTypeSizes(partTypeId, function (data) {
            $scope.partTypeSizes = data;
            $scope.showPartTypeSize = true;
        });

    }
    $scope.getPresetViewWithData = function (operation, presetData) {
        // console.log('**** inside operation of masterPartCtrl.js ****', operation);
        // console.log('**** inside presetData of masterPartCtrl.js ****', presetData);
        $scope.showPartView = true;
        masterPartService.getPresetViewWithData(operation, presetData, function (data) {
            $scope.presetFormData = data.presetData;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;
            $scope.shapeData = data.shapeData;
            console.log('**** inside ^^^^^^^^^^ of masterPartCtrl.js & data is ****', $scope.formData);
        });
    }

    $scope.showSelectedShapeData = function(shapeData){
        
        var finalShapeData = [];
        var obj = {};

        _.map(shapeData.variable, function(n){
            obj.variableName = n.variableName;
            // obj._id = n._id;
            obj.variableValue = 0;
            finalShapeData.push(obj);
        });
        
        shapeData.variable = [];
        shapeData.variable = finalShapeData;
        $scope.selectedShapeData = shapeData;
        console.log('**** inside &&&&&&&&&&&&&&&&&&& of masterPartCtrl.js ****',$scope.selectedShapeData);
    }


    $scope.hidePartPresetView = function(){
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