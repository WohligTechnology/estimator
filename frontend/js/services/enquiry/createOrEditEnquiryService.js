myApp.service('createOrEditEnquiryService', function ($http, $state, NavigationService) {

  this.getEnquiryObj = function (id, callback) {
    debugger;
    var temp = {};
    if (angular.isDefined(id)) {
      NavigationService.apiCall('Enquiry/getOne', {
        _id: id
      }, function (data) {
        if (data.data != "ObjectId Invalid") {
          temp = data.data;
          temp.enquiryDetails.rfqReceiveddDate = new Date(temp.enquiryDetails.rfqReceiveddDate);
          temp.enquiryDetails.rfqDueDate = new Date(temp.enquiryDetails.rfqDueDate);
        } else {
          temp = {
            enquiryDetails: {},
            enquiryInfo: {},
            keyRequirement: {},
            technicalRequirement: {},
            commercialRequirement: {},
            preQualificationCriteria: {}
          }
        }
        callback(temp);
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
    var temp = [];
    NavigationService.boxCall('Customer/getCustomerNameLocationAndPayTerms', function (data) {
      if (data.value) {
        temp = data.data;
      }
      callback(temp);
    });
  }
  this.getUserData = function (callback) {
    var temp = [];
    NavigationService.boxCall('User/getUserName', function (data) {
      if (data.value) {
        temp = data.data;
      }
      callback(temp);
    });
  }
  this.getEstimateVersionData = function (Id, callback) {
    var temp = [];
    NavigationService.apiCall('Estimate/getEstimateVersion', {
      enquiryId: Id
    }, function (data) {
      if (data.value) {
        if (data.data != "noDataFound") {
          temp = data.data
        }
      }
      callback(temp);
    });
  }
  this.validationOfEnquiry = function (enquiryData, callback) {
    var enquiryValidation = {
      errorCount: 0
    };
    if (_.isEmpty(enquiryData.customerDataObj.customerName)) {
      enquiryValidation.customerName = "Select Customer Name."
      enquiryValidation.errorCount++;
    } else {
      enquiryValidation.customerName = ""
    }
    if (_.isEmpty(enquiryData.enquiryDetails.estimator)) {
      enquiryValidation.estimator = "Select Estimator."
      enquiryValidation.errorCount++;
    } else {
      enquiryValidation.estimator = ""
    }
    if (_.isEmpty(enquiryData.enquiryDetails.enquiryStatus)) {
      enquiryValidation.status = "Select Status."
      enquiryValidation.errorCount++;
    } else {
      enquiryValidation.status = " "
    }
    callback(enquiryValidation);
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
      estimateCreatedUser: $.jStorage.get("loggedInUser")._id
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
  this.getImportAssemblyData = function (assemblyId, enquiryId, callback) {
    NavigationService.apiCall('Estimate/importAssembly', {
      "_id": assemblyId,
      "enqryId": enquiryId //- to update response data with recent enquiryId
    }, function (data) {
      var tempObj = data.data.assemblyObj;
      //- remove some fields to update calculations based on recent margins
      tempObj = _.omit(tempObj, ['commission', 'negotiation', 'other', 'scaleFactors']);
      NavigationService.apiCall('DraftEstimate/save', tempObj, function (data1) {
        callback(data1);
      });
    });
  }
});