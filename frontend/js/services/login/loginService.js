myApp.service('loginService', function (NavigationService) {
  
  //search a user in database with usename and password
  this.verifyUser = function(username, password, callback){
      NavigationService.apiCall('User/loginUser',{email:username, password:password},function(data){
          debugger;
          if(data.data == 'ObjectId Invalid' || data.data == 'noDataFound'){
              data.data = [];
          }         
        callback(data.data);
      });
  }
  //seach user with emailId in db
  this.verifyUserId = function(username, callback){
      NavigationService.apiCall('User/sendForgetPasswordOtp',{email:username},function(data){   
        if(data.data == 'userNotFound'){
              data.data = [];
        }
          console.log('inside verifyUserId() data',data.data)
          callback(data.data);
      });
  }
  // verify otp gitven by user
  this.verifyOtp = function(Id, userOtp, callback){
      NavigationService.apiCall('User/confirmForgotPasswordOtp',{_id:Id, verifyOtp:userOtp},function(data){              
          callback(data.data);
      });
  }
  // to reset password
  this.resetPassword = function(id, password, callback){
      NavigationService.apiCall('User/resetPassword',{_id:id, newPassword:password},function(data){
          if(data.data == 'ObjectId Invalid'){
              data.data = [];
          }
          callback(data.data);
      });
  }
 
});