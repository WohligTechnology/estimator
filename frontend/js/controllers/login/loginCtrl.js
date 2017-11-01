myApp.controller('loginCtrl', function ($scope, $uibModal, $state, $timeout, loginService) {
    
        // *************************** default variables/tasks begin here ***************** //
        //- to show/hide sidebar of dashboard 
        $scope.$parent.loginTemplate = false;
        $scope.formData = {};
        $scope.userValidationError="";
    
        console.log($scope.$parent.loginTemplate);
        // *************************** default functions begin here  ********************** //
    
    
        // *************************** functions to be triggered form view begin here ***** //
        $scope.verifyUser = function (username, password) {
            console.log("aa gaye.username, password ",username, password)
            loginService.verifyUser(username, password, function (data) {
                $scope.userData = data;
                console.log("aa gaye.username, password ,data, ",username, password, data)
                
                // if user is not available --> api will send --> []
                if (!_.isEmpty($scope.userData)) {
                    console.log('$scope.userData', $scope.userData);
                    $scope.loggedInUser = {};
                    $scope.loggedInUser._id = $scope.userData.userDetail._id;
                    $scope.loggedInUser.email = $scope.userData.userDetail.email;
                    $scope.loggedInUser.name = $scope.userData.userDetail.name;
                    $scope.loggedInUser.photo = $scope.userData.userDetail.photo;
                    $.jStorage.set("loggedInUser", $scope.loggedInUser);
                } else {                     
                    $timeout(function () {
                        $scope.userValidationError = "Invalid username or password !!!";
                    }, 1000);
                }
            });
    
           //$scope.userData = $.jStorage.get("loggedInUser"); 
    
        }
    
        $scope.verifyUserId = function (username) {            
            loginService.verifyUserId(username, function(data){
                console.log("inside verifyUserId(username), data", username , data)
                $scope.showForgotPassModal = false;
                $scope.showOtpModal = true;
                $scope.userData = data;
                console.log('$scope.userData',$scope.userData);
                if (!_.isEmpty($scope.userData)) {
                    $scope.loggedInUser = {};
                    $scope.loggedInUser._id = $scope.userData.userDetail._id;
                    $scope.loggedInUser.email = $scope.userData.userDetail.email;
                    $scope.loggedInUser.name = $scope.userData.userDetail.name;
                    $scope.loggedInUser.photo = $scope.userData.userDetail.photo;
                    $.jStorage.set("loggedInUser", $scope.loggedInUser);
                    
                    $scope.modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'views/content/login/loginModal/forgotPasswordModal.html',
                        scope: $scope,
                        size: 'md'
                    });
                } else {
                    $scope.userValidationError = "Please Enter Correct UserName";
                    console.log('$scope.userValidationError',$scope.userValidationError);
                }
            });
    
        }
    
        $scope.verifyOtp = function (otp) {
           // $scope.userData = $.jStorage.get("loggedInUser"); 
            console.log("verifyOtp(otp)", otp )            
            loginService.verifyOtp('59f99765168e9849698c9371', otp, function(data){
                $scope.changePasswordAccess = true;
                $scope.showOtpModal = false;
                console.log('verifOtp(), data ', data)
                if (!_.isEmpty(data)) {
                    $scope.modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'views/content/login/loginModal/forgotPasswordModal.html',
                        scope: $scope,
                        size: 'md'
                    });
                } else {
                    $scope.userValidationError = "Please Enter Correct OTP";
                    console.log('$scope.userValidationError',$scope.userValidationError);
                }                   
                
            });
        }
    
        $scope.confimPassword = function (password) {
            //$scope.userData = $.jStorage.get("loggedInUser");         
            loginService.confimPassword('bhavna8793839160@gmail.com', password, function (data) {
                console.log('inside confimPassword......password, data ', password, data)
                $scope.cancelModal();
                $state.go('app.dashboard');
            });
        }
    
        $scope.forgotPasswordModal = function () {
            $scope.showForgotPassModal = true;
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/login/loginModal/forgotPasswordModal.html',
                scope: $scope,
                size: 'md'
            });
        }
    
        $scope.cancelModal = function () {
            debugger;
            $scope.modalInstance.dismiss();
        };
    
    
        // // *************************** init all default functions begin here ************** //
        // //- to initilize the default function 
        // $scope.init = function () {}
        // $scope.init();
    
    
    });