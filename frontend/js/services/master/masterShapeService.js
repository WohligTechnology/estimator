myApp.service('masterShapeService', function ($http, $timeout, $uibModal, NavigationService) {

    this.geShapeData = function (callback) {
        console.log('**** inside geShapeData of masterShapeService.js ****');
        NavigationService.boxCall('MShape/search', function (data) {
            callback(data.data.results);
        });
    }

    this.getVariablesData = function (callback) {
        NavigationService.boxCall('MVariables/search', function (data) {
            var variableData = _.chunk(data.data.results, 3);
            console.log('**** inside this.getVariablesData of masterShapeService.js ****', variableData);
            callback(variableData);
        });
    }

    this.createOrEditShapeData = function (operation, shape, callback) {
        console.log('**** inside createOrEditShapeData of masterShapeService.js ****', operation);
        var shapeDataObj = {};
        shapeDataObj.shapeVariables = [];
        // shapeDataObj.shape = {};

        var array = [];

        if (angular.isDefined(shape)) {
            shapeDataObj.shape = shape;
        }else{
            shapeDataObj.shape = {};
        }
        
        if (operation == "save") {
            shapeDataObj.saveBtn = true;
            shapeDataObj.editBtn = false;
            NavigationService.boxCall('MVariables/getAllVarId', function (data) {
                var dataObj = data.data;
                _.map(dataObj, function (n) {
                    n.checkboxStatus = false;
                    array.push({_id:n._id, variableName:n.variableName, checkboxStatus:n.checkboxStatus});
                });
                shapeDataObj.shape.variable = _.chunk(array, 3);
                callback(shapeDataObj);
            });
        } else if (operation == "update") {
            shapeDataObj.saveBtn = false;
            shapeDataObj.editBtn = true;
            NavigationService.boxCall('MVariables/getAllVarId', function (data) {
                var variableData = data.data;
                _.map(variableData, function (n) {
                    if (shapeDataObj.shape.variable.indexOf(n._id) == -1) {
                        n.checkboxStatus = false;
                    } else {
                        n.checkboxStatus = true;
                        shapeDataObj.shapeVariables.push(n._id);
                    }
                });
                shapeDataObj.shape.variable = _.chunk(variableData, 3);
                console.log('**** inside ############3 of masterShapeService.js & data is ****',shapeDataObj);
                callback(shapeDataObj);
            });

        }

    }
    this.createOrEditShape = function (shape, callback) {
        console.log('**** inside createOrEditShape of masterShapeService.js ****');
        NavigationService.apiCall('MShape/save', shape, function (data) {
            callback(data);
        });
    }
    this.deleteShape = function (shapeId, callback) {
        var deleteShapeObj = {
            _id: shapeId
        };
        NavigationService.delete('MShape/delete', deleteShapeObj, function (data) {
            callback(data);
        });
    }

});