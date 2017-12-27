myApp.service('enquiryService', function ($http, NavigationService) {

  var bulkArray = [];

  //- get enquiry view
  this.getEnquiryData = function (callback) {
    var object = {};
    NavigationService.boxCall('Enquiry/search', function (data) {
      object.detailsActive = true;
      object.infoActive = true;
      object.keyReqActive = true;
      object.techReqsActive = true;
      object.CommReqActive = true;
      object.PreQuaCriteriaActive = true;
      callback(data.data, object);
    });
  }
  //- delete enquiry
  this.deleteEnquiry = function (enquiryId, callback) {
    var idsArray = [];
    idsArray.push(enquiryId);
    NavigationService.delete('Web/delRestrictions/Enquiry', {idsArray}, function (data) {
      callback(data);
    });
  }
  //- get pagination data
  this.getPaginationData = function (pageNumber, count, searchKeyword, callback) {
    NavigationService.apiCall('Enquiry/search', {
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
  this.selectBulkEnquiries = function (checkboxStatus, enquiryId, callback) {
    if (checkboxStatus == true) {
      bulkArray.push(enquiryId);
    } else {
      _.remove(bulkArray, function (record) {
        return record == enquiryId;
      });
    }
    callback(bulkArray);
  }
  //- form an array of Ids of all enquiries for deletion
  this.selectAll = function (enquiries, checkboxStatus, callback) {
    bulkArray = [];
    if (checkboxStatus == true) {
      angular.forEach(enquiries,  function (obj) {
        var enquiryId = obj._id;
        bulkArray.push(enquiryId);
      });
    } 
    callback(bulkArray);
  }
  //- delete bulk enquiries
  this.deleteBulkEnquiries = function (enquiries, callback) {
    NavigationService.apiCall('Web/delRestrictions/Enquiry', {idsArray: enquiries}, function (data) {
      callback(data);
    });
  }
});