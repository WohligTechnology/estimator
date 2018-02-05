myApp.controller('DashboardController', function ($scope, $http, dashboardService, TemplateService) {

  // *************************** default variables/tasks begin here ***************** //
  //- to show/hide sidebar of dashboard 
  $scope.$parent.isSidebarActive = true;
  //- for title
  TemplateService.getTitle("Dashboard");

  // *************************** default functions begin here  ********************** //
  $scope.getDashboardData = function () {
    dashboardService.getDashboardData(function (data) {
      $scope.dashboardData = data;
    });
  }


  // *************************** functions to be triggered form view begin here ***** //


  // *************************** init all default functions begin here ************** //
  //- to initilize the default function 
  $scope.init = function () {
    $scope.getDashboardData();
  }
  $scope.init();

});