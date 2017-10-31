myApp.service('createOrEditEnquiryService', function ($http, NavigationService) {
    
  this.getEnquiryObj = function (id, callback) {
    if(angular.isDefined(id)){
      NavigationService.apiCall('Enquiry/getOne', {_id:id}, function (data) {
        if(data.data != "ObjectId Invalid"){
          callback(data.data);
        }else{
          callback({});
        }        
      });
    }else{
      callback({});
    }
  }
  this.getCustomerData = function (callback) {
      NavigationService.boxCall('Customer/search', function (data) {
        var customers = data.data.results;
        callback(customers);
      });
 } 
  this.createEnquiry = function (enquiryData, callback) {    
      NavigationService.apiCall('Enquiry/createEnquiry', enquiryData, function (data) {
        callback(data.data);
      });
  }
  this.saveAssemblyName = function(assName, enquiryId,callback){
    var estimateData = {
      assemblyName:assName,
      enquiryId:enquiryId
    }
    
    NavigationService.apiCall('DraftEstimate/save', estimateData, function (data) {
      callback(data.data);
    });
  }
});    