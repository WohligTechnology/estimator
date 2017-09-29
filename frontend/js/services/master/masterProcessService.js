myApp.service('masterProcessService', function ($http, $uibModal, NavigationService) {

  //- get master process view
  this.getProcessData = function (callback) {
    NavigationService.boxCall('MProcessType/search', function (data) {
      callback(data.data.results);
    });
  }


  this.getProcessModalData = function (operation, process, callback) {
    var processDataObj = {};
    if (angular.isDefined(process)) {
      processDataObj.process = process;
    }
    if (operation == "save") {
      processDataObj.saveBtn = true;
      processDataObj.editBtn = false;
    } else if (operation == "update") {
      processDataObj.saveBtn = false;
      processDataObj.editBtn = true;
    }
    callback(processDataObj);
  }

  this.addOrEditProcess = function (processData, callback) {
    NavigationService.apiCall('MProcessType/save', processData, function (data) {
      var process = data.data.results;
      callback(process);
    });
  }

  this.deleteProcess = function (processId, callback) {
    var deleteProcessObj = {
      _id: processId
    };
    NavigationService.delete('MProcessType/delete', deleteProcessObj, function (data) {
      callback(data);
    });
  }
//tree

 this.getProcessCatModalData = function (operation, processCat, callback) {
        var processCatObj = {};
        if (angular.isDefined(processCat)) {
           processCatObj.processCat = processCat;
        }
        if (operation == "save") {
           processCatObj.saveBtn = true;
           processCatObj.editBtn = false;
        } else if (operation == "update") {
          processCatObj.saveBtn = false;
            processCatObj.editBtn = true;
        }
        callback(processCatObj);
    }

 this.addOrEditProcessCat = function (processCatData, callback) {
        NavigationService.apiCall('MProcessCat/save', materialCatData, function (data) {
            callback(data);
        });
    }


});