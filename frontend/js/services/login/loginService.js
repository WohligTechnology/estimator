myApp.service('loginService', function (NavigationService) {
    
      this.verifyUser = function(userId, password, callback){
        var obj=  {};  
          obj.email = userId;
          obj.password=password;

          NavigationService.apiCall('User/loginUser',obj,function(data){
          debugger;
            console.log('5555555555',data)
              if(data.data = 'ObjectId Invalid' || 'noDataFound'){
                  data.data = [];
              }
              callback(data.data);
          });
      }
      this.verifyUserId = function(username, callback){
          NavigationService.apiCall('User/sendForgetPasswordOtp',{email:username},function(data){   
              console.log('5555555555',data)
              
              if(data.data = 'ObjectId Invalid'){
                  data.data = [];
              }
              callback(data.data);
          });
      }
      this.verifyOtp = function(Id, userOtp, callback){
          debugger;
          NavigationService.apiCall('User/confirmForgotPasswordOtp',{_id:Id, otp:userOtp},function(data){
              console.log('inside verifyOtp service().....data ',data)
              
              if(data.data = 'ObjectId Invalid'){
                  data.data = [];
              }
              callback(data.data);
          });
      }
  
      this.confimPassword = function(username, password, callback){
          NavigationService.apiCall('User/resetPassword',{email:username, forgotPassword:password},function(data){
              console.log('5555555555',data)
              
              if(data.data = 'ObjectId Invalid'){
                  data.data = [];
              }
              callback(data.data);
          });
      }
  });