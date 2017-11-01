myApp.controller('loginCtrl', function ($scope, $uibModal, $state, $timeout, loginService) {
    
        // *************************** default variables/tasks begin here ***************** //
        //- to show/hide sidebar of dashboard 
        $scope.$parent.loginTemplate = false;
        $scope.formData = {};
        $scope.userValidationError="";
        $scope.error = '';
    
        // *************************** default functions begin here  ********************** //
        
        // *************************** functions to be triggered form view begin here ***** //
        $scope.verifyUser = function (username, password) {
            loginService.verifyUser(username, password, function (data) {
                $scope.userData = data;
                
                // if user is not available --> api will send --> []
                if (!_.isEmpty($scope.userData)) {
                    console.log('$scope.userData', $scope.userData);
                    $scope.loggedInUser = {};
                    $scope.loggedInUser._id = $scope.userData._id;
                    $scope.loggedInUser.email = $scope.userData.email;
                    $scope.loggedInUser.name = $scope.userData.name;
                    $scope.loggedInUser.photo = $scope.userData.photo;
                    $.jStorage.set("loggedInUser", $scope.loggedInUser);
                    console.log('$.jStorage.get("loggedInUser")' ,$.jStorage.get("loggedInUser"));
                    $state.go('app.dashboard');                    
                } else {                     
                    $timeout(function () {
                        $scope.error = "Invalid username or password !!!";
                    }, 1000);
                }
            });
    
           //$scope.userData = $.jStorage.get("loggedInUser"); 
        }
    
        $scope.verifyUserId = function (username) {            
            loginService.verifyUserId(username, function(data){
                console.log('4441', data);
                if (!_.isEmpty(data)) {
                    $scope.showForgotPassModal = false;
                    $scope.showOtpModal = true;
                    $scope.id = data._id;
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
    
        $scope.verifyOtp = function (id, otp) {
            loginService.verifyOtp(id, otp, function(data){
                console.log('verifOtp(), data ', data)
                if (!_.isEmpty(data)) {
                    $scope.changePasswordAccess = true;
                    $scope.showOtpModal = false;

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
    
        $scope.confimPassword = function (id, password) {
            loginService.confimPassword(id, password, function (data) {
                $scope.cancelModal();
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
            console.log('...................................');
            $scope.modalInstance.dismiss();
        };
    
    
        // // *************************** init all default functions begin here ************** //
        // //- to initilize the default function 
        // $scope.init = function () {}
        // $scope.init();
    
    
    });