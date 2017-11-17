myApp.controller('UserProfileController', function ($scope, toastr, userProfileService) {

    // *************************** default variables/tasks begin here ***************** //
    $scope.$parent.isSidebarActive = false;
    $scope.formData = {};
    $scope.loggedInUser = $.jStorage.get('loggedInUser');    

    // *************************** default functions begin here  ********************** //
    //get respective profile Object
    $scope.getProfileData = function () {
        userProfileService.getProfileData($scope.loggedInUser._id, function (data) {
            $scope.formData = data;
        });
    }

    // *************************** functions to be triggered form view begin here ***** //
    // Update Profile based on new data
    $scope.updateProfile = function (formData) {
        userProfileService.updateProfile(formData, function (data) {
            toastr.success("Your Profile has been updated successfully");
        });
    }
    //set password 
    $scope.changePassword = function (currentPassword, newpassword) {
        userProfileService.changePassword($scope.loggedInUser._id, currentPassword, newpassword, function (data) {
            if(_.isEmpty(data)){
                toastr.warning("Your Password current password is wrong");                
            } else {
                toastr.success("Your Password has been changed successfully");                
            }
            $scope.getProfileData();
        });
    }
    // cancel changes 
    $scope.cancelChanges = function () {
        $scope.getProfileData();
        toastr.info("Your Changes have been cancelled");
        
    }

    // *************************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function () {
        $scope.getProfileData();
    }
    $scope.init();
});