myApp.controller('masterProcessService', function ($rootScope, $scope, $http, $timeout, $uibModal) {
 
  //- get master process view
  this.getProcessData = function(callback){
        NavigationService.boxCall('MProcessType/search', function (data) {
      var processes = data.data.results;
      callback(processes);
    });
  }


});