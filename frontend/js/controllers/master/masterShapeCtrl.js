myApp.controller('masterShapeCtrl', function ($scope, toastr, $uibModal, masterShapeService, TemplateService, usersRoleService) {
    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = false;
    $scope.showSaveBtn = true;
    $scope.showEditBtn = false;
    $scope.shapeVariables = [];
    $scope.disableField = false;
    $scope.variablesData = [];
    //- for title
    TemplateService.getTitle("ShapeMaster");

    // *************************** default functions begin here  ********************** //
    //- to get access permissions
    $scope.getAccessPermissions = function () {
        //- for authorization
        usersRoleService.getUserCrudRole('Master', 'Shape_Master', function (response) {
            if (response) {
                $scope.role = response;
                console.log('****.......... $scope.role in Shape_Master...... ****', $scope.role);
            } else {
                // Infinite toastr. hide only when clicked to it.
                toastr[response.status]('', response.message, {
                    timeOut: 0,
                    extendedTimeOut: 0
                });
            }
        });
    }
    //- get data to generate material tree structure dynamically 
    $scope.getShapeData = function () {
        masterShapeService.geShapeData(function (data) {
            $scope.shapeData = data;
        });
    }
    //- get all variables to add in shape 
    $scope.getVariablesData = function () {
        masterShapeService.getVariablesData(function (data) {
            $scope.variablesData = data;
        });
        masterShapeService.getAllUom(function (data) {
            $scope.uomData = data;
        });
    }


    // *************************** functions to be triggered form view begin here ***** //

    $scope.temp = function () {
        $scope.shapeView = 'views/content/master/shape/shapeView.html';
    }

    $scope.createOrEditShapeData = function (operation, shape) {
        masterShapeService.createOrEditShapeData(operation, shape, function (data) {
            $scope.shapeView = 'views/content/master/shape/tempView.html';
            $scope.formData = data.shape;
            $scope.variablesData = data.shapeVariables;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;
            // $scope.disableField = data.disableField;
            $scope.shapeVariables = data.shapeVarWithoutChunck;
        });
    }
    $scope.createOrEditShape = function (shape, shapeVariables) {
        if (_.isEmpty(shapeVariables)) {
            toastr.error("Please select variables");
        } else {
            shape.variable = shapeVariables;
            masterShapeService.createOrEditShape(shape, function (data) {
                if (data.value) {
                    toastr.success('Shape added/updated successfully');
                    $scope.getShapeData();
                } else {
                    toastr.error('Shape is not added/updated');
                }
    
            });
        }
    }
    $scope.deleteShapeModal = function (shapeId, getFunction) {
        $scope.idToDelete = shapeId;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    $scope.deleteShape = function (shapeId) {
        masterShapeService.deleteShape(shapeId, function (data) {
            if (_.isEmpty(data.data)) {
                toastr.success('Record deleted successfully');
                $scope.createOrEditShapeData('save'); //- to clear deleted data from view 
            } else {
                toastr.error('Record cannot deleted.Dependency on ' + data.data[0].model + ' database');
            }
            $scope.cancelModal();
            $scope.getShapeData();
        });
    }

    //- to add/remove seleted variables in the shape's-->variable array 
    $scope.addVariableToShape = function (checkboxStatus, variable) {
        if (angular.isDefined(variable.uom)) {
            if (checkboxStatus == 'unchecked') {
                var index = _.findIndex($scope.shapeVariables, ['varName', variable.varName]);
                variable.checkboxStatus = false; 
                //- removing shape from array 
                $scope.shapeVariables.splice(index, 1);
                // $scope.variablesData.splice(index, 1);
            } else if (checkboxStatus == 'checked') {
                var tempVarObj = {
                    varName: variable.varName,
                    uom: variable.uom
                };
                variable.checkboxStatus = true; 
                $scope.shapeVariables.push(tempVarObj);
                // $scope.variablesData.push(tempVarObj);
            }
        }
    }
    // $scope.addVariableToShape = function (checkboxStatus, variableName, uom) {
    //     if (checkboxStatus == 'unchecked') {
    //         var index = _.findIndex($scope.shapeVariables, ['varName', variableName]);
    //         //- removing shape from array 
    //         $scope.shapeVariables.splice(index, 1);
    //         // $scope.variablesData.splice(index, 1);
    //     } else if (checkboxStatus == 'checked') {
    //         var tempVarObj = {
    //             varName: variableName,
    //             uom: uom
    //         };
    //         $scope.shapeVariables.push(tempVarObj);
    //         // $scope.variablesData.push(tempVarObj);
    //     }
    // }
    //- create formulae for net weight dynamically
    $scope.calculateGrossWeight = function (nwt) {
        $scope.formData.partFormulae.grossWeight = "(" + nwt + ")*((wtg+" + 100 + ")/100)";
    }

    //- to dismiss modal instance
    $scope.cancelModal = function () {
        $scope.modalInstance.dismiss();
    }

    // *************************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function () {
        $scope.getAccessPermissions();
        if (angular.isDefined($scope.role)) {
            if ($scope.role.read) {
                $scope.getShapeData();
                $scope.getVariablesData();
            }
        }
    }
    $scope.init();
});