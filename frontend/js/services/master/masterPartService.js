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

    
    this.getPartTypeModalData = function (operation, materialCatId, materialSubCat, callback) {
        var materialSubCatObj = {};
        if (angular.isDefined(materialSubCat)) {
            materialSubCatObj.materialSubCat = materialSubCat;
        }
        if (operation == "save") {
            materialSubCatObj.saveBtn = true;
            materialSubCatObj.editBtn = false;
            materialSubCatObj.catId = materialCatId;
        } else if (operation == "update") {
            materialSubCatObj.saveBtn = false;
            materialSubCatObj.editBtn = true;
        }
        callback(materialSubCatObj);
    }
    this.addOrEditPartType = function (materialSubCatData, materialCatId, callback) {
        if (angular.isDefined(materialCatId)) {
            materialSubCatData.catId = materialCatId;
        }
        NavigationService.apiCall('MMaterialSubCat/save', materialSubCatData, function (data) {
            callback(data);
        });
    }
    this.deletePartType = function (materialSubCatId, callback) {
        var deleteMatCat = {
            _id: materialSubCatId
        };

        NavigationService.apiCall('MMaterialSubCat/delete', deleteMatCat, function (data) {
            callback(data);
        });
    }


});