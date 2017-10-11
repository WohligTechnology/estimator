myApp.controller('masterPartCtrl', function ($scope, $uibModal, masterPartService) {

    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = false;
    //- to show/hide save & update button on pop-up according to operation
    $scope.showSaveBtn = true;
    $scope.showEditBtn = false;


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
        masterPartService.getPartTypeModalData(operation, partTypeCatId, partType, function (data) {
            $scope.formData = data.partType;
            $scope.partTypeCatId = data.partTypeCatId;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/master/material/createOrEditPartType.html',
                scope: $scope,
                size: 'md'
            });
        });
    }
    $scope.addOrEditPartType = function (partTypeData, partTypeCatId) {
        masterPartService.addOrEditMaterialSubCat(partTypeData, partTypeCatId, function (data) {
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


    $scope.addOrEditPartTypeModal = function (operation, partTypeId, partType) {
        masterPartService.getPartTypeModalData(operation, partTypeId, partType, function (data) {
            $scope.formData = data.partType;
            $scope.catId = data.catId;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/master/material/createOrEditpartType.html',
                scope: $scope,
                size: 'md'
            });
        });
    }
    $scope.addOrEditpartType = function (partTypeData, partTypeId) {
        masterPartService.addOrEditpartType(partTypeData, partTypeId, function (data) {
            $scope.operationStatus = "Record added successfully";
            $scope.getMaterialData();
            $scope.cancelModal();
        });
    }
    $scope.deletepartTypeModal = function (partTypeId, getFunction) {
        $scope.idToDelete = partTypeId;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    $scope.deletepartType = function (partTypeId) {
        masterPartService.deletepartType(partTypeId, function (data) {
            $scope.operationStatus = "Record deleted successfully";
            $scope.cancelModal();
            $scope.getMaterialData();
        });
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