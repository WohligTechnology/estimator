myApp.controller('baseMasterCtrl', function ($scope, toastr, $uibModal, baseMatserService, TemplateService) {

    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = true;
    //- to show/hide save & update button on pop-up according to operation
    $scope.showSaveBtn = true;
    $scope.showEditBtn = false;
    //- for title
    TemplateService.getTitle("BaseMaster");
    $scope.markupType = ['material', 'process', 'addon', 'extra'];
    // validation for select case in Marksup
    $scope.fixedMarkupData = {
        fixedMarkups: {},
        scaleFactors: {}
    };
    // *************************** default functions begin here  ********************** //
    $scope.getBaseMasterData = function () {
        $scope.getUomData();
        $scope.getDfData();
        $scope.getMarkupData();
        $scope.getFixedMarkupData();
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
    $scope.getFixedMarkupData = function () {
        $scope.showMarkupSaveBtn = $scope.showScaleSaveBtn = true;
        $scope.showMarkupEditBtn = $scope.showScaleEditBtn = false;
        baseMatserService.getFixedMarkupData(function (data) {
            if (!_.isEmpty(data)) {
                if (angular.isDefined(data.fixedMarkups)) {
                    $scope.showMarkupSaveBtn = false;
                    $scope.showMarkupEditBtn = true;
                }
                if (angular.isDefined(data.scaleFactors)) {
                    $scope.showScaleSaveBtn = false;
                    $scope.showScaleEditBtn = true;
                }
                $scope.fixedMarkupData = data;
            }
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


    //- to add or edit Variable Markups name
    $scope.addOrEditVariableMarkupModal = function (operation, markup) {
        baseMatserService.getMarkupModalData(operation, markup, $scope.markupData, function (data) {
            $scope.markupType = data.markupType;
            if (_.isEmpty(data.markupType)) {
                toastr.info("Variables markups are already added...");
            } else {
                $scope.formData = data.markup;
                $scope.showSaveBtn = data.saveBtn;
                $scope.showEditBtn = data.editBtn;
                $scope.operation = operation;

                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/content/master/base/createOrEditVariableMarkup.html',
                    scope: $scope,
                    size: 'md'
                });
            }
        });
    }
    //- to add or edit Variable Markups name
    // $scope.addOrEditFixedMarkupModal = function (operation, markup) {
    //     baseMatserService.getMarkupModalData(operation, markup, function (data) {
    //         $scope.formData = data.markup;
    //         $scope.showSaveBtn = data.saveBtn;
    //         $scope.showEditBtn = data.editBtn;

    //         $scope.modalInstance = $uibModal.open({
    //             animation: true,
    //             templateUrl: 'views/content/master/base/createOrEditFixedMarkup.html',
    //             scope: $scope,
    //             size: 'md'
    //         });
    //     });
    // }
    $scope.addOrEditFixedMarkup = function (operation, markupData) {
        baseMatserService.addOrEditFixedMarkup(markupData, function (data) {
            if (data.value) {
                if (operation == 'save') {
                    $scope.showMarkupSaveBtn = false;
                    $scope.showMarkupEditBtn = true;
                    toastr.success("Fixed-Markup added successfully");
                } else {
                    toastr.success("Fixed-Markup updated successfully");
                }
            } else {
                toastr.error("There is some error");
            }
        });
    }
    $scope.addOrEditVariableMarkup = function (operation, markupData) {
        $scope.validationObj = {
            errorCount: 0
        }
        if (_.isEmpty(markupData.markupType)) {
            $scope.validationObj.selectMarksup = "Select Markups";
            $scope.validationObj.errorCount++;
        } else {
            $scope.validationObj.selectMarksup = "";
        }
        if ($scope.validationObj.errorCount == 0) {
            baseMatserService.addOrEditVariableMarkup(markupData, function (data) {
                if (data.value) {
                    if (operation == 'save') {
                        toastr.success("Markup added successfully");
                    } else {
                        toastr.success("Markup updated successfully");
                    }
                    $scope.getMarkupData();
                } else {
                    toastr.error("There is some error");
                }
            });
        }
        $scope.cancelModal();
    }
    $scope.addOrEditMarkupScaling = function (operation, markupScaling) {
        baseMatserService.addOrEditFixedMarkup(markupScaling, function (data) {
            if (data.value) {
                if (operation == 'save') {
                    $scope.showScaleSaveBtn = false;
                    $scope.showScaleEditBtn = true;
                    toastr.success("Markups-Scaling added successfully");
                } else {
                    toastr.success("Markups-Scaling updated successfully");
                }
            } else {
                toastr.error("There is some error");
            }
        });
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
    $scope.deleteVariableMarkup = function (markupId) {
        baseMatserService.deleteVariableMarkup(markupId, function (data) {
            if (_.isEmpty(data.data)) {
                toastr.success('Record deleted successfully');
            } else {
                toastr.error('Record cannot deleted.Dependency on ' + data.data[0].model + ' database');
            }
            $scope.cancelModal();
            $scope.getMarkupData();
        });
    }
    // $scope.deleteFixedMarkup = function (markupId) {
    //     baseMatserService.deleteFixedMarkup(markupId, function (data) {
    //         if (_.isEmpty(data.data)) {
    //             toastr.success('Record deleted successfully');
    //         } else {
    //             toastr.error('Record cannot deleted.Dependency on ' + data.data[0].model + ' database');
    //         }
    //         $scope.cancelModal();
    //         $scope.getMarkupData();
    //     });
    // }

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