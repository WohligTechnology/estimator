myApp.service('baseMatserService', function ($http, NavigationService) {

    this.getUomData = function (callback) {
        NavigationService.boxCall('MUom/search', function (data) {
            var uoms = data.data.results;
            callback(uoms);
        });
    }
    this.getVariableData = function (callback) {
        NavigationService.boxCall('MVariables/search', function (data) {
            var variables = data.data.results;
            callback(variables);
        });
    }
    this.getDfData = function (callback) {
        NavigationService.boxCall('MDifficultyFactor/search', function (data) {
            var dfs = data.data.results;
            callback(dfs);
        });
    }
    this.getMarkupData = function (callback) {
        NavigationService.boxCall('MMarkup/search', function (data) {
            var markups = data.data.results;
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
        NavigationService.apiCall('MUom/save', uomData, function (data) {
            callback(data);
        });

    }
    this.deleteUom = function(uomId,callback){
        var deleteUomObj = {
            _id:uomId
        };
        NavigationService.delete('MUom/delete',deleteUomObj, function(data){
            callback(data);
        });
    }

    this.getVariableModalData = function (operation, variable, callback) {
        var variableDataObj = {};
        if (angular.isDefined(variable)) {
            variableDataObj.variable = variable;
        }
        if (operation == "save") {
            variableDataObj.saveBtn = true;
            variableDataObj.editBtn = false;
        } else if (operation == "update") {
            variableDataObj.saveBtn = false;
            variableDataObj.editBtn = true;
        }
        callback(variableDataObj);
    }
    this.addOrEditVariable = function (variableData, callback) {
        NavigationService.apiCall('MVariables/save', variableData, function (data) {
            callback(data);
        });
    }
    this.deleteVariable = function(variableId,callback){
        var deleteVariableObj = {
            _id:variableId
        };
        NavigationService.delete('MVariables/delete',deleteVariableObj, function(data){
            callback(data);
        });
    }

    this.getDfModalData = function (operation, df, callback) {
        var dfDataObj = {};
        if (angular.isDefined(df)) {
            dfDataObj.df = df;
        }
        if (operation == "save") {
            dfDataObj.saveBtn = true;
            dfDataObj.editBtn = false;
        } else if (operation == "update") {
            dfDataObj.saveBtn = false;
            dfDataObj.editBtn = true;
        }
        callback(dfDataObj);
    }
    this.addOrEditDf= function (dfData, callback) {
        NavigationService.apiCall('MDifficultyFactor/save', dfData, function (data) {
            callback(data);
        });

    }
    this.deleteDf = function(dfId,callback){
        var deleteDfObj = {
            _id:dfId
        };
        NavigationService.delete('MDifficultyFactor/delete',deleteDfObj, function(data){
            callback(data);
        });
    }

    this.getMarkupModalData = function (operation, markup, callback) {
        var markupDataObj = {};
        if (angular.isDefined(markup)) {
            markupDataObj.markup = markup;
        }
        if (operation == "save") {
            markupDataObj.saveBtn = true;
            markupDataObj.editBtn = false;
        } else if (operation == "update") {
            markupDataObj.saveBtn = false;
            markupDataObj.editBtn = true;
        }
        callback(markupDataObj);
    }
    this.addOrEditMarkup = function (markupData, callback) {
        NavigationService.apiCall('MMarkup/save', markupData, function (data) {
            callback(data);
        });

    }
    this.deleteMarkup = function(markupId,callback){
        var deleteMarkupObj = {
            _id:markupId
        };
        NavigationService.delete('MMarkup/delete',deleteMarkupObj, function(data){
            callback(data);
        });
    }
});