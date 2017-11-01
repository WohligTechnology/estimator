myApp.service('userProfileService', function (NavigationService) {
    
    this.getProfileData = function (id, callback) {
        NavigationService.apiCall('User/getOne', {_id:id}, function (data) {
            var user = data.data;
            callback(user);
        });
    }

    this.updateProfile = function (userData, callback) {
        console.log("userData in update profle", userData);
        NavigationService.apiCall('User/save', userData);
    }

});