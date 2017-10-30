myApp.controller('userProfileController', function($stateParams, $scope, $http, userProfileService) {


    $scope.getUserObj = function(){
        userProfileService.getUserObj($stateParams.profileId, function(data){
            $scope.formData = data;
        });
    }

    $scope.uploadProfile = function (userData) {
        userProfileService.uploadProfile(userData);
      }

    $scope.cancelChanges = function(){
        userProfileService.getUserObj($stateParams.profileId, function(data){
            $scope.formData = data;
        });
    }  

    // $scope.changeProfilePhoto = function(ProfilePhoto){
    //     console.log('**** ProfilePhoto ****', ProfilePhoto);
    //     userProfileService.uploadProfile($stateParams.profileId, ProfilePhoto, function(data){
    //         $scope.formData = data;
    //     });
    // }
   $scope.init = function() {
        $scope.getUserObj();
    }    
    
    $scope.init();

//     var compareTo = function() {
//     return {
//         require: "ngModel",
//         scope: {
//             otherModelValue: "=compareTo"
//         },
//         link: function(scope, element, attributes, ngModel) {
             
//             ngModel.$validators.compareTo = function(modelValue) {
//                 return modelValue == scope.otherModelValue;
//             };
 
//             scope.$watch("otherModelValue", function() {
//                 ngModel.$validate();
//             });
//         }
//     };
// };
 
// module.directive("compareTo", compareTo);

}); 
