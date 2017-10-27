myApp.service('enquiryService', function ($http,NavigationService) {
  
  this.getEnquiryData = function (callback) {
    var object = {};
    NavigationService.boxCall('Enquiry/search', function (data) {
      object.detailsActive = true;
      object.infoActive = true;
      object.keyReqActive = true;
      object.techReqsActive = true;
      object.CommReqActive = true;
      object.PreQuaCriteriaActive = true;
      callback(data.data.results, object);
    });
  }
  this.deleteEnquiry = function (enquiryId, callback) {
    NavigationService.delete('Enquiry/delete', { _id: enquiryId }, function (data) {
      callback(data);
    });
  } 
  
});