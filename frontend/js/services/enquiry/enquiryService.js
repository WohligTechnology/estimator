myApp.service('enquiryService', function ($http,NavigationService) {

  this.getCustomerData = function (callback) {
    NavigationService.boxCall('Customer/search', function (data) {
      var customers = data.data.results;
      callback(customers);
    });
  }
  this.createEnquiry = function (detailData, callback) {    
    NavigationService.apiCall('Enquiry/save', detailData, function (data) {
      callback(data.data);
    });
  }
  this.getEnquiryData = function (callback) {
    NavigationService.boxCall('Enquiry/search', function (data) {
      callback(data.data.results);
    });
  }

});