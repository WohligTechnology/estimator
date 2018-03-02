myApp.service('loginService', function (NavigationService) {

    //search a user in database with usename and password
    this.verifyUser = function (username, password, callback) {
        var tempObj = [];
        NavigationService.apiCall('User/loginUser', {
            email: username,
            password: password
        }, function (data) {
            if (data.value) {
                if (data.data != 'ObjectId Invalid' && data.data != 'noDataFound') {
                    tempObj = data.data;
                }
            }
            callback(tempObj);
        });
    }
    //seach user with emailId in db
    this.verifyUserId = function (username, callback) {
        var temp = [];
        NavigationService.apiCall('User/sendForgetPasswordOtp', {
            email: username
        }, function (data) {
            if (data.value) {
                if (data.data != 'userNotFound') {
                    temp = data.data;
                    callback(temp);
                } else {
                    callback(temp);
                }
            } else {
                callback(temp);
            }
        });
    }
    // verify otp gitven by user
    this.verifyOtp = function (Id, userOtp, callback) {
        NavigationService.apiCall('User/confirmForgotPasswordOtp', {
            _id: Id,
            verifyOtp: userOtp
        }, function (data) {
            callback(data.data);
        });
    }
    // to reset password
    this.resetPassword = function (id, password, callback) {
        NavigationService.apiCall('User/resetPassword', {
            _id: id,
            newPassword: password
        }, function (data) {
            if (data.data == 'ObjectId Invalid') {
                data.data = [];
            }
            callback(data.data);
        });
    }

});