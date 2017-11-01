myApp.controller('loginCtrl', function ($scope, $uibModal, $timeout, loginService) {

    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.loginTemplete = false;
    $scope.formData = {};
    $scope.loginText = "Login";
    $scope.userValidationError="";

    // *************************** default functions begin here  ********************** //


    // *************************** functions to be triggered form view begin here ***** //
    $scope.verifyUser = function (username, password) {
        loginService.verifyUser(username, password, function (data) {
            $scope.userData = data;

            // if user is not available --> api will send --> []
            if (!_.isEmpty($scope.userData)) {
                $scope.loggedInUser = {};
                $scope.loggedInUser._id = $scope.userData.userDetail._id;
                $scope.loggedInUser.email = $scope.userData.userDetail.email;
                $scope.loggedInUser.name = $scope.userData.userDetail.name;
                $scope.loggedInUser.photo = $scope.userData.userDetail.photo;
                $.jStorage.set("loggedInUser", $scope.loggedInUser);
            }
            if (_.isEmpty($scope.userData)){                     
                $timeout(function () {
                    $scope.formData.userValidationError = "Invalid username or password !!!";
                }, 1000);
            }

        });

       //$scope.userData = $.jStorage.get("loggedInUser"); 

    }

    $scope.verifyUserId = function (username) {
        loginService.verifyUserId(username, function(data){
            $scope.showForgotPassModal = false;
            $scope.showOtpModal = true;
            $scope.userData = data;
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
            }
        });

    }

    $scope.verifyOtp = function (otp) {
        $scope.userData = $.jStorage.get("loggedInUser"); 

        loginService.verifyOtp($scope.userData._id, otp, function(data){
            $scope.changePasswordAccess = true;
            $scope.showOtpModal = false;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/login/loginModal/forgotPasswordModal.html',
                scope: $scope,
                size: 'md'
            });
         });
    }

    $scope.confimPassword = function (password) {
        $scope.userData = $.jStorage.get("loggedInUser");         
        loginService.confimPassword($scope.userData.email, password, function (data) {
            cancelModal();
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
        $scope.modalInstance.dismiss();
    };


    // // *************************** init all default functions begin here ************** //
    // //- to initilize the default function 
    // $scope.init = function () {}
    // $scope.init();


});





    //     if (_.isEmpty($scope.userData)) {
    //       $timeout(function () {
    //         $scope.userValidationError = "Invalid username or password !!!";
    //         $scope.loginText = "Login";
    //       }, 1000);

    //     } else if ($scope.userData.accessLevel == 'InActive') {
    //       toastr.error("You don't have permission to access the dashboard");
    //       $timeout(function () {
    //         $scope.loginText = "Login";
    //       }, 3500);
    //     } else if (!_.isEmpty($scope.userData.center)) {
    //       // if center --> redirec t it on dashboard 
    //       $state.go("dashboardCompScreen");
    //     } else if (!_.isEmpty($scope.userData.state)) {
    //       // check user is center or state?
    //       // if state --> open popup to select the state
    //       if ($scope.userData.state.length == 1) {
    //         $scope.stateUserLogi($scope.userData.state[0]);
    //       } else {
    //         $scope.modalInstance = $uibModal.open({
    //           animation: true,
    //           templateUrl: '../backend/views/modal/selectLoginData.html',
    //           scope: $scope,
    //           windowClass: 'upload-pic',
    //           backdropClass: 'black-drop',
    //           size: 'sm'
    //         });
    //       }
    //     } else {
    //       toastr.error("You don't have permission to access the dashboard");
    //       $timeout(function () {
    //         $scope.loginText = "Login";
    //       }, 5500);
    //     }
    //   });
    // }

