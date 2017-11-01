myApp.controller('UserProfileController', function($stateParams, $scope, userProfileService) {

  // *************************** default variables/tasks begin here ***************** //


  // *************************** default functions begin here  ********************** //
    //get respective profile Object
    $scope.getProfileData = function(){
        userProfileService.getProfileData($stateParams.profileId, function(data){
            $scope.formData = data;
        });
    }

  // *************************** functions to be triggered form view begin here ***** //
    // Update Profile based on new data
    $scope.updateProfile = function(formData){
        userProfileService.updateProfile(formData);  
    }
    // cancel changes 
    $scope.cancelChanges = function(){
        $scope.getProfileData();
    }

  // *************************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function(){
        $scope.getProfileData();
    }
    $scope.init();
}); 
