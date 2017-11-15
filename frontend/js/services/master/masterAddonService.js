myApp.service('masterAddonService', function ($http, NavigationService) {

  var bulkArray = [];

  //- get master addon view
  this.getAddonData = function (callback) {
    NavigationService.boxCall('MAddonType/search', function (data) {
      callback(data.data);
    });
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
      NavigationService.boxCall('MUom/search', function (mUomData) {
        addonTempObj.mMatData = mMatData.data;
        addonTempObj.mUomData = mUomData.data.results;
        callback(addonTempObj);
      });
    });
  }
  //- add or edit addon
  this.addOrEditAddonType = function (addonData, callback) {
    NavigationService.apiCall('MAddonType/save', addonData, function (data) {
      callback(data.data);
    });
  }
  //- delete addon
  this.deleteAddonType = function (addonId, callback) {
    NavigationService.apiCall('MAddonType/delete', {
      _id: addonId
    }, function (data) {
      callback(data);
    });
  }
  //- get data of pagination
  this.getPaginationDatawithoutKeyword = function (pageNumber, callback) {
    NavigationService.apiCall('MAddonType/search', {
      page: pageNumber
    }, function (data) {
      callback(data.data);
    });
  }
  //- get pagination data with search-keyword
  this.getPaginationDataWithKeyword = function (pageNumber, count, searchKeyword, callback) {
    NavigationService.apiCall('MAddonType/search', {
      keyword: searchKeyword,
      totalRecords: count,
      page: pageNumber
    }, function (data) {
      callback(data.data);
    });
  }
  //- get page data with show records
  this.getPageDataWithShowRecords = function (pageNumber, numberOfRecords, callback) {
    NavigationService.apiCall('MAddonType/search', {
      totalRecords: numberOfRecords,
      page: pageNumber
    }, function (data) {
      callback(data.data);
    });
  }
  //- get data of seach results 
  this.getSearchResult = function (searchKeyword, callback) {
    NavigationService.apiCall('MAddonType/search', {
      keyword: searchKeyword
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
    NavigationService.apiCall('MAddonType/deleteMultipleAddonsType', {idsArray: addons}, function (data) {
      callback();
    });
  }
});