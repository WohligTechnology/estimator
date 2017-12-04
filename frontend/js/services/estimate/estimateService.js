myApp.service('estimateService', function (NavigationService) {

  var bulkArray = [];
  //- get estimate view
  this.getEstimateData = function (callback) {
    NavigationService.boxCall('Estimate/search', function (data) {
      callback(data.data);
    });
  }
    //- delete estimate
    this.deleteEnquiry = function (estimateId, callback) {
      NavigationService.delete('Estimate/delete', {
        _id: estimateId
      }, function (data) {
        callback(data);
      });
    }
  //- get data of pagination
  this.getPaginationDatawithoutKeyword = function (pageNumber, callback) {
    NavigationService.apiCall('Estimate/search', {
      page: pageNumber
    }, function (data) {
      callback(data.data);
    });
  }
  //- get pagination data with search-keyword
  this.getPaginationDataWithKeyword = function (pageNumber, count, searchKeyword, callback) {
    NavigationService.apiCall('Estimate/search', {
      keyword: searchKeyword,
      totalRecords: count,
      page: pageNumber
    }, function (data) {
      callback(data.data);
    });
  }
  //- get page data with show records
  this.getPageDataWithShowRecords = function (pageNumber, numberOfRecords, callback) {
    NavigationService.apiCall('Estimate/search', {
      totalRecords: numberOfRecords,
      page: pageNumber
    }, function (data) {
      callback(data.data);
    });
  }
  //- get data of seach results
  this.getSearchResult = function (searchKeyword, callback) {
    NavigationService.apiCall('Estimate/search', {
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
  this.selectBulkEstimates = function (checkboxStatus, estimateId, callback) {
    if (checkboxStatus == true) {
      bulkArray.push(estimateId);
    } else {
      _.remove(bulkArray, function (record) {
        return record == estimateId;
      });
    }
    callback(bulkArray);
  }
  //- form an array of Ids of all estimates for deletion
  this.selectAll = function (estimates, checkboxStatus, callback) {
    bulkArray = [];
    if (checkboxStatus == true) {
      angular.forEach(estimates,  function (obj) {
        var estimateId = obj._id;
        bulkArray.push(estimateId);
      });
    }
    callback(bulkArray);
  }
  //- delete bulk estimates
  this.deleteBulkEstimates = function (estimates, callback) {
    NavigationService.apiCall('Estimate/deleteMultipleEstimates', {idsArray: estimates}, function (data) {
      callback();
    });
  }

});
