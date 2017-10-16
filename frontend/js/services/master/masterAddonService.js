myApp.service('masterAddonService', function ( $http, $uibModal, NavigationService) {

//- get Addon data

this.getAddonData = function(callback){
       NavigationService.boxCall('MAddonType/search', function (data) {
      var addons = data.data.results;
      callback(addons);
    });
}

});