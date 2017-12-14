myApp.controller('loginCtrl', function ($scope, $uibModal, $state, $timeout, loginService) {


    // *************************** default variables/tasks begin here ***************** //
    if ($.jStorage.get('loggedInUser') != null) {
        $state.go('app.dashboard');
    } else {
        $scope.$parent.loginTemplate = false;
        $scope.formData = {};
        $scope.userValidationError = '';
        $scope.error = '';

    }

    // *************************** functions to be triggered form view begin here ***** //
    $scope.verifyUser = function (username, password) {
        loginService.verifyUser(username, password, function (data) {
            $scope.userData = data;

            // if user is not available --> api will send --> []
            if (!_.isEmpty($scope.userData)) {
                $scope.loggedInUser = {};
                $scope.loggedInUser._id = $scope.userData._id;
                $scope.loggedInUser.email = $scope.userData.email;
                $scope.loggedInUser.name = $scope.userData.name;
                $scope.loggedInUser.photo = $scope.userData.photo;
                $.jStorage.set("loggedInUser", $scope.loggedInUser);
                $state.go('app.dashboard');
                $scope.$parent.loginTemplate = true;
            } else {
                $timeout(function () {
                    $scope.error = "Invalid username or password !!!";
                }, 100);
            }
        });
        //$scope.userData = $.jStorage.get("loggedInUser"); 
    }
    //to verify username in case of forgot password
    $scope.verifyUserId = function (username) {
        loginService.verifyUserId(username, function (data) {
            if (!_.isEmpty(data)) {
                $scope.showForgotPassModal = false;
                $scope.showOtpModal = true;
                $scope.formData.id = data.userId;
                $scope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/content/login/loginModal/forgotPasswordModal.html',
                    scope: $scope,
                    size: 'md'
                });
            } else {
                $scope.userValidationError = "Please Enter Correct UserName";
                $timeout(function () {
                    $scope.userValidationError = "";
                }, 3000);
            }
        });

    }
    //to verify otp in case of forgot password
    $scope.verifyOtp = function (id, otp) {
        loginService.verifyOtp(id, otp, function (data) {
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
                $timeout(function () {
                    $scope.userValidationError = "";
                }, 3000);
            }

        });
    }
    //reset password 
    $scope.setPassword = function (id, password) {
        loginService.resetPassword(id, password, function (data) {
            $scope.cancelModal();
            $state.go('login');
        });
    }
    //forgot password modal
    $scope.forgotPasswordModal = function () {
        $scope.showForgotPassModal = true;
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/login/loginModal/forgotPasswordModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    //cancel modal
    $scope.cancelModal = function () {
        $scope.modalInstance.dismiss();
    }

});