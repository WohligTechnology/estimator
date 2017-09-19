myApp.service('baseMatserService', function ($http, NavigationService) {

    this.getUomData = function (callback) {
        NavigationService.boxCall('MUom/search', function (data) {
            var uoms = data.data.results;
            console.log('**** inside getUomData of baseMatserService.js ****', uoms);
            callback(uoms);
        });
    }

    this.getVariableData = function (callback) {
        NavigationService.boxCall('MVariables/search', function (data) {
            var variables = data.data.results;
            console.log('**** inside getVariableData of baseMatserService.js ****', variables);
            callback(variables);
        });
    }

    this.getDfData = function (callback) {
        NavigationService.boxCall('MDifficultyFactor/search', function (data) {
            var dfs = data.data.results;
            console.log('**** inside getDfData of baseMatserService.js ****', dfs);
            callback(dfs);
        });
    }

    this.getMarkupData = function (callback) {
        NavigationService.boxCall('MMarkup/search', function (data) {
            var markups = data.data.results;
            console.log('**** inside getMarkupData of baseMatserService.js ****', markups);
            callback(markups);
        });
    }


    this.getUomModalData = function (operation, uom, callback) {
        var uomDataObj = {};
        if (angular.isDefined(uom)) {
            uomDataObj.uom = uom;
        }
        if (operation == "save") {
            uomDataObj.saveBtn = true;
            uomDataObj.editBtn = false;
        } else if (operation == "update") {
            uomDataObj.saveBtn = false;
            uomDataObj.editBtn = true;
        }
        callback(uomDataObj);
    }






    this.addOrEditUom = function (uomData, callback) {
        console.log('**** inside addOrEditUom of baseMatserService.js ****', uomData);
        NavigationService.apiCall('MUom/save', uomData, function (data) {
            callback(data);
        });

    }


});