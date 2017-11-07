myApp.service('masterExtraService', function ($http, NavigationService, $uibModal) {

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
        callback(extraDataObj);

      });
    }

  }
  //- add or edit extra
  this.addOrEditExtra = function (extraData, callback) {
    NavigationService.apiCall('MExtra/save', extraData, function (data) {
      var extra = data.data.results;
      callback(extra);
    });
  }
  //- delete extra
  this.deleteExtra = function (extraId, callback) {
    var deleteExtraObj = {
      _id: extraId
    };
    NavigationService.delete('MExtra/delete', deleteExtraObj, function (data) {
      callback(data);
    });
  }
  //- get data of pagination
  this.getPaginationData = function (pageNumber, callback) {
    NavigationService.apiCall('MExtra/search', {
      page: pageNumber
    }, function (data) {
      callback(data.data.results);
    });
  }
  //- get data of seach results  
  this.getSearchResult = function (searchKeyword, callback) {
    NavigationService.apiCall('MExtra/search', {
      keyword: searchKeyword
    }, function (data) {
      callback(data.data);
    });
  }
  //- get details about pagination
  this.getPaginationDetails = function(pageNumber, data, callback){
    var obj = {};
    obj.pageStart = (pageNumber-1)*10+1;
    obj.total = data.total;
    if(obj.total <= pageNumber*10){
      obj.pageEnd = obj.total;
    } else {
      obj.pageEnd = pageNumber*10;
    } 
    obj.numberOfPages = Math.ceil((obj.total) / 10);
    obj.pagesArray = [];
    for (var i = 0; i < obj.numberOfPages; i++) {
      obj.pagesArray[i] = i + 1;
    }
    callback(obj);
  }

});