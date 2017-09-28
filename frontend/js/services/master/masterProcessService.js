myApp.service('masterProcessService', function ($http, $timeout, $uibModal) {
    
  //- get master process view
  this.getProcessData = function(callback){
        NavigationService.boxCall('MProcessType/search', function (data) {
      var processes = data.data.results;
      callback(processes);
    });
  }


});