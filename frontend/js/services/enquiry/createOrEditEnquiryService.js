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
    this.createDetail = function (detailData) {    
        NavigationService.apiCall('Enquiry/save', detailData, function (data) {
            var enquiryData = data.data.results;
            console.log('**** enquiryData ****',enquiryData);
            
        });
      }
});    