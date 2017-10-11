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

});