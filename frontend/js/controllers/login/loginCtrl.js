myApp.controller('loginCtrl', function ($scope, $uibModal, loginService) {

    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = true;
    $scope.formData = {};

    // *************************** default functions begin here  ********************** //


    // *************************** functions to be triggered form view begin here ***** //
    $scope.verifyUser = function (userId, password) {
        console.log('userId, password', userId, password);
        loginService.verifyUser(userId, password, function (data) {

        });

    }

    $scope.verifyUserId = function (userId) {
        // console.log('userId',userId);
        // loginService.verifyUserId(userId, function(data){
        $scope.showForgotPassModal = false;
        $scope.showOtpModal = true;
        // });
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/login/loginModal/forgotPasswordModal.html',
            scope: $scope,
            size: 'md'
        });

    }

    $scope.verifyOtp = function (userId, otp) {

        // loginService.verifyOtp(otp, function(data){
        $scope.changePasswordAccess = true;
        $scope.showOtpModal = false;
        // });
    }

    $scope.confimPassword = function (userId, password) {
        console.log('aa gaye submit  mei......userId, password...', userId, password, $scope.showForgotPassModal, $scope.showOtpModal, $scope.changePasswordAccess);
        loginService.confimPassword(password, function (data) {
            cancelModal();
        });
    }

    $scope.forgotPasswordModal = function () {

        $scope.showForgotPassModal = true;
        console.log("aa gaya");
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


    // *************************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function () {}
    $scope.init();


});