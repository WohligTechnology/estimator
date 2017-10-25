myApp.service('masterPartService', function (NavigationService) {

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


    this.addNewPreset = function(operation, partTypeId, callback){
        var obj = {
            _id:partTypeId
        }
        var presetData = {}
        // get shape data
        // get part type data
        NavigationService.boxCall('MShape/search', function (sapeData) {
            presetData.shapeData = sapeData.data.results;
            NavigationService.apiCall('MPartType/getOne', obj, function (partTypeData) {
                presetData.partTypeData = partTypeData.data;
                callback(presetData);
            });

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
        // console.log('**** inside getPresetViewWithData of masterPartService.js ****');
        var partPresetObj = {
            presetData:{}
        };

        if (operation == "save") {
            partPresetObj.saveBtn = true;
            partPresetObj.editBtn = false;
            partPresetObj.presetData.partType = presetData;
        } else if (operation == "update") {
            if (angular.isDefined(presetData)) {
                partPresetObj.presetData = presetData;
                partPresetObj.presetData.partTypeCode = presetData.partType.partTypeCode;
                partPresetObj.presetData.partType = presetData.partType._id;
            }
            partPresetObj.saveBtn = false;
            partPresetObj.editBtn = true;
        }

        NavigationService.boxCall('MShape/search', function (data) {
            partPresetObj.shapeData = data.data.results;
            callback(partPresetObj);
        });
        
    }
    this.addOrEditPartPreset = function (presetData) {
        NavigationService.apiCall('MPartPresets/save', presetData, function (data) {
            callback(data);
        });
    }

});