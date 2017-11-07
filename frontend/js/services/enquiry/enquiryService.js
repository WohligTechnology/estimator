myApp.service('enquiryService', function ($http, NavigationService) {

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
  //- delete customer
  this.deleteEnquiry = function (enquiryId, callback) {
    NavigationService.delete('Enquiry/delete', {
      _id: enquiryId
    }, function (data) {
      callback(data);
    });
  }
  //- get data of pagination
  this.getPaginationData = function (pageNumber, callback) {
    NavigationService.apiCall('Enquiry/search', {
      page: pageNumber
    }, function (data) {
      callback(data.data.results);
    });
  }
  //- get data of seach results
  this.getSearchResult = function (searchKeyword, callback) {
    NavigationService.apiCall('Enquiry/search', {
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