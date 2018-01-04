myApp.service('estimateService', function (NavigationService) {

  var bulkArray = [];
  //- get estimate view
  this.getEstimateData = function (callback) {
    NavigationService.boxCall('DraftEstimate/getDraftEstimateCustomerName', function (data) {
      callback(data.data);
    });
  }

  //- delete estimate
  this.deleteEstimate = function (estimateId, callback) {
    var idsArray = [];
    idsArray.push(estimateId);
    NavigationService.delete('Web/delRestrictions/DraftEstimate', {idsArray: idsArray}, function (data) {
      callback(data);
    });
  }
  //- get pagination data
  this.getPaginationData = function (pageNumber, count, searchKeyword, callback) {
    NavigationService.apiCall('DraftEstimate/search', {
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
    NavigationService.apiCall('Web/delRestrictions/DraftEstimate', {idsArray: estimates}, function (data) {
      callback(data);
    });
  }

});