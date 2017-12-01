myApp.service('masterShapeService', function (NavigationService) {

    this.variableData = [{
        'varName': 'a'
    }, {
        'varName': 'b'
    }, {
        'varName': 'c'
    }, {
        'varName': 'd'
    }, {
        'varName': 'e'
    }, {
        'varName': 'f'
    }, {
        'varName': 'g'
    }, {
        'varName': 'h'
    }, {
        'varName': 'i'
    }, {
        'varName': 'j'
    }, {
        'varName': 'k'
    }];
    
    this.geShapeData = function (callback) {
        NavigationService.boxCall('MShape/search', function (data) {
            callback(data.data.results);
        });
    }

    this.getVariablesData = function (callback) {
        var tempObj = _.chunk(this.variableData, 3);
        callback(tempObj);
    }

    this.createOrEditShapeData = function (operation, shape, callback) {
        
        var shapeDataObj = {};

        if (angular.isDefined(shape)) {
            shapeDataObj.shape = shape;
        } else {
            shapeDataObj.shape = {};
        }

        if (operation == "save") {
            shapeDataObj.saveBtn = true;
            shapeDataObj.editBtn = false;
            shapeDataObj.shapeVariables = _.cloneDeep(this.variableData);

            _.map(shapeDataObj.shapeVariables, function (n) {                
                n.checkboxStatus = false;
            });

            shapeDataObj.shapeVariables = _.chunk(shapeDataObj.shapeVariables, 3);
            callback(shapeDataObj);

        } else if (operation == "update") {
            shapeDataObj.saveBtn = false;
            shapeDataObj.editBtn = true;
            var tempArray = _.cloneDeep(this.variableData)

            _.map(tempArray, function (n) {                
                if (_.findIndex(shape.variable, ['varName', n.varName]) == -1) {
                    n.checkboxStatus = false;
                } else {
                    n.checkboxStatus = true;
                }
            });
            shapeDataObj.shapeVariables = _.chunk(tempArray, 3);
            callback(shapeDataObj);
        }

    }
    this.createOrEditShape = function (shape, callback) {
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