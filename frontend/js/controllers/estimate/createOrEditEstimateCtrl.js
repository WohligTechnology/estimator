myApp.controller('createOrEditEstimateCtrl', function ($scope, createOrEditEstimateService, $uibModal) {


    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = false;
    $scope.showSaveBtn = true;
    $scope.showEditBtn = false;




    // *************************** default functions begin here  ********************** //
    //- to get all views of createOrEdit estimate screen dynamically 
    $scope.getEstimateView = function (getViewName, getLevelName, getId ) {
        createOrEditEstimateService.estimateView(getViewName, function (data) {
            $scope.estimateView = data;
        });
        createOrEditEstimateService.estimateViewData(getViewName, getLevelName, getId, function (data) {
            $scope.level = getLevelName;
            $scope.estimateViewData = data;
        });
    }
    //- get data to generate tree structure dynamically i.e. get assembly stucture
    $scope.getEstimateData = function () {
        createOrEditEstimateService.getEstimateData(function (data) {
            $scope.estimteData = data.assembly;
        });
    }



    // *************************** functions to be triggered form view begin here ***** //
    //- to edit assembly name
    $scope.editAssemblyNameModal = function () {
        console.log('**** inside addOrEditSubAssemblyModal of createOrEditEstimateCtrl.js ****');
    }
    $scope.editAssemblyName = function () {
        console.log('**** inside editAssemblyName of createOrEditEstimateCtrl.js ****');
    }

    //- to add or edit subAssembly data
    $scope.addOrEditSubAssemblyModal = function (operation, subAssembly) {

        createOrEditEstimateService.getAllSubAssModalData(operation, subAssembly, function (data) {

            $scope.formData = data.subAssObj;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/estimate/estimateModal/createOrEditSubAssemblyName.html',
                scope: $scope,
                size: 'md',
            });
        });
    }
    $scope.addOrEditSubAssembly = function (subAssemblyData) {
    
        createOrEditEstimateService.createOrEditSubAssembly(subAssemblyData, function () {
            $scope.getEstimateData();
            $scope.cancelModal();
        });
    }

    //- modal to confirm subssembly deletion
    $scope.deleteSubAssemblyModal = function (subAssemblyId, getFunction) {
        $scope.idToDelete = subAssemblyId;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
          animation: true,   
          templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
          scope: $scope,
          size: 'md'
        });
    }
    $scope.deleteSubAssembly = function (subAssemblyId) {
        createOrEditEstimateService.deleteSubAssembly(subAssemblyId, function (data) {
            $scope.operationStatus = "Record deleted successfully";
            $scope.cancelModal();
            $scope.getEstimateData();
        });
    }

    //- to add or edit part name
    $scope.addOrEditPartModal = function (operation, subAssId, part) {
        createOrEditEstimateService.getAllPartModalData(operation, subAssId, part, function (data) {

            $scope.formData = data.partObj;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;
            $scope.subAssId = data.subAssId;


            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/estimate/estimateModal/createOrEditPartName.html',
                scope: $scope,
                size: 'md',
            });

        });
    }
    $scope.addOrEditPart = function (partData, subAssId) {
        createOrEditEstimateService.createOrEditPart(partData, subAssId, function () {
            $scope.getEstimateData();
            $scope.cancelModal();
        });
    }

    //- to add or edit part detail
    $scope.editPartItemDetails = function (subAssemblyId, partId) {
        console.log('**** inside editPartItemDetails of createOrEditEstimateCtrl.js ****');
        $scope.getEstimateView('estimatePartItemDetail');
    }
    //- modal to confirm part deletion
    $scope.deletePartModal = function (subAssemblyId, partId) {
        $scope.idToDelete = partId;
        $scope.subAssemblyId =subAssemblyId;

        $scope.modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'views/content/estimate/estimateModal/deletePartModal.html',
          scope: $scope,
          size: 'md'
        });
    }
    $scope.deletePart = function (subAssemblyId, partId) {    
        createOrEditEstimateService.deletePart(subAssemblyId, partId, function (data) {
            $scope.operationStatus = "Record deleted successfully";
            $scope.cancelModal();
            $scope.getEstimateData();
        });
    }

    //- to add or edit Proccessing at assembly or subssembly or at partLevel
    $scope.addOrEditProcessingModal = function (operation, type, level,processingObj) {
        createOrEditEstimateService.getProcessingModalData(operation, type, level, processingObj, function (data) {
            
            $scope.formData = data.processingObj;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;
            $scope.level = data.level;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/estimate/estimateModal/createOrEditProcessing.html',
                scope: $scope,
                size: 'md',
            });
        });
    }
    $scope.addOrEditProcessing = function (processingData,level) {        
        createOrEditEstimateService.createOrEditProcessing(processingData, level, function () {
            $scope.getEstimateData();
            $scope.cancelModal();
        });
    }
    //- function to confirm delete Processings
    $scope.deleteProccesing = function (processingId, level, subAssemblyId, partId) {
        console.log('**** IDs inside deleteFun ****', processingId, level, subAssemblyId, partId);
        createOrEditEstimateService.deleteProcessing(processingId, level, subAssemblyId, partId, function (data) {
            $scope.operationStatus = "Record deleted successfully";
            $scope.cancelModal();
            $scope.getEstimateData();
        });
    }

    //- to add or edit Addons at assembly or subssembly or at partLevel
    $scope.addOrEditAddonModal = function (operation, type, level, addonObj) {
        console.log('****addon obj ****',addonObj);
        createOrEditEstimateService.getAddonModalData(operation, type, level, addonObj, function (data) {
            console.log('**** editModal ****', addonObj);
            $scope.formData = data.addonObj;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;
            $scope.level = data.level;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/estimate/estimateModal/createOrEditAddon.html',
                scope: $scope,
                size: 'md',
            });
        });
    }
    $scope.addOrEditAddon = function (addonData, level) {

        createOrEditEstimateService.createOrEditAddon(addonData, level, function () {            
            $scope.getEstimateData();
            $scope.cancelModal();
        });
    }
    //- function to confirm delete Addons
    $scope.deleteAddon = function (addonId, level, subAssemblyId, partId) {
        console.log('**** inside adon delete ****', addonId, level, subAssemblyId, partId);
        
        createOrEditEstimateService.deleteAddon(addonId, level, subAssemblyId, partId, function (data) {
            $scope.operationStatus = "Record deleted successfully";
            $scope.cancelModal();
            $scope.getEstimateData();
          });
    }

    //- to add or edit Extras at assembly or subssembly or at partLevel
    $scope.addOrEditExtraModal = function (operation, type, level, extraObj) {
        console.log('****extra obj ****',extraObj);
        createOrEditEstimateService.getExtraModalData(operation, type, level, extraObj, function (data) {
           
            $scope.formData = data.extraObj;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;
            $scope.level = data.level;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/estimate/estimateModal/createOrEditExtra.html',
                scope: $scope,
                size: 'md',
            });
        });
    }
    $scope.addOrEditExtra = function (extraData, level) {
        createOrEditEstimateService.createOrEditExtra(extraData, level, function () {            
            $scope.getEstimateData();
            $scope.cancelModal();
        });
    }
    //- function to confirm delete Extras
    $scope.deleteExtra = function (extraId, level, subAssemblyId, partId) {
        console.log('**** inside extra delete ****', extraId, level, subAssemblyId, partId);
        createOrEditEstimateService.deleteExtra(extraId, level, subAssemblyId, partId, function (data) {
            $scope.operationStatus = "Record deleted successfully";
            $scope.cancelModal();
            $scope.getEstimateData();
          });    
    }


    //- to add or edit custom material 
    $scope.addOrEditCustomMaterialModal = function () {
        console.log('**** inside addOrEditCustomMaterialModal of createOrEditEstimateCtrl.js ****');
    }
    $scope.addOrEditCustomMaterialModal = function () {
        console.log('**** inside addOrEditCustomMaterial of createOrEditEstimateCtrl.js ****');
    }
    //- modal to confirm delete custome materialss 
    $scope.deleteCustomMaterialModal = function () {
        console.log('**** inside deleteCustomMaterialModal of createOrEditEstimateCtrl.js ****');
    }
    $scope.deleteCustomMaterial = function () {
        console.log('**** inside deleteCustomMaterial of createOrEditEstimateCtrl.js ****');
    }

    $scope.cancelModal = function () {
        $scope.modalInstance.dismiss();
    }



    // *************************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function () {
        // to get default view
        $scope.getEstimateView('assembly');
        //to get estimate tree structure data 
        $scope.getEstimateData();
    }

    $scope.init();









    //custom material 
    $scope.customMaterial = [{
            "id": "1",
            "baseMaterial": {
                "thickness": "kishori",
                "grade": "1",
            },
            "hardfacing": {
                "thickness": "20",
                "depositeGrade": "A"
            },
            "customization": "1",
            "price": {
                "kg": "67",
                "m": "98",
            },
            "efficiency": "45",
        },
        {
            "id": "1",
            "baseMaterial": {
                "thickness": "kishori",
                "grade": "1",
            },
            "hardfacing": {
                "thickness": "20",
                "depositeGrade": "A"
            },
            "customization": "1",
            "price": {
                "kg": "67",
                "m": "98",
            },
            "efficiency": "45",
        }
    ]

    //Edit Assembly Name modal start
    $scope.editAssembly = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/editAssemblyName.html',
            scope: $scope,
            size: 'md'
        });
    };
    //end of modal
    //Create or Edit Sub Assembly Name modal start
    $scope.createOrEditSubAssemblyModal = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/createOrEditSubAssemblyName.html',
            scope: $scope,
            size: 'md',
        });
    };

    $scope.createOrEditSubAssembly = function () {

    };
    //end of modal
    //Create or Edit Sub Assembly Name modal start
    $scope.createOrEditPart = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/createOrEditPartName.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
    //Create or Edit Processing modal start
    $scope.processing = function () {
        
    };
    //end of modal
    //Create or Edit Addon modal start
    $scope.addon = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/createOrEditAddon.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
    //Create or Edit Extra modal start
    $scope.extra = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/createOrEditExtra.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
    //Import SubAssembly modal start
    $scope.importSubAssembly = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/importSubAssembly.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
    //Import Part modal start
    $scope.importPart = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/importPart.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
    //create Or Edit CustomMaterial modal start
    $scope.estimateCustomMaterial = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/createOrEditCustomMaterial.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
    // Delete modal start
    $scope.deleteItemModal = function (getFunction, levelId, level, subAssemblyId, partId) {
        $scope.idToDelete = levelId;
        $scope.functionToCall = getFunction;
        $scope.level = level;
        $scope.subAssemblyId = subAssemblyId;
        $scope.partId = partId;

        $scope.modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'views/content/estimate/estimateModal/deleteItemModal.html',
          scope: $scope,
          size: 'md'
        });
    }
        //end of modal

});