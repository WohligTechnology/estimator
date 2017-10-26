myApp.service('createOrEditEnquiryService', function ($http, NavigationService) {
    
    // this.getAllEnquiryData = function(){
    //     NavigationService.boxCall('Enquiry/search', function (data) {
    //         return data.data.results;
    //     });
    // }

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