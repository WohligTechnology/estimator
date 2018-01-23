myApp.service('masterShapeService', function (
    NavigationService) {

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
        var shapeDataObj = {
            shapeVarWithoutChunck : []
        };

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
            // shapeDataObj.shapeVarWithoutChunck = [];

            var tempArray = _.cloneDeep(this.variableData);           
            _.map(tempArray, function (n) {
                 
                if (_.findIndex(shape.variable, ['varName', n.varName]) == -1) {
                    n.checkboxStatus = false;
                } else {
                     
                    shapeDataObj.shapeVarWithoutChunck.push(_.cloneDeep(n));
                    n.checkboxStatus = true;
                }
            });
            shapeDataObj.shapeVariables = _.chunk(tempArray, 3);
            
            callback(shapeDataObj);


            //- user following logic to disable shape fields in order to restrict shape edit 

            // var idsArray = [];
            // idsArray.push(shape._id);
            // NavigationService.apiCall('Mshape/restrictShapeVariable', {idsArray: idsArray}, function(data){
            //     shapeDataObj.saveBtn = false;
            //     shapeDataObj.editBtn = true;
            //     // if(!_.isEmpty(data.data)){
            //     //     shapeDataObj.disableField = true;
            //     // }
            //     // else {
            //     //     shapeDataObj.disableField = false;
            //     // }
            //     _.map(tempArray, function (n) {
            //         if (_.findIndex(shape.variable, ['varName', n.varName]) == -1) {
            //             n.checkboxStatus = false;
            //         } else {
            //             n.checkboxStatus = true;
            //         }
            //     });
            //     shapeDataObj.shapeVariables = _.chunk(tempArray, 3);
            //     callback(shapeDataObj);

            // });
        }

    }
    this.createOrEditShape = function (shape, callback) {
        NavigationService.apiCall('MShape/save', shape, function (data) {
            callback(data);
        });
    }
    this.deleteShape = function (shapeId, callback) {
        idsArray = [];
        idsArray.push(shapeId);
        NavigationService.delete('Web/delRestrictions/MShape', {idsArray: idsArray}, function (data) {
            callback(data);
        });
    }

});