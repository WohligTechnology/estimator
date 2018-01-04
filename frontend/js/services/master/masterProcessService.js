myApp.service('masterProcessService', function (NavigationService) {

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
    var idsArray = [];
    idsArray.push(processCatId);

    NavigationService.apiCall('Web/delRestrictions/MProcessCat', {idsArray: idsArray}, function (data) {
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
    idsArray = [];
    idsArray.push(processItemId);

    NavigationService.apiCall('Web/delRestrictions/MProcessItem', {idsArray: idsArray}, function (data) {
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
    idsArray = [];
    idsArray.push(processId);
    NavigationService.delete('Web/delRestrictions/MProcessType', {idsArray: idsArray}, function (data) {
      callback(data);
    });
  }
  //- get pagination data
  this.getPaginationData = function (pageNumber, count, searchKeyword, callback) {
    NavigationService.apiCall('MProcessType/search', {
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

  //- form an array of bulk Ids
  this.selectBulkProcesses = function (checkboxStatus, processId, callback) {
    if (checkboxStatus == true) {
      bulkArray.push(processId);
    } else {
      _.remove(bulkArray, function (record) {
        return record == processId;
      });
    }
    callback(bulkArray);
  }
  //- form an array of Ids of all processes for deletion
  this.selectAll = function (processes, checkboxStatus, callback) {
    bulkArray = [];
    if (checkboxStatus == true) {
      angular.forEach(processes,  function (obj) {
        var processId = obj._id;
        bulkArray.push(processId);
      });
    } 
    callback(bulkArray);
  }
  //- delete bulk processes
  this.deleteBulkProcesses = function (processes, callback) {
    NavigationService.apiCall('Web/delRestrictions/MProcessType', {idsArray: processes}, function (data) {
      callback(data);
    });
  }

});