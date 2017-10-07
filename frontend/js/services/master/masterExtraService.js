myApp.service('masterExtraService', function (  $http, NavigationService, $uibModal) {
      
        //- get master extra view

       this.getMasterExtraData = function (callback) {
    NavigationService.boxCall('MExtra/search', function (data) {
      var extras = data.data.results;
      callback(extras);
    });
  }
 
 //get extra modal data

 this.getExtraModalData = function (operation, extra, callback) {
      var extraDataObj = {};

      if (angular.isDefined(extra)) {
        extraDataObj.extra = extra;
      }
      if (operation == "save") {
        extraDataObj.saveBtn = true;
        extraDataObj.editBtn = false;

       NavigationService.boxCall('MUom/search', function (data) {
         extraDataObj.uoms = data.data.results;
          callback(extraDataObj);
        });

     } else if (operation == "update") {
        extraDataObj.saveBtn = false;
        extraDataObj.editBtn = true;

          NavigationService.boxCall('MUom/search', function (data) {
         extraDataObj.uoms = data.data.results;
          callback(extraDataObj);
          callback(extraDataObj);

        });
      }
      
    }

 this.addOrEditExtra = function (extraData, callback) {
      NavigationService.apiCall('MExtra/save', extraData, function (data) {
        var extra = data.data.results;
        callback(extra);
      });
    }
   this.deleteExtra = function(extraId,callback){
        var deleteExtraObj = {
            _id:extraId
        };
        NavigationService.delete('MExtra/delete',deleteExtraObj, function(data){
            callback(data);
        });
    }


});