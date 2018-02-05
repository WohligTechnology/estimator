myApp.controller('baseMasterCtrl', function ($scope, toastr, $uibModal, baseMatserService, TemplateService) {

    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = true;
    //- to show/hide save & update button on pop-up according to operation
    $scope.showSaveBtn = true;
    $scope.showEditBtn = false;
    //- for title
    TemplateService.getTitle("BaseMaster");

    // validation for select case in Marksup
    $scope.selectMarksup = "";
    // *************************** default functions begin here  ********************** //
    $scope.getBaseMasterData = function () {
        $scope.getUomData();
        $scope.getDfData();
        $scope.getMarkupData();
    }
    $scope.getUomData = function () {
        baseMatserService.getUomData(function (data) {
            $scope.uomData = data;
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
            toastr.success("UOM added/updated successfully");
            $scope.getUomData();
            $scope.cancelModal();
        });
    }
    //- modal to confirm UOM deletion
    $scope.deleteUomModal = function (uomId, getFunction) {
        $scope.idToDelete = uomId;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    $scope.deleteUom = function (uomId) {
        baseMatserService.deleteUom(uomId, function (data) {
            if (_.isEmpty(data.data)) {
                toastr.success('Record deleted successfully');
            } else {
                toastr.error('Record cannot deleted.Dependency on ' + data.data[0].model + ' database');
            }
            $scope.cancelModal();
            $scope.getUomData();
        });
    }
    //- to add or edit DF i.e. Difficulty factor
    $scope.addOrEditDfModal = function (operation, df) {
        baseMatserService.getDfModalData(operation, df, function (data) {
            $scope.formData = data.df;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/master/base/createOrEditDFact.html',
                scope: $scope,
                size: 'md'
            });
        });
    }
    $scope.addOrEditDf = function (dfData) {
        baseMatserService.addOrEditDf(dfData, function (data) {
            toastr.success("Difficulty Factor added/updated successfully");
            $scope.getDfData();
            $scope.cancelModal();
        });
    }
    //- modal to confirm DF deletion
    $scope.deleteDfModal = function (dfId, getFunction) {
        $scope.idToDelete = dfId;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    $scope.deleteDf = function (dfId) {
        baseMatserService.deleteDf(dfId, function (data) {
            if (_.isEmpty(data.data)) {
                toastr.success("Difficulty Factor deleted successfully");
            } else {
                toastr.error('Record cannot deleted.Dependency on ' + data.data[0].model + ' database');
            }
            $scope.cancelModal();
            $scope.getDfData();
        });
    }


    //- to add or edit Markups name
    $scope.addOrEditMarkupModal = function (operation, markup) {
        baseMatserService.getMarkupModalData(operation, markup, function (data) {
            $scope.formData = data.markup;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/master/base/createOrEditMarkup.html',
                scope: $scope,
                size: 'md'
            });
        });

    }
    $scope.addOrEditMarkup = function (markupData) {
        var errorCount = 0;
        if (_.isEmpty(markupData.markupType)) {
            $scope.selectMarksup = "Select Markups";
            errorCount++;
        } else {
            $scope.selectMarksup = "";
        }
        if (errorCount == 0) {
            baseMatserService.addOrEditMarkup(markupData, function (data) {
                toastr.success("Markup added/updated successfully");
                $scope.getMarkupData();
                $scope.cancelModal();
            });
        }
    }
    //- modal to confirm Markups deletion
    $scope.deleteMarkupModal = function (markupId, getFunction) {
        $scope.idToDelete = markupId;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    $scope.deleteMarkup = function (markupId) {
        baseMatserService.deleteMarkup(markupId, function (data) {
            if (_.isEmpty(data.data)) {
                toastr.success('Record deleted successfully');
            } else {
                toastr.error('Record cannot deleted.Dependency on ' + data.data[0].model + ' database');
            }
            $scope.cancelModal();
            $scope.getMarkupData();
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
        $scope.getBaseMasterData();
    }

    $scope.init();

});