myApp.service('masterProcessService', function ($http, $uibModal, NavigationService) {

  //- to get master process tree structure data
  this.getProcessData = function (callback) {

    NavigationService.boxCall('MProcessCat/search', function (data) {
      console.log('kdshsbfvld;j');
      callback(data.data.results);
    });
  }

  //- to get process type data
  this.getProcessTypeData = function (callback) {
    NavigationService.boxCall('MProcessType/getAllProcessType', function (data) {
      callback(data.data.results);
    });
  }

  this.getProcessCatModalData = function (operation, processCat, callback) {
    var processCatObj = {};
    if (angular.isDefined(processCat)) {
      processCatObj.processCat = processCat;
    }

    if (operation == "save") {
      processCatObj.saveBtn = true;
      processCatObj.editBtn = false;

      NavigationService.boxCall('MUom/search', function (data) {
        processCatObj.uoms = data.data.results;
        callback(processCatObj);
      });

    } else if (operation == "update") {
      processCatObj.saveBtn = false;
      processCatObj.editBtn = true;

      NavigationService.boxCall('MUom/search', function (data) {
        processCatObj.uoms = data.data.results;
        callback(processCatObj);
      });
    }
  }
  this.addOrEditProcessCat = function (processCatData, callback) {
    NavigationService.apiCall('MProcessCat/save', processCatData, function (data) {
      callback(data);
    });
  }
  this.deleteProcessCat = function (processCatId, callback) {
    var deleteProCat = {
      _id: processCatId
    };

    NavigationService.apiCall('MProcessCat/delete', deleteProCat, function (data) {
      callback(data);
    });
  }

  this.getProcessItemModalData = function (operation, processCatId, processItem, callback) {
    var processItemObj = {};
    if (angular.isDefined(processItem)) {
      processItemObj.processItem = processItem;
    }
    if (operation == "save") {
      processItemObj.saveBtn = true;
      processItemObj.editBtn = false;
      processItemObj.processCat = processCatId;
    } else if (operation == "update") {
      processItemObj.saveBtn = false;
      processItemObj.editBtn = true;
    }
    callback(processItemObj);
  }
  this.addOrEditProcessItem = function (processItemData, processCatId, callback) {
    if (angular.isDefined(processCatId)) {
      processItemData.processCat = processCatId;
    }
    NavigationService.apiCall('MProcessItem/save', processItemData, function (data) {
      callback(data);
    });
  }
  this.deleteProcessItem = function (processItemId, callback) {
    var deleteProItem = {
      _id: processItemId
    };

    NavigationService.apiCall('MProcessItem/delete', deleteProItem, function (data) {
      callback(data);
    });
  }

  this.getProcessTypeModalData = function (operation, process, callback) {
    var processDataObj = {};
    if (angular.isDefined(process)) {
      processDataObj.process = process;
    }
    if (operation == "save") {
      processDataObj.saveBtn = true;
      processDataObj.editBtn = false;

      NavigationService.boxCall('MProcessCat/search', function (data) {
        processDataObj.processCats = data.data.results;

        NavigationService.boxCall('MUom/search', function (data) {
          processDataObj.uoms = data.data.results;
          callback(processDataObj);
        });

      });

    } else if (operation == "update") {
      processDataObj.saveBtn = false;
      processDataObj.editBtn = true;

      NavigationService.boxCall('MProcessCat/search', function (data) {
        processDataObj.processCats = data.data.results;

        NavigationService.boxCall('MUom/search', function (data) {
          processDataObj.uoms = data.data.results;
          callback(processDataObj);
        });

      });

    }
  }
  this.addOrEditProcessType = function (processData, callback) {
    NavigationService.apiCall('MProcessType/save', processData, function (data) {
      var process = data.data.results;
      callback(process);
    });
  }
  this.deleteProcessType = function (processId, callback) {
    var deleteProcessObj = {
      _id: processId
    };
    NavigationService.delete('MProcessType/delete', deleteProcessObj, function (data) {
      callback(data);
    });
  }

});