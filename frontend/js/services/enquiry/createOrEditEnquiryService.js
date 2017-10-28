myApp.service('createOrEditEnquiryService', function ($http, NavigationService) {
    
  this.getEnquiryObj = function (id, callback) {
    if(angular.isDefined(id)){
      NavigationService.apiCall('Enquiry/getOne', {_id:id}, function (data) {
        callback(data.data);
      });
    }else{
      callback();
    }
  }
  this.getCustomerData = function (callback) {
      NavigationService.boxCall('Customer/search', function (data) {
        var customers = data.data.results;
        callback(customers);
      });
 } 
  this.createEnquiry = function (enquiryData, callback) {    
      NavigationService.apiCall('Enquiry/save', enquiryData, function (data) {
        callback(data.data);
      });
  }
});    