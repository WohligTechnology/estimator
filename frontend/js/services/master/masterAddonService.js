myApp.service('masterAddonService', function ($http, NavigationService) {

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
  //- get data of seach results 
  this.getSearchResult = function (searchKeyword, callback) {
    NavigationService.apiCall('MAddonType/search', {
      keyword: searchKeyword
    }, function (data) {
      callback(data.data);
    });
  }
  //- get details about pagination
  this.getPaginationDetails = function (pageNumber, data, callback) {
    var obj = {};
    obj.pageNumber = pageNumber;
    obj.pageStart = (pageNumber - 1) * 10 + 1;
    obj.total = data.total;
    if (obj.total <= pageNumber * 10) {
      obj.pageEnd = obj.total;
    } else {
      obj.pageEnd = pageNumber * 10;
    }
    obj.numberOfPages = Math.ceil((obj.total) / 10);
    obj.pagesArray = [];
    for (var i = 0; i < obj.numberOfPages; i++) {
      obj.pagesArray[i] = i + 1;
    }
    callback(obj);
  }
  //- get pagination data with search-keyword
  this.getPaginationDataWithKeyword = function (pageNumber, searchKeyword, callback) {
    NavigationService.apiCall('MAddonType/search', {
      keyword: searchKeyword,
      page: pageNumber
    }, function (data) {
      callback(data.data);
    });
  }

});