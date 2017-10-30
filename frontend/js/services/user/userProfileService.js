myApp.service('userProfileService', function ($http, NavigationService) {
    
    this.getUserObj = function (id, callback) {
        NavigationService.apiCall('user/getOne', {_id:id}, function (data) {
        callback(data.data);
        });
    }
    this.uploadProfile = function (userData) {    
        NavigationService.apiCall('user/save', userData);
    }
    
});