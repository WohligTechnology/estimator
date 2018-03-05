myApp.service('masterAddonService', function (NavigationService) {

  var bulkArray = [];

  //- get master addon view
  this.getAddonData = function (callback) {
    NavigationService.boxCall('MAddonType/search', function (data) {
      callback(data.data);
    });
  }
  //- to get validation status
  this.getValidationStatus = function (addonType, callback) {
    var validationObj = {
      errorCount: 0
    };
    if (_.isEmpty(addonType.addonTypeName)) {
      validationObj.addonName = "Addon Type Name field is required."
      validationObj.errorCount++;
    } else {
      validationObj.addonName = "";
    }
    if (_.isEmpty(addonType.rate.uom)) {
      validationObj.rateUom = "Select UOM";
      validationObj.errorCount++;
    } else {
      validationObj.rateUom = "";
    }
    if (_.isEmpty(addonType.quantity.linkedKeyUom)) {
      validationObj.linkedKeyUom = "Select UOM";
      validationObj.errorCount++;
    } else {
      validationObj.linkedKeyUom = "";
    }
    if (addonType.showRateFields == true) {
      if (_.isEmpty(addonType.materialCat)) {
        validationObj.materialCat = "Multiplication Factor field is required.";
        validationObj.errorCount++;
      } else {
        validationObj.materialCat = "";
      }
      if (_.isEmpty(addonType.materialSubCat)) {
        validationObj.materialSubCat = " Process Category field is required.";
        validationObj.errorCount++;
      } else {
        validationObj.materialSubCat = " ";
      }
      if (_.isEmpty(addonType.rate.mulFact)) {
        validationObj.rateMulfact = "Multiplication Factor field is required.";
        validationObj.errorCount++;
      } else {
        validationObj.rateMulfact = " ";
      }
    }
    if (addonType.showQuantityFields == true) {
      if (_.isEmpty(addonType.quantity.additionalInput)) {
        validationObj.additionalInput = "Additional Input field is required."
        validationObj.errorCount++;
      } else {
        validationObj.additionalInput = " ";
      }
      if (_.isEmpty(addonType.quantity.additionalInputUom)) {
        validationObj.additionalInputUom = "Additional Input UOM field is required."
        validationObj.errorCount++;
      } else {
        validationObj.additionalInputUom = " ";
      }
      if (_.isEmpty(addonType.quantity.linkedKey)) {
        validationObj.linkedKey = "Select LinkedKey Value."
        validationObj.errorCount++;
      } else {
        validationObj.linkedKey = " ";
      }
      if (_.isEmpty(addonType.quantity.mulFact)) {
        validationObj.quantityMulFact = "Multiplication Factor field is required."
        validationObj.errorCount++;
      } else {
        validationObj.quantityMulFact = " ";
      }
      if (isNaN(parseFloat(addonType.quantity.percentageUse))) {
        validationObj.quantityUtilization = "Utilization field is required."
        validationObj.errorCount++;
      } else {
        validationObj.quantityUtilization = " ";
      }
    }
    callback(validationObj);
  }
  //- get addon modal data
  this.getAddonTypeModalData = function (operation, addonType, callback) {
    // get material cat data
    // get uom data
    var addonTempObj = {};
    if (angular.isDefined(addonType)) {
      addonTempObj.addonTypeData = addonType;
    }

    if (operation == "save") {
      addonTempObj.saveBtn = true;
      addonTempObj.editBtn = false;
    } else if (operation == "update") {
      addonTempObj.saveBtn = false;
      addonTempObj.editBtn = true;
    }

    NavigationService.boxCall('MMaterialCat/getMaterialStructure', function (mMatData) {
      NavigationService.boxCall('MUom/getMUomData', function (mUomData) {
        addonTempObj.mMatData = mMatData.data;
        addonTempObj.mUomData = mUomData.data;
        callback(addonTempObj);
      });
    });
  }
  //- add or edit addon
  this.addOrEditAddonType = function (addonData, callback) {
    NavigationService.apiCall('MAddonType/save', addonData, function (data) {
      callback(data);
    });
  }
  //- delete addon
  this.deleteAddonType = function (addonId, callback) {
    idsArray = [];
    idsArray.push(addonId);
    NavigationService.apiCall('Web/delRestrictions/MAddonType', {
      idsArray: idsArray
    }, function (data) {
      callback(data);
    });
  }
  //- get pagination data
  this.getPaginationData = function (pageNumber, count, searchKeyword, callback) {
    NavigationService.apiCall('MAddonType/search', {
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
  this.selectBulkAddons = function (checkboxStatus, addonId, callback) {
    if (checkboxStatus == true) {
      bulkArray.push(addonId);
    } else {
      _.remove(bulkArray, function (record) {
        return record == addonId;
      });
    }
    callback(bulkArray);
  }
  //- form an array of Ids of all addons for deletion
  this.selectAll = function (addons, checkboxStatus, callback) {
    bulkArray = [];
    if (checkboxStatus == true) {
      angular.forEach(addons,  function (obj) {
        var addonId = obj._id;
        bulkArray.push(addonId);
      });
    } else {
      bulkArray = [];
    }
    callback(bulkArray);
  }
  //- delete bulk addons
  this.deleteBulkAddons = function (addons, callback) {
    NavigationService.apiCall('Web/delRestrictions/MAddonType', {
      idsArray: addons
    }, function (data) {
      callback(data);
    });
  }
});