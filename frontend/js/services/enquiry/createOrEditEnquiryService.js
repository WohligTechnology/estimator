myApp.service('createOrEditEnquiryService', function ($http, $state, NavigationService) {

  this.getEnquiryObj = function (id, callback) {
    if (angular.isDefined(id)) {
      NavigationService.apiCall('Enquiry/getOne', {
        _id: id
      }, function (data) {
        if (data.data != "ObjectId Invalid") {
          var temp = data.data;
          temp.enquiryDetails.rfqReceiveddDate = new Date(temp.enquiryDetails.rfqReceiveddDate);
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
  this.getEstimateData = function (enquiryId, callback) {
    NavigationService.apiCall('DraftEstimate/checkEnquiryEstimate', {
      enquiryId: enquiryId
    }, function (data) {
      callback(data.data);
    });
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
      if (data.data == "noDataFound") {
        data.data = [];
      }
      callback(data.data);
    });
  }
  this.createEnquiry = function (enquiryData, callback) {
    NavigationService.apiCall('Enquiry/createEnquiry', enquiryData, function (data) {
      callback(data);
    });
  }
   
  this.saveAssemblyName = function (assName, enquiryId, callback) {
    var estimateData = {
      assemblyName: assName,
      enquiryId: enquiryId,
      estimateCreatedUser:$.jStorage.get("loggedInUser")._id
    }
    
    NavigationService.apiCall('DraftEstimate/createDraftEstimate', estimateData, function (data) {
      callback(data);
    });
  }
  this.getVersionsOfAssNo = function (callback) {
    NavigationService.boxCall('Estimate/getVersionsOfAssNo', function (data) {
      callback(data.data);
    });
  }
  this.getExcelSheet = function (estimateVersionId, callback) {
    
    var tempObj = {
      _id: estimateVersionId
    }
    NavigationService.apiCall('Estimate/generateEstimateExcel', tempObj, function (data) {
      if (data.value) {
        window.open(adminurl + "Estimate/downloadExcel/" + data.data, '_blank');
      }

    });
  }
  //- to import assembly
  this.getImportAssemblyData = function (assemblyId, callback) {
    NavigationService.apiCall('Estimate/importAssembly', {
      "_id": assemblyId
    }, function (data) {
      var tempObj = data.data.assemblyObj;
      NavigationService.apiCall('DraftEstimate/save', tempObj, function (data1) {
        callback(data1);
      });
    });
  }
});