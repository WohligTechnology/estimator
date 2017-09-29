myApp.service('masterProcessService', function ($http, $uibModal, NavigationService) {
    
  //- get master process view
  this.getProcessData = function(callback){
        NavigationService.boxCall('MProcessType/search', function (data) {
        callback(data.data.results);
    });
  }


});