myApp.controller('createOrEditEstimateCtrl', function ($scope, createOrEditEstimateService, $uibModal) {


    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = false;
    $scope.showSaveBtn = true;
    $scope.showEditBtn = false;




    // *************************** default functions begin here  ********************** //
    //- to get all views of createOrEdit estimate screen dynamically 
    $scope.getEstimateView = function (getViewName, getLevelName, subAssemblyId, partId) {
        createOrEditEstimateService.estimateView(getViewName, function (data) {
            $scope.estimateView = data;
        });
        createOrEditEstimateService.estimateViewData(getViewName, getLevelName, subAssemblyId, partId, function (data) {
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
    //Edit Assembly Name modal start
    $scope.editAssemblyNameModal = function (assembly) {
        $scope.formData= assembly;
        
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/editAssemblyName.html',
            scope: $scope,
            size: 'md'
        });
    }
    $scope.editAssemblyName = function (obj) {
        $scope.getEstimateData();
        $scope.cancelModal();    
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
        createOrEditEstimateService.deleteSubAssembly(subAssemblyId, function () {
            $scope.operationStatus = "Record deleted successfully";
            $scope.getEstimateView('assembly');
            $scope.cancelModal();
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
        createOrEditEstimateService.deletePart(subAssemblyId, partId, function () {
            $scope.operationStatus = "Record deleted successfully";
            $scope.getEstimateView('subAssembly');            
            $scope.cancelModal();
        });
    }

    //- to add Proccessing at assembly or subssembly or at partLevel
    $scope.addProcessingModal = function (type, level, subAssemblyId, partId) {            
        $scope.formData = undefined;            
        $scope.showSaveBtn = true;
        $scope.showEditBtn = false;
        $scope.level = level;
        $scope.subAssemblyId = subAssemblyId;
        $scope.partId = partId;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/createOrEditProcessing.html',
            scope: $scope,
            size: 'md',
        });
    
    }
    $scope.addProcessing = function (processingData, level, subAssemblyId, partId) {
        createOrEditEstimateService.createProcessing(processingData, level, subAssemblyId, partId, function () {
            
            $scope.getEstimateView('processing', level, subAssemblyId, partId);
            $scope.cancelModal();
        });
    }
        //- to edit Proccessing at assembly or subssembly or at partLevel
    $scope.editProcessingModal = function (type, level, processingObj, subAssemblyId, partId) {            
        $scope.formData = processingObj;
        $scope.showSaveBtn = false;
        $scope.showEditBtn = true;
        $scope.level = level;
        $scope.subAssemblyId = subAssemblyId;
        $scope.partId = partId;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/createOrEditProcessing.html',
            scope: $scope,
            size: 'md',
        });

    }
    $scope.editProcessing = function (processingData, level, subAssemblyId, partId) { 
        createOrEditEstimateService.editProcessing(processingData, level, subAssemblyId, partId, function () {
            $scope.getEstimateData();
            $scope.cancelModal();
        });
    }
    //- function to confirm delete Processings
    $scope.deleteProcessing = function (processingId, level, subAssemblyId, partId) {
        createOrEditEstimateService.deleteProcessing(processingId, level, subAssemblyId, partId, function (data) {            
            $scope.operationStatus = "Record deleted successfully";
            $scope.getEstimateView('processing', level, subAssemblyId, partId);
            $scope.cancelModal();
        });
    }

    //- to add Addon at assembly or subssembly or at partLevel
    $scope.addAddonModal = function (type, level, subAssemblyId, partId) {            
        $scope.formData = undefined;            
        $scope.showSaveBtn = true;
        $scope.showEditBtn = false;
        $scope.level = level;
        $scope.subAssemblyId = subAssemblyId;
        $scope.partId = partId;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/createOrEditAddon.html',
            scope: $scope,
            size: 'md',
        });
    
    }
    $scope.addAddon = function (addonData, level, subAssemblyId, partId) {
        createOrEditEstimateService.createAddon(addonData, level, subAssemblyId, partId, function () {  
            $scope.getEstimateView('addons', level, subAssemblyId, partId);
            $scope.cancelModal();
        });
    }
        //- to edit Addon at assembly or subssembly or at partLevel
    $scope.editAddonModal = function (type, level, addonObj, subAssemblyId, partId) {            
        $scope.formData = addonObj;
        $scope.showSaveBtn = false;
        $scope.showEditBtn = true;
        $scope.level = level;
        $scope.subAssemblyId = subAssemblyId;
        $scope.partId = partId;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/createOrEditAddon.html',
            scope: $scope,
            size: 'md',
        });

    }
    $scope.editAddon = function (addonData, level, subAssemblyId, partId) { 
        createOrEditEstimateService.editAddon(addonData, level, subAssemblyId, partId, function () {
            $scope.getEstimateData();
            $scope.cancelModal();
        });
    }
        //- function to confirm delete Addons
    $scope.deleteAddon = function (addonId, level, subAssemblyId, partId) {        
        createOrEditEstimateService.deleteAddon(addonId, level, subAssemblyId, partId, function () {
            $scope.operationStatus = "Record deleted successfully";
            $scope.getEstimateView('addons', level, subAssemblyId, partId);
            $scope.cancelModal();
          });
    }


    //- to add Extra at assembly or subssembly or at partLevel
    $scope.addExtraModal = function (type, level, subAssemblyId, partId) {            
        $scope.formData = undefined;            
        $scope.showSaveBtn = true;
        $scope.showEditBtn = false;
        $scope.level = level;
        $scope.subAssemblyId = subAssemblyId;
        $scope.partId = partId;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/createOrEditExtra.html',
            scope: $scope,
            size: 'md',
        });
    
    }
    $scope.addExtra = function (extraData, level, subAssemblyId, partId) {
        createOrEditEstimateService.createExtra(extraData, level, subAssemblyId, partId, function () {            
            $scope.getEstimateView('extras', level, subAssemblyId, partId);
            $scope.cancelModal();
        });
    }
        //- to edit Extra at assembly or subssembly or at partLevel
    $scope.editExtraModal = function (type, level, extraObj, subAssemblyId, partId) {            
        $scope.formData = extraObj;
        $scope.showSaveBtn = false;
        $scope.showEditBtn = true;
        $scope.level = level;
        $scope.subAssemblyId = subAssemblyId;
        $scope.partId = partId;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/createOrEditExtra.html',
            scope: $scope,
            size: 'md',
        });

    }
    $scope.editExtra = function (extraData, level, subAssemblyId, partId) { 
        createOrEditEstimateService.editExtra(extraData, level, subAssemblyId, partId, function () {
            $scope.getEstimateData();
            $scope.cancelModal();
        });
    }
    //- function to confirm delete Extras
    $scope.deleteExtra = function (extraId, level, subAssemblyId, partId) {
        createOrEditEstimateService.deleteExtra(extraId, level, subAssemblyId, partId, function () {
            $scope.operationStatus = "Record deleted successfully";
            $scope.getEstimateView('extras', level, subAssemblyId, partId);
            $scope.cancelModal();
          });    
    }


    //- to add or edit custom material 
    $scope.addOrEditCustomMaterialModal = function (operation, customMaterial) {
        createOrEditEstimateService.getCustomMaterialModalData(operation, customMaterial, function (data) {

            $scope.formData = data.custMaterialObj;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/estimate/estimateModal/createOrEditCustomMaterial.html',
                scope: $scope,
                size: 'md',
            });
        });
    }
    //- modal to confirm delete custome materialss 
    $scope.deleteCustomMaterialModal = function (customMaterialId, getFunction) {
        $scope.idToDelete = customMaterialId;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
          animation: true,   
          templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
          scope: $scope,
          size: 'md'
        });
    }
    //- function to confirm delete CustomMterial
    $scope.deleteCustomMaterial = function () {
    }


    $scope.cancelModal = function () {
        $scope.modalInstance.dismiss();
    }


    // Delete modal start
    $scope.deleteItemModal = function (getFunction, itemId, level, subAssemblyId, partId) {
        $scope.idToDelete = itemId;
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


});