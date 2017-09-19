myApp.controller('baseMatserCtrl', function ($scope, $http, $uibModal, baseMatserService) {

    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = true;
    $scope.showSaveBtn = true;
    $scope.showEditBtn = false;


    // *************************** default functions begin here  ********************** //
    $scope.getBaseMasterData = function () {
        $scope.getUomData();
        $scope.getVariableData();
        $scope.getDfData();
        $scope.getMarkupData();
    }
    $scope.getUomData = function () {
        baseMatserService.getUomData(function (data) {
            $scope.uomData = data;
        });
    }
    $scope.getVariableData = function () {
        baseMatserService.getVariableData(function (data) {
            $scope.variableData = data;
        });
    }
    $scope.getDfData = function () {
        baseMatserService.getDfData(function (data) {
            $scope.dfData = data;
        });

    }
    $scope.getMarkupData = function () {
        baseMatserService.getMarkupData(function (data) {
            $scope.markupData = data;
        });
    }


    // *************************** functions to be triggered form view begin here ***** //
    //- to add or edit UOM name
    $scope.addOrEditUomModal = function (operation, uom) {

        baseMatserService.getUomModalData(operation, uom, function (data) {
            $scope.formData = data.uom;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/master/base/createOrEditUom.html',
                scope: $scope,
                size: 'md'
            });

        });
    }

    $scope.addOrEditUom = function (uomData) {
        baseMatserService.addOrEditUom(uomData, function (data) {
            $scope.operationStatus = "Added Successfully";
            $scope.getUomData();
            $scope.cancelModal();
        });
    }
    //- modal to confirm UOM deletion
    $scope.deleteUomModal = function (uomId) {
        console.log('**** inside deleteUomModal of baseMatserCtrl.js ****', uomId);
    }
    $scope.deleteUom = function () {
        console.log('**** inside deleteUom of baseMatserCtrl.js ****');
    }


    //- to add or edit Variable name
    $scope.addOrEditVariableModal = function (variableId) {
        console.log('**** inside addOrEditVariableModal of baseMatserCtrl.js ****', variableId);
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/createOrEditVariable.html',
            scope: $scope,
            size: 'md',
        });
    }
    $scope.addOrEditVariable = function () {
        console.log('**** inside addOrEditVariable of baseMatserCtrl.js ****');
    }
    //- modal to confirm Variable deletion
    $scope.deleteVariableModal = function (variableId) {
        console.log('**** inside deleteVariableModal of baseMatserCtrl.js ****', variableId);
    }
    $scope.deleteVariable = function () {
        console.log('**** inside deleteVariable of baseMatserCtrl.js ****');
    }


    //- to add or edit DF i.e. Difficulty factor
    $scope.addOrEditDfModal = function (dfId) {
        console.log('**** inside addOrEditDfModal of baseMatserCtrl.js ****', dfId);
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/createOrEditDFact.html',
            scope: $scope,
            size: 'md',
        });
    }
    $scope.addOrEditDf = function () {
        console.log('**** inside addOrEditDf of baseMatserCtrl.js ****');
    }
    //- modal to confirm DF deletion
    $scope.deleteDfModal = function (dfId) {
        console.log('**** inside deleteDfModal of baseMatserCtrl.js ****', dfId);
    }
    $scope.deleteDf = function () {
        console.log('**** inside deleteDf of baseMatserCtrl.js ****');
    }


    //- to add or edit Markups name
    $scope.addOrEditMarkupsModal = function (markupId) {
        console.log('**** inside addOrEditMarkupsModal of baseMatserCtrl.js ****', markupId);
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/createOrEditMarkups.html',
            scope: $scope,
            size: 'md',
        });
    }
    $scope.addOrEditMarkups = function () {
        console.log('**** inside addOrEditMarkups of baseMatserCtrl.js ****');
    }
    //- modal to confirm Markups deletion
    $scope.deleteMarkupsModal = function (markupId) {
        console.log('**** inside deleteMarkupsModal of baseMatserCtrl.js ****', markupId);
    }
    $scope.deleteMarkups = function () {
        console.log('**** inside deleteMarkups of baseMatserCtrl.js ****');
    }


    $scope.cancelModal = function () {
        $scope.modalInstance.dismiss();
    };


    // *************************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function () {
        // to get BaseMaster Data
        $scope.getBaseMasterData();
    }

    $scope.init();

});