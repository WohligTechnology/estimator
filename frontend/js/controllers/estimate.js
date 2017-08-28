myApp.controller('EstimateController', function($rootScope, $scope, $http, $timeout,$uibModal) {

//    $scope.$on('$viewContentLoaded', function() {   
//         App.initAjax(); // initialize core components        
//     });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = true;


//tabs 
//   $scope.tabs = [
//     { title:'Dynamic Title 1', content:'Dynamic content 1' },
//     { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
//   ];

//   $scope.alertMe = function() {
//     setTimeout(function() {
//       $window.alert('You\'ve selected the alert tab!');
//     });
//   };

//   $scope.model = {
//     name: 'Tabs'
//   };


        //start of pagination 
          $scope.totalItems = 64;
          $scope.currentPage = 4;

          $scope.setPage = function (pageNo) {
          $scope.currentPage = pageNo;
          };

          $scope.pageChanged = function() {
          $log.log('Page changed to: ' + $scope.currentPage);
        };

  $scope.maxSize = 5;
  $scope.bigTotalItems = 175;
  $scope.bigCurrentPage = 1;

  //end of pagination
  //start of checkbox

 // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    
});