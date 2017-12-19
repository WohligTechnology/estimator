myApp.service('createOrEditEnquiryService', function ($http, NavigationService) {

  this.getEnquiryObj = function (id, callback) {
    if (angular.isDefined(id)) {
      NavigationService.apiCall('Enquiry/getOne', {
        _id: id
      }, function (data) {
        if (data.data != "ObjectId Invalid") {
          var temp = data.data;
          temp.enquiryDetails.rfqReceiveddDate =  new Date(temp.enquiryDetails.rfqReceiveddDate);
          temp.enquiryDetails.rfqDueDate = new Date(temp.enquiryDetails.rfqDueDate);
          callback(temp);
        } else {
          callback({});
        }
      });
    } else {
      callback({
        enquiryDetails: {},
        enquiryInfo: {},
        keyRequirement: {},
        technicalRequirement: {},
        commercialRequirement: {},
        preQualificationCriteria: {}
      });
    }
  }
  this.getCustomerData = function (callback) {
    NavigationService.boxCall('Customer/getCustomerNameLocationAndPayTerms', function (data) {
      callback(data.data);
    });
  }
  this.getUserData = function (callback) {
    NavigationService.boxCall('User/getUserName', function (data) {
      callback(data.data);
    });
  }
  this.getEstimateVersionData = function (Id, callback) {
    NavigationService.apiCall('Estimate/getEstimateVersion', {
      enquiryId: Id
    }, function (data) {
      callback(data.data);
    });
  }
  this.createEnquiry = function (enquiryData, callback) {
    NavigationService.apiCall('Enquiry/createEnquiry', enquiryData, function (data) {
      callback(data.data);
    });
  }
  this.saveAssemblyName = function (assName, enquiryId, callback) {
    var estimateData = {
      assemblyName: assName,
      enquiryId: enquiryId
    }

    NavigationService.apiCall('DraftEstimate/createDraftEstimate', estimateData, function (data) {
      callback(data.data);
    });
  }
  this.getAllAssemblyNumbers = function (callback) {
    NavigationService.boxCall('Estimate/getAllUniqueAssembliesNo', function (data) {
      callback(data.data);
    });
  }

  this.getAllEstimateVersionOnAssemblyNo = function (assemblyNumber, callback) {
    var tempObj = {
      assemblyNumber: assemblyNumber
    }
    NavigationService.apiCall('Estimate/getAllEstimateVersionOnAssemblyNo', tempObj, function (data) {
      callback(data.data);
    });
  }
  //- to import assembly
  this.getImportAssemblyData = function (assemblyNumber, versionNo, callback) {
    var tempObj = {
      assemblyNumber: assemblyNumber,
      estimateVersion: versionNo
    }
    NavigationService.apiCall('Estimate/importAssembly', tempObj, function (data) {
      tempObj = data.data.assemblyObj;
      NavigationService.apiCall('DraftEstimate/save', tempObj, function (data1) {
        callback(data1.data);
      });
    });
  }
});