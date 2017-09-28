myApp.service('masterMaterialService', function ($http, NavigationService) {
    //- get master material view
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
        var deleteMatCat = {
            _id: materialCatId
        };

        NavigationService.apiCall('MMaterialCat/delete', deleteMatCat, function (data) {
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
        var deleteMatCat = {
            _id: materialSubCatId
        };

        NavigationService.apiCall('MMaterialSubCat/delete', deleteMatCat, function (data) {
            callback(data);
        });
    }

    this.getMaterialModalData = function (operation, materialSubCatId, material, callback) {
        console.log('**** inside function_name --------------- of masterMaterialService.js ****',material);
        var materialObj = {};
        if (angular.isDefined(material)) {
            materialObj.material = material;
        }
        if (operation == "save") {
            materialObj.saveBtn = true;
            materialObj.editBtn = false;
            materialObj.materialSubCategory = materialSubCatId;
        } else if (operation == "update") {
            materialObj.saveBtn = false;
            materialObj.editBtn = true;
        }
        callback(materialObj);
    }
    this.addOrEditMaterial = function (materialData,materialSubCatId, callback) {
         if (angular.isDefined(materialSubCatId)) {
            materialData.materialSubCategory = materialSubCatId;
        }
        NavigationService.apiCall('MMaterial/save', materialData, function (data) {
            callback(data);
        });
    }
    this.deleteMaterial = function (materialId, callback) {
        var deleteMat = {
            _id: materialId
        };

        NavigationService.apiCall('MMaterial/delete', deleteMat, function (data) {
            callback(data);
        });
    }

    this.getSubCatMaterials = function(materialSubCatId,callback){
        var matSubCatObj = {
            subCatId:materialSubCatId
        };
        NavigationService.apiCall('MMaterial/getSubCatMaterials', matSubCatObj, function (data) {
            callback(data.data);
        });
    } 

});