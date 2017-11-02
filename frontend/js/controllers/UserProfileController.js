myApp.controller('UserProfileController', function($scope, $timeout, userProfileService) {

    // *************************** default variables/tasks begin here ***************** //
    $scope.loggedInUser = $.jStorage.get('loggedInUser');    
    $scope.formData = {};
    $scope.statusMessage = "";

        // *************************** default functions begin here  ********************** //
    //get respective profile Object
    $scope.getProfileData = function(){
        userProfileService.getProfileData(loggedInUser._id, function(data){
            $scope.formData = data;
        });
    }

        // *************************** functions to be triggered form view begin here ***** //
    // Update Profile based on new data
    $scope.updateProfile = function(formData){
        userProfileService.updateProfile(formData, function(data){
            $scope.statusMessage = "Your Profile has been updated successfully";
            $timeout(function () {
                $scope.operationStatus = "";
            }, 5000);
        });  
    }
     //set password 
     $scope.changePassword = function (currentPassword, newpassword) {
        userProfileService.changePassword(loggedInUser._id, currentPassword, newpassword, function (data) {
            $scope.cancelModal();
            $scope.statusMessage = "Your Password has been changed successfully";
            $timeout(function () {
                $scope.operationStatus = "";
              }, 5000);
        });
    }
    // cancel changes 
    $scope.cancelChanges = function(){
        $scope.getProfileData();
        $scope.statusMessage = "Your Changes have been cancelled";
        $timeout(function () {
            $scope.operationStatus = "";
          }, 5000);
    }

        // *************************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function(){
        $scope.getProfileData();
    }
    $scope.init();
}); 
