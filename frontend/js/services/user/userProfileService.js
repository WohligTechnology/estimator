myApp.service('userProfileService', function (NavigationService) {
    
    //to get data of current user
    this.getProfileData = function (id, callback) {
        NavigationService.apiCall('User/getOne', {_id:id}, function (data) {
            var user = data.data;
            callback(user);
        });
    }
    //to update any user's profile data
    this.updateProfile = function (userData, callback) {
        console.log("userData in update profle", userData);
        NavigationService.apiCall('User/save', userData, function(data){
            callback(data.data);
        });
    }
      // to reset password
    this.changePassword = function(id, currentpassword, newPassword, callback){
        NavigationService.apiCall('User/changePassword',{_id:id, password:currentpassword, newPassword:newPassword},function(data){
          if(data.data == 'noDataFound' || data.data == 'password not matching'){
              data.data = [];
          }
          callback(data.data);
        });
    }

});