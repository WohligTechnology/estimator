myApp.service('masterShapeService', function ($http, $timeout, $uibModal, NavigationService) {

    this.geShapeData = function (callback) {
        console.log('**** inside geShapeData of masterShapeService.js ****');
        NavigationService.boxCall('MShape/search', function (data) {
            callback(data.data.results);
        });
    }

    this.createOrEditShapeData = function (operation, shape, callback) {
        console.log('**** inside createOrEditShapeData of masterShapeService.js ****', operation);
        var shapeDataObj = {};
        if (angular.isDefined(shape)) {
            shapeDataObj.shape = shape;
        }
        if (operation == "save") {
            shapeDataObj.saveBtn = true;
            shapeDataObj.editBtn = false;
            shapeDataObj.shape = {};
        } else if (operation == "update") {
            shapeDataObj.saveBtn = false;
            shapeDataObj.editBtn = true;
        }
        callback(shapeDataObj);
    }
    this.createOrEditShape = function (shape, callback) {
        console.log('**** inside createOrEditShape of masterShapeService.js ****');
        NavigationService.apiCall('MShape/save', shape, function (data) {
            callback(data);
        });
    }
    this.deleteShape = function(shapeId,callback){
        var deleteShapeObj = {
            _id:shapeId
        };
        NavigationService.delete('MShape/delete',deleteShapeObj, function(data){
            callback(data);
        });
    }

    this.getVariablesData = function(callback){
        NavigationService.boxCall('MVariables/search', function (data) {
            var variableData = _.chunk(data.data.results, 3);
            console.log('**** inside this.getVariablesData of masterShapeService.js ****',variableData);
            callback(variableData);
        });
    }
});