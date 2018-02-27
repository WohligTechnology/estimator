myApp.service('masterMaterialService', function (NavigationService) {

    var bulkArray = []; //- get master material view
    this.getMaterialView = function (callback) {
        callback();
    }

    //- get master material tree structure data
    this.getMaterialData = function (callback) {
        NavigationService.boxCall('MMaterialCat/getMaterialStructure', function (data) {
            callback(data.data);
        });
    }

    this.getMaterialCatModalData = function (operation, materialCat, callback) {
        var materialCatObj = {};
        if (angular.isDefined(materialCat)) {
            materialCatObj.materialCat = materialCat;
        }
        if (operation == "save") {
            materialCatObj.saveBtn = true;
            materialCatObj.editBtn = false;
        } else if (operation == "update") {
            materialCatObj.saveBtn = false;
            materialCatObj.editBtn = true;
        }
        callback(materialCatObj);
    }
    this.addOrEditMaterialCat = function (materialCatData, callback) {
        NavigationService.apiCall('MMaterialCat/save', materialCatData, function (data) {
            callback(data);
        });
    }
    this.deleteMaterialCat = function (materialCatId, callback) {
        idsArray = [];
        idsArray.push(materialCatId);
        NavigationService.apiCall('MMaterialCat/delRestrictionMaterialCat', {
            _id: materialCatId
        }, function (data) {
            callback(data);
        });
    }

    this.getMaterialSubCatModalData = function (operation, materialCatId, materialSubCat, callback) {
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
    this.addOrEditMaterialSubCat = function (materialSubCatData, materialCatId, callback) {
        if (angular.isDefined(materialCatId)) {
            materialSubCatData.catId = materialCatId;
        }
        NavigationService.apiCall('MMaterialSubCat/save', materialSubCatData, function (data) {
            callback(data);
        });
    }
    this.deleteMaterialSubCat = function (materialSubCatId, callback) {
        idsArray = [];
        idsArray.push(materialSubCatId);
        NavigationService.apiCall('MMaterialSubCat/delRestrictionMMaterialSubCat', {
            _id: materialSubCatId
        }, function (data) {
            callback(data);
        });
    }

    this.getMaterialModalData = function (operation, materialSubCatId, material, callback) {
        var materialObj = {};
        if (angular.isDefined(material)) {
            materialObj.material = material;
        }
        if (operation == "save") {
            materialObj.saveBtn = true;
            materialObj.editBtn = false;
        } else if (operation == "update") {
            materialObj.saveBtn = false;
            materialObj.editBtn = true;
        }
        materialObj.materialSubCategory = materialSubCatId;
        callback(materialObj);
    }
    this.addOrEditMaterial = function (materialData, materialSubCatId, callback) {
        if (angular.isDefined(materialSubCatId)) {
            materialData.materialSubCategory = materialSubCatId;
        }
        NavigationService.apiCall('MMaterial/save', materialData, function (data) {
            callback(data);
        });
    }

    this.getSubCatMaterials = function (materialSubCatId, callback) {
        var matSubCatObj = {
            subCatId: materialSubCatId
        };
        NavigationService.apiCall('MMaterial/getSubCatMaterials', matSubCatObj, function (data) {
            callback(data.data);
        });
    }

    this.changeMaterialType = function (type, materialSubCatId, callback) {
        matDataObj = {
            matSubCatId: materialSubCatId,
            type: type
        };
        // NavigationService.apiCall('MMaterial/save', matDataObj, function (data) {
        //     callback(data);
        // });
        NavigationService.apiCall('MMaterial/updateAllSubCatMatType', matDataObj, function (data) {
            callback(data);
        });
    }
    //- get pagination data
    this.getPaginationData = function (pageNumber, count, searchKeyword, callback) {
        NavigationService.apiCall('MMaterial/search', {
            keyword: searchKeyword,
            totalRecords: count,
            page: pageNumber
        }, function (data) {
            callback(data.data);
        });
    }
    //- get details about pagination
    this.getPaginationDetails = function (pageNumber, count, data, callback) {
        var obj = {};
        obj.pageNumber = pageNumber;
        obj.pageStart = (pageNumber - 1) * count + 1;
        obj.total = data.total;
        if (obj.total <= pageNumber * count) {
            obj.pageEnd = obj.total;
        } else {
            obj.pageEnd = pageNumber * count;
        }
        obj.numberOfPages = Math.ceil((obj.total) / count);
        obj.pagesArray = [];
        for (var i = 0; i < obj.numberOfPages; i++) {
            obj.pagesArray[i] = i + 1;
        }
        obj.count = data.options.count;
        callback(obj);
    }
    //   //- form an array of bulk Ids
    this.selectBulkMaterials = function (checkboxStatus, materialId, callback) {
        if (checkboxStatus == true) {
            bulkArray.push(materialId);
        } else {
            _.remove(bulkArray, function (record) {
                return record == materialId;
            });
        }
        callback(bulkArray);
    }
    //   //- form an array of Ids of all materials for deletion
    this.selectAll = function (materials, checkboxStatus, callback) {
        bulkArray = [];
        if (checkboxStatus == true) {
            angular.forEach(materials,  function (obj) {
                var materialId = obj._id;
                bulkArray.push(materialId);
            });
        }
        callback(bulkArray);
    }
    //   //- delete bulk materials
    this.deleteBulkMaterials = function (materials, callback, type) {
        var tempObj = {};
        if (type == 'singleMaterial') {
            tempObj.idsArray = [];
            tempObj.idsArray.push(materials);
        } else {
            tempObj.idsArray = materials;
        }
        NavigationService.apiCall('MMaterial/delRestrictionsOfMaterial', tempObj, function (data) {
            callback(data);
        });
    }
    this.duplicateMaterial = function (materialData, callback) {
        materialData = _.omit(materialData, ['_id', '__v', 'createdAt', 'updatedAt']);
        callback(materialData);
    }
});