myApp.service('masterExtraService', function (NavigationService) {

  var bulkArray = [];

  //- get master extra view
  this.getMasterExtraData = function (callback) {
    NavigationService.boxCall('MExtra/search', function (data) {
      callback(data.data);
    });
  }
  //- get extra modal data
  this.getExtraModalData = function (operation, extra, callback) {
    var extraDataObj = {};

    if (angular.isDefined(extra)) {
      extraDataObj.extra = extra;
    }
    if (operation == "save") {
      extraDataObj.saveBtn = true;
      extraDataObj.editBtn = false;

      NavigationService.boxCall('MUom/search', function (data) {
        extraDataObj.uoms = data.data.results;
        callback(extraDataObj);
      });

    } else if (operation == "update") {
      extraDataObj.saveBtn = false;
      extraDataObj.editBtn = true;

      NavigationService.boxCall('MUom/search', function (data) {
        extraDataObj.uoms = data.data.results;
        callback(extraDataObj);
      });
    }

  }
  //- add or edit extra
  this.addOrEditExtra = function (extraData, callback) {
    NavigationService.apiCall('MExtra/save', extraData, function (data) {
      callback(data);
    });
  }
  //- delete extra
  this.deleteExtra = function (extraId, callback) {
    idsArray = [];
    idsArray.push(extraId);
    NavigationService.apiCall('Web/delRestrictions/MExtra', {idsArray: idsArray}, function (data) {
      callback(data);
    });
  }
  //- get pagination data
  this.getPaginationData = function (pageNumber, count, searchKeyword, callback) {
    NavigationService.apiCall('MExtra/search', {
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
  //- get pagination data with search-keyword
  this.getPaginationDataWithKeyword = function (pageNumber, searchKeyword, callback) {
    NavigationService.apiCall('MExtra/search', {
      keyword: searchKeyword,
      page: pageNumber
    }, function (data) {
      callback(data.data);
    });
  }
  //- form an array of bulk Ids
  this.selectBulkUsers = function (checkboxStatus, extraId, callback) {
    if (checkboxStatus == true) {
      bulkArray.push(extraId);
    } else {
      _.remove(bulkArray, function (record) {
        return record == extraId;
      });
    }
    callback(bulkArray);
  }
  //- form an array of Ids of all extras for deletion
  this.selectAll = function (extras, checkboxStatus, callback) {
    bulkArray = [];
    if (checkboxStatus == true) {
      angular.forEach(extras,  function (obj) {
        var extraId = obj._id;
        bulkArray.push(extraId);
      });
    }
    callback(bulkArray);
  }
  //- delete bulk extras
  this.deleteBulkUsers = function (extras, callback) {
    NavigationService.apiCall('Web/delRestrictions/MExtra', {idsArray: extras}, function (data) {
      callback(data);
    });
  }
});