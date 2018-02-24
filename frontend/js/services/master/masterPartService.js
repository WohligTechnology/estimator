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

        NavigationService.apiCall('MPartTypeCat/delRestrictionOfMPartTypeCat', deletePTCatObj, function (data) {
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
        var idsArray = [];
        idsArray.push(partTypeId);
        NavigationService.apiCall('Web/delRestrictions/MPartType', {idsArray: idsArray}, function (data) {
            callback(data);
        });
    }


    this.addNewPreset = function (operation, partTypeId, callback) {        
        var obj = {
            _id: partTypeId
        }
        var partTypeObj = {
            partType: partTypeId
        }
        var presetData = {}

        if (operation == "save") {
            presetData.saveBtn = true;
            presetData.editBtn = false;
        } else if (operation == "update") {
            presetData.saveBtn = false;
            presetData.editBtn = true;
        }


        NavigationService.apiCall('MPartPresets/getPresetSizes', partTypeObj, function (data) {
            if (data.data.length == 0) {
                presetData.selectedShape = null;
                NavigationService.boxCall('MShape/getMShapeData', function (sapeData) {
                    presetData.shapeData = sapeData.data;
                    NavigationService.apiCall('MPartType/getOne', obj, function (partTypeData) {
                        presetData.partTypeData = partTypeData.data;
                        callback(presetData);
                    });
                });
            } else {
                presetData.selectedShape  = data.data[0].shape;
                //- to get uom of variables
                presetData.selectedShape.variable = data.data[0].variable;
                presetData.thickness = presetData.selectedShape.thickness;
                presetData.length = presetData.selectedShape.length;
                presetData.wastage = presetData.selectedShape.wastage;
                presetData.formFactor = presetData.selectedShape.formFactor;
                presetData.sizeFactor = presetData.selectedShape.sizeFactor;
                if (presetData.selectedShape.image) {
                    presetData.image = presetData.selectedShape.image.file;
                }
                NavigationService.boxCall('MShape/getMShapeData', function (sapeData) {
                    presetData.shapeData = sapeData.data;
                    NavigationService.apiCall('MPartType/getOne', obj, function (partTypeData) {
                        presetData.partTypeData = partTypeData.data;
                        callback(presetData);
                    });
                });
            }
        });

        // get shape data
        // get part type data
        // NavigationService.boxCall('MShape/search', function (sapeData) {
        //     presetData.shapeData = sapeData.data.results;
        //     NavigationService.apiCall('MPartType/getOne', obj, function (partTypeData) {
        //         presetData.partTypeData = partTypeData.data;
        //         callback(presetData);
        //     });
        // });

    }
    this.getPartTypeSizes = function (partTypeId, callback) {
        var partTypeObj = {
            partType: partTypeId
        }
        var partTypeDataObj = {
            materialArray: []
        };

        NavigationService.apiCall('MPartPresets/getPresetSizes', partTypeObj, function (data) {
            if (data.data) {
                partTypeDataObj.partSizes = data.data;
            }

            NavigationService.apiCall('MPartType/getOne', {
                _id: partTypeId
            }, function (matData) {
                partTypeDataObj.materials = matData.data.material;
                angular.forEach(partTypeDataObj.materials,  function (record) {
                    partTypeDataObj.materialArray.push(record._id);
                });
                callback(partTypeDataObj);
            });
        });

    }
    this.getPresetViewWithData = function (operation, presetData, callback) {
        var partPresetObj = {
            presetData: {}
        };

        if (operation == "save") {
            partPresetObj.saveBtn = true;
            partPresetObj.editBtn = false;
            partPresetObj.presetData.partType = presetData;
        } else if (operation == "update") {
            if (angular.isDefined(presetData)) {
                partPresetObj.presetData = presetData;
                partPresetObj.presetData.partTypeData = {};
                partPresetObj.presetData.partTypeData.partTypeCode = presetData.partType.partTypeCode;
                partPresetObj.presetData.partTypeData.partTypeId = presetData.partType._id;
                // partPresetObj.presetData.partTypeCode = presetData.partType.partTypeCode;
                // partPresetObj.presetData.partType = presetData.partType._id;
            }
            partPresetObj.saveBtn = false;
            partPresetObj.editBtn = true;
        }

        NavigationService.boxCall('MShape/getMShapeData', function (data) {
            var tempArray = [];
            if (data.value) {
                tempArray = data.data;
            }
            partPresetObj.presetData.shapeData = tempArray;
            callback(partPresetObj);
        });

    }
    this.addOrEditPartPreset = function (presetData, action, callback) {

        if (action == "saveAsNew") {
            // _.findKey(presetData,   ['_id', '__v', 'createdAt', 'updatedAt', '$$hashKey']);
            delete presetData._id;
            delete presetData.__v;
            delete presetData.createdAt;
            delete presetData.updatedAt;
            delete presetData.$$hashKey;
        }

        presetData.partType = presetData.partTypeData._id;
        NavigationService.apiCall('MPartPresets/save', presetData, function (data) {
            callback(data);
        });
    }

    this.getMaterialData = function (selectedMaterial, callback) {
        var getMatData = {};
        NavigationService.boxCall('MMaterial/getAllMaterials', function (data) {
            getMatData.materials = data.data;
            angular.forEach(selectedMaterial,  function (materiaId) {
                _.remove(getMatData.materials, function (record) {
                    return record._id == materiaId;
                });
            });
            callback(getMatData);
        });
    }
    this.addMaterialToPartType = function (selectedMatId, partTypeId, callback) {
        var tempObj = {
            materialId: selectedMatId,
            _id: partTypeId
        }

        NavigationService.apiCall('MPartType/addPartTypeMaterial', tempObj, function (data) {
            callback(data);
        });
    }
    this.deletePartTypeMaterial = function (materialId, partTypeId, callback) {
        var tempObj = {
            _id: partTypeId,
            material: materialId
        }
        NavigationService.apiCall('MPartType/deletePartTypeMaterial', tempObj, function (data) {
            callback(data);
        });
    }

});