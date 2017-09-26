myApp.controller('createOrEditEstimateCtrl', function ($scope, createOrEditEstimateService, $uibModal) {


    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = false;



    // *************************** default functions begin here  ********************** //
    //- to get all views of createOrEdit estimate screen dynamically 
    $scope.getEstimateView = function (getViewName, getId, getLevelName) {
        createOrEditEstimateService.estimateView(getViewName, function (data) {
            $scope.estimateView = data;
        });
        createOrEditEstimateService.estimateViewData(getViewName, getLevelName, getId, function (data) {
            $scope.estimateViewData = data;
        });
    }
    //- get data to generate tree structure dynamically i.e. get assembly stucture
    $scope.getEstimateData = function () {
        createOrEditEstimateService.getEstimateData(function (data) {
            $scope.estimteData = data;
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

    //- to add or edit subAssembly name
    $scope.addOrEditSubAssemblyModal = function () {
        console.log('**** inside addOrEditSubAssemblyModal of createOrEditEstimateCtrl.js ****');
    }
    $scope.addOrEditSubAssembly = function (subAssemblyId) {
        console.log('**** inside addOrEditSubAssembly of createOrEditEstimateCtrl.js ****');
    }
    //- modal to confirm subssembly deletion
    $scope.deleteSubAssemblyModal = function (subAssemblyId) {
        console.log('**** inside deleteSubAssemblyModal of createOrEditEstimateCtrl.js ****');
    }
    $scope.deleteSubAssembly = function (subAssemblyId) {
        console.log('**** inside deleteSubAssembly of createOrEditEstimateCtrl.js ****');
    }

    //- to add or edit part name
    $scope.addOrEditPartNameModal = function (subAssemblyId, partId) {
        console.log('**** inside addOrEditPartNameModal of createOrEditEstimateCtrl.js ****');
    }
    $scope.addOrEditPartName = function (subAssemblyId, partId) {
        console.log('**** inside addOrEditPartName of createOrEditEstimateCtrl.js ****');
    }
    //- to add or edit part detail
    $scope.editPartItemDetails = function (subAssemblyId, partId) {
        console.log('**** inside editPartItemDetails of createOrEditEstimateCtrl.js ****');
        $scope.getEstimateView('estimatePartItemDetail');
    }
    //- modal to confirm part deletion
    $scope.deletePartModal = function (partIds) {
        console.log('**** inside deletePartModal of createOrEditEstimateCtrl.js ****');
    }
    $scope.deletePart = function (partIds) {
        console.log('**** inside deletePart of createOrEditEstimateCtrl.js ****');
    }

    //- to add or edit Proccessing at assembly or subssembly or at partLevel
    $scope.addOrEditProceesingModal = function () {
        console.log('**** inside addOrEditProceesingModal of createOrEditEstimateCtrl.js ****');
    }
    $scope.addOrEditProceesing = function () {
        console.log('**** inside addOrEditProceesing of createOrEditEstimateCtrl.js ****');
    }
    //- modal to confirm delete Processings
    $scope.deleteProccesingModal = function () {
        console.log('**** inside deleteProccesingModal of createOrEditEstimateCtrl.js ****');
    }
    $scope.deleteProccesing = function () {
        console.log('**** inside deleteProccesing of createOrEditEstimateCtrl.js ****');
    }

    //- to add or edit Addons at assembly or subssembly or at partLevel
    $scope.addOrEditAddonModal = function () {
        console.log('**** inside addOrEditAddonModal of createOrEditEstimateCtrl.js ****');
    }
    $scope.addOrEditAddon = function () {
        console.log('**** inside addOrEditAddon of createOrEditEstimateCtrl.js ****');
    }
    //- modal to confirm delete Addons
    $scope.deleteAddonModal = function () {
        console.log('**** inside deleteAddonModal of createOrEditEstimateCtrl.js ****');
    }
    $scope.deleteAddon = function () {
        console.log('**** inside deleteAddon of createOrEditEstimateCtrl.js ****');
    }

    //- to add or edit Extras at assembly or subssembly or at partLevel
    $scope.addOrEditExtraModal = function () {
        console.log('**** inside addOrEditExtraModal of createOrEditEstimateCtrl.js ****');
    }
    $scope.addOrEditExtra = function () {
        console.log('**** inside addOrEditExtra of createOrEditEstimateCtrl.js ****');
    }
    //- modal to confirm delete Extras
    $scope.deleteExtraModal = function () {
        console.log('**** inside deleteExtraModal of createOrEditEstimateCtrl.js ****');
    }
    $scope.deleteExtra = function () {
        console.log('**** inside deleteExtra of createOrEditEstimateCtrl.js ****');
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
    $scope.createOrEditSubAssembly = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/createOrEditSubAssemblyName.html',
            scope: $scope,
            size: 'md',
        });
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
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/createOrEditProcessing.html',
            scope: $scope,
            size: 'md',
        });
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
    $scope.deleteItem = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/delete.html',
            scope: $scope,
            size: 'sm',
        });
    };
    //end of modal

});