myApp.controller('UserProfileController', function ($scope, $timeout, userProfileService) {

    // *************************** default variables/tasks begin here ***************** //
    $scope.$parent.isSidebarActive = false;
    $scope.formData = {};
    $scope.statusMessage = "";
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
            $scope.statusMessage = "Your Profile has been updated successfully";
            $timeout(function () {
                $scope.statusMessage = "";
            }, 4000);
        });
    }
    //set password 
    $scope.changePassword = function (currentPassword, newpassword) {
        userProfileService.changePassword($scope.$parent.loggedInUser._id, currentPassword, newpassword, function (data) {
            if(_.isEmpty(data)){
                $scope.statusMessage = "Your Password current password is wrong";                
            } else {
                $scope.statusMessage = "Your Password has been changed successfully";                
            }
            $timeout(function () {
                $scope.statusMessage = "";
            }, 4000);
        });
    }
    // cancel changes 
    $scope.cancelChanges = function () {
        $scope.getProfileData();
        $scope.statusMessage = "Your Changes have been cancelled";
        $timeout(function () {
            $scope.statusMessage = "";
        }, 4000);
    }

    // *************************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function () {
        $scope.getProfileData();
    }
    $scope.init();
});