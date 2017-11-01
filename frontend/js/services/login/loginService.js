myApp.service('loginService', function (NavigationService) {
    
      this.verifyUser = function(userId, password, callback){
        var obj=  {};  
          obj.email = userId;
          obj.password=password;

          NavigationService.apiCall('User/loginUser',obj,function(data){
              if(data.data = 'ObjectId Invalid'){
                  data.data = [];
              }         
            console.log('inside loginUser',data.data)
            callback(data.data);
          });
      }
      this.verifyUserId = function(username, callback){
        var obj=  {};  
        obj.email = username;
          NavigationService.apiCall('User/sendForgetPasswordOtp',obj,function(data){   
            if(data.data = 'userNotFound'){
                  data.data = [];
            }
              console.log('inside verifyUserId() data',data.data)
              callback(data.data);
          });
      }
      this.verifyOtp = function(Id, userOtp, callback){
        var obj=  {};  
        obj._id = Id;
        obj.otp=userOtp;
          NavigationService.apiCall('User/confirmForgotPasswordOtp',obj,function(data){
              console.log('inside verifyOtp service().....data ',data)
              
            //   if(data.data = 'userNotFound'){
            //       data.data = [];
            //   }
              callback(data.data);
          });
      }
  
      this.confimPassword = function(id, password, callback){
        var obj=  {};  
        obj._id = id;
        obj.password=password;

          NavigationService.apiCall('User/resetPassword',obj,function(data){
              console.log('5555555555',data)
              
            //   if(data.data = 'ObjectId Invalid'){
            //       data.data = [];
            //   }
              callback(data.data);
          });
      }
  });