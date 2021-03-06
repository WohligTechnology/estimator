
myApp.service('userProfileService', function (NavigationService, $http) {

    //to get data of current user
    this.getProfileData = function (id, callback) {
        NavigationService.apiCall('User/getOne', {
            _id: id
        }, function (data) {
            callback(data.data);
        });
    }
    //to update any user's profile data
    this.updateProfile = function (userData, callback) {
        NavigationService.apiCall('User/save', userData, function (data) {
            callback(data.data);
        });
    }
    // this.updateProfilePhoto = function (file, callback) {
    //     debugger;
    //     console.log('****file in service..... ****', file);
    //     var fd = new FormData();
    //     fd.append('file', file);

    //     $http.post('http://wohlig.io/api/User/uploadAvtar', fd, {
    //             transformRequest: angular.identity,
    //             headers: {
    //                 'Content-Type': undefined
    //             }
    //         })
    //         .then(function () {
    //             console.log('**** inside its working of userProfileService.js ****');
    //         });


    // }
    // to reset password
    this.changePassword = function (id, currentpassword, newPassword, callback) {
        NavigationService.apiCall('User/changePassword', {
            _id: id,
            password: currentpassword,
            newPassword: newPassword
        }, function (data) {
            if (data.data == 'noDataFound' || data.data == 'password not matching') {
                data.data = [];
            }
            callback(data.data);
        });
    }

});