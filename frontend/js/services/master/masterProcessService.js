myApp.service('masterProcessService', function (NavigationService) {

  //- to get master process tree structure data
  this.getProcessData = function (callback) {

    NavigationService.boxCall('MProcessCat/getMProcessCatData', function (data) {
      callback(data.data);
    });
  }

  //- to get process type data
  this.getProcessTypeData = function (callback) {
    NavigationService.boxCall('MProcessType/getAllProcessType', function (data) {
      callback(data.data);
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

      NavigationService.boxCall('MUom/getMUomData', function (data) {
        processCatObj.uoms = data.data;
        callback(processCatObj);
      });

    } else if (operation == "update") {
      processCatObj.saveBtn = false;
      processCatObj.editBtn = true;

      NavigationService.boxCall('MUom/getMUomData', function (data) {
        processCatObj.uoms = data.data;
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
    NavigationService.apiCall('MProcessCat/delRestrictionsMProcessCat', {
      _id: processCatId
    }, function (data) {
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
    NavigationService.apiCall('MProcessItem/delRestrictionMProcessItem', {
      _id: processItemId
    }, function (data) {
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

      NavigationService.boxCall('MProcessCat/getMProcessCatData', function (data) {
        processDataObj.processCats = data.data;

        NavigationService.boxCall('MUom/getMUomData', function (data) {
          processDataObj.uoms = data.data;
          callback(processDataObj);
        });

      });

    } else if (operation == "update") {
      processDataObj.saveBtn = false;
      processDataObj.editBtn = true;

      NavigationService.boxCall('MProcessCat/getMProcessCatData', function (data) {
        processDataObj.processCats = data.data;

        NavigationService.boxCall('MUom/getMUomData', function (data) {
          processDataObj.uoms = data.data;
          callback(processDataObj);
        });

      });

    }
  }
  this.addOrEditProcessType = function (processData, callback) {
    NavigationService.apiCall('MProcessType/save', processData, function (data) {
      callback(data);
    });
  }
  this.deleteProcessType = function (processId, callback) {
    idsArray = [];
    idsArray.push(processId);
    NavigationService.delete('Web/delRestrictions/MProcessType', {
      idsArray: idsArray
    }, function (data) {
      callback(data);
    });
  }
  this.validationOfProcessType = function (processData, selectedProcessCatId, selectedRateMUlFactUom, selectedQuaLinkedKeyUom, selectedQuaFinalUom, callback) {
    //-  Validation of select in process Type
    var validationSelect = {
      errorCount: 0
    }
    if ((processData.showRateFields) == true) {
      if (_.isEmpty(selectedProcessCatId)) {
        validationSelect.processCategory = "Select Process Catergory."
        validationSelect.errorCount++;
      } else {
        validationSelect.processCategory = ""
      }
      if (_.isEmpty(selectedProcessCatId)) {
        validationSelect.processCatValidation = " Process Category field is required."
        validationSelect.errorCount++;
      } else {
        validationSelect.processCatValidation = " "
      }
      if (_.isEmpty(processData.rate.mulFact)) {
        validationSelect.rateMultiplicationFactor = "Multiplication Factor field is required."
        validationSelect.errorCount++;
      } else {
        validationSelect.rateMultiplicationFactor = " "
      }
    }
    if (_.isEmpty(processData.rate.uom)) {
      validationSelect.rateUom = "Select UOM"
      validationSelect.errorCount++;
    } else {
      validationSelect.rateUom = ""
    }
    if (_.isEmpty(processData.quantity.uom)) {
      validationSelect.quantityUom = "Select UOM"
      validationSelect.errorCount++;
    } else {
      validationSelect.quantityUom = ""
    }
    if ((processData.showQuantityFields) == true) {
      if (_.isEmpty(processData.quantity.linkedKeyValue)) {
        validationSelect.linkedkeyValue = "Select LinkedKey Value."
        validationSelect.errorCount++;
      } else {
        validationSelect.linkedkeyValue = " "
      }
      if (_.isEmpty(processData.quantity.mulfact)) {
        validationSelect.quantityMultiplicationFactor = "Multiplication Factor field is required."
        validationSelect.errorCount++;
      } else {
        validationSelect.quantityMultiplicationFactor = " "
      }
      if (isNaN(parseFloat(processData.quantity.utilization))) {
        validationSelect.quantityUtilization = "Utilization field is required."
        validationSelect.errorCount++;
      } else {
        validationSelect.quantityUtilization = " "
      }
      if (isNaN(parseFloat(processData.quantity.contengncyOrWastage))) {
        validationSelect.quantityWastage = "Contegency or Wastage field is required."
        validationSelect.errorCount++;
      } else {
        validationSelect.quantityWastage = " "
      }

    } else {
      validationSelect.linkedkeyValue = " "
    }
    if (_.isEmpty(processData.quantity.finalUom)) {
      validationSelect.finalUom = "Select FinalUOM"
      validationSelect.errorCount++
    } else {
      validationSelect.finalUom = ""
    }
    callback(validationSelect);
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
    NavigationService.apiCall('Web/delRestrictions/MProcessType', {
      idsArray: processes
    }, function (data) {
      callback(data);
    });
  }

});