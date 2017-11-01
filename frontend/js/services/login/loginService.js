myApp.service('loginService', function (NavigationService) {
  
    this.verifyUser = function(userId, password, callback){
        NavigationService.apiCall('user/loginUser',{email:userId, password:password},function(data){
            console.log('5555555555',data)
            
            if(data.data = 'ObjectId Invalid'){
                data.data = [];
            }
            callback(data.data);
        });
    }
    this.verifyUserId = function(username, callback){
        NavigationService.apiCall('User/loginUser/sendForgotPasswordOtp',{email:username},function(data){   
            console.log('5555555555',data)
            
            if(data.data = 'ObjectId Invalid'){
                data.data = [];
            }
            callback(data.data);
        });
    }
    this.verifyOtp = function(Id, userOtp, callback){
        NavigationService.apiCall('User/loginUser/confirmForgotPasswordOtp',{_id:Id, otp:userOtp},function(data){
            console.log('5555555555',data)
            
            if(data.data = 'ObjectId Invalid'){
                data.data = [];
            }
            callback(data.data);
        });
    }

    this.confimPassword = function(username, password, callback){
        NavigationService.apiCall('User/loginUser/resetPassword',{email:username, forgotPassword:password},function(data){
            console.log('5555555555',data)
            
            if(data.data = 'ObjectId Invalid'){
                data.data = [];
            }
            callback(data.data);
        });
    }
});
