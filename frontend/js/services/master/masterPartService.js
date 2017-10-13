myApp.service('masterPartService', function (NavigationService) {

    this.getPartData = function (callback) {
        var partData = [{
            "name": "partCat 1",
            "partType": [{
                "name": "Part Type 1",
            }, ]
        }, {
            "name": "partCat 2",
            "partType": [{
                "name": "Part Type 1",
            }, {
                "name": "Part Type 2"
            }, {
                "name": "Part Type 3"
            }]
        }, {
            "name": "partCat 3",
            "partType": [{
                "name": "Part Type 1"
            }]
        }];

        NavigationService.boxCall('MPartTypeCat/search', function (data) {
            callback(data.data.results);
        });

        // callback(partData);
    }

    this.getPartTypeCatModalData = function (operation, partTypeCat, callback) {
        var partTypeCatObj = {};
        if (angular.isDefined(partTypeCat)) {
            partTypeCatObj.partTypeCat = partTypeCat;
        }
        if (operation == "save") {
            partTypeCatObj.saveBtn = true;
            partTypeCatObj.editBtn = false;
        } else if (operation == "update") {
            partTypeCatObj.saveBtn = false;
            partTypeCatObj.editBtn = true;
        }
        callback(partTypeCatObj);
    }
    this.addOrEditPartTypeCat = function (partTypeCatData, callback) {
        NavigationService.apiCall('MPartTypeCat/save', partTypeCatData, function (data) {
            callback(data);
        });
    }
    this.deletePartTypeCat = function (partTypeCatId, callback) {
        var deletePTCatObj = {
            _id: partTypeCatId
        };

        NavigationService.apiCall('MPartTypeCat/delete', deletePTCatObj, function (data) {
            callback(data);
        });
    }


    this.getPartTypeModalData = function (operation, partTypeCatId, partType, callback) {
        var partTypeObj = {};
        if (angular.isDefined(partType)) {
            partTypeObj.partType = partType;
        }
        if (operation == "save") {
            partTypeObj.saveBtn = true;
            partTypeObj.editBtn = false;
            partTypeObj.partTypeCatId = partTypeCatId;
        } else if (operation == "update") {
            partTypeObj.saveBtn = false;
            partTypeObj.editBtn = true;
        }
        callback(partTypeObj);
    }
    this.addOrEditPartType = function (partTypeData, partTypeId, callback) {
        if (angular.isDefined(partTypeId)) {
            partTypeData.partTypeCat = partTypeId;
        }
        NavigationService.apiCall('MPartType/save', partTypeData, function (data) {
            callback(data);
        });
    }
    this.deletePartType = function (partTypeId, callback) {
        var deleteMatCat = {
            _id: partTypeId
        };

        NavigationService.apiCall('MpartType/delete', deleteMatCat, function (data) {
            callback(data);
        });
    }


    this.getPartTypeSizes = function (partTypeId, callback) {
        var partTypeObj = {
            partType: partTypeId
        }

        NavigationService.apiCall('MPartPresets/getPresetSizes', partTypeObj, function (data) {
            callback(data.data);
        });
    }

    this.getPresetViewWithData = function (operation, presetData, callback) {
        console.log('**** inside getPresetViewWithData of masterPartService.js ****');
        var partPresetObj = {};
        if (angular.isDefined(presetData)) {
            partPresetObj.presetData = presetData;
        }
        if (operation == "save") {
            partPresetObj.saveBtn = true;
            partPresetObj.editBtn = false;
        } else if (operation == "update") {
            partPresetObj.saveBtn = false;
            partPresetObj.editBtn = true;
        }

        NavigationService.boxCall('MShape/search', function (data) {

            partPresetObj.shapeData = data.data.results;
            // var finalShapeData = [];
            // var obj = {};

            // _.map(partPresetObj.shapeData.variable, function(n){
            //     obj.variableName = n.variableName;
            //     obj._id = n._id;
            //     obj.variableValue = 0;
            //     finalShapeData.push(obj);
            // });
            
            // partPresetObj.shapeData.variable = [];
            // partPresetObj.shapeData.variable = finalShapeData;
            callback(partPresetObj);
        });       
    }

});