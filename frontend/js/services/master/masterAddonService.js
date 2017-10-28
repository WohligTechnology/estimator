myApp.service('masterAddonService', function ($http, NavigationService) {

  this.getAddonData = function (callback) {
    NavigationService.boxCall('MAddonType/search', function (data) {
      callback(data.data.results);
    });
  }

  this.getAddonTypeModalData = function (operation, addonType, callback) {
    // get material cat data
    // get uom data
    var addonTempObj = {};
    if (angular.isDefined(addonType)) {
      addonTempObj.addonTypeData = addonType;
    }

    if (operation == "save") {
      addonTempObj.saveBtn = true;
      addonTempObj.editBtn = false;
    } else if (operation == "update") {
      addonTempObj.saveBtn = false;
      addonTempObj.editBtn = true;
    }

    NavigationService.boxCall('MMaterialCat/getMaterialStructure', function (mMatData) {
      NavigationService.boxCall('MUom/search', function (mUomData) {
        addonTempObj.mMatData = mMatData.data;
        addonTempObj.mUomData = mUomData.data.results;
        callback(addonTempObj);
      });
    });
  }
  this.addOrEditAddonType = function(){
    
  }



});