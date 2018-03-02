myApp.controller('DashboardController', function ($scope, $http,toastr, dashboardService, usersRoleService, TemplateService) {

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
  $scope.getAccessPermissions = function () {
    //- for authorization
    usersRoleService.getUserCrudRole('Dashboard', '', function (response) {
      if (response) {
        $scope.role = response;
        console.log('****.......... $scope.roles in Dashboard...... ****', $scope.role);
      } else {
        // Infinite toastr. hide only when clicked to it.
        toastr[response.status]('', response.message, {
          timeOut: 0,
          extendedTimeOut: 0
        });
      }
    });
  }


  // *************************** functions to be triggered form view begin here ***** //


  // *************************** init all default functions begin here ************** //
  //- to initilize the default function 
  $scope.init = function () {
    $scope.getAccessPermissions();
    if (angular.isDefined($scope.role)) {
      if ($scope.role.read) {
        $scope.getDashboardData();
      }
    }
  }
  $scope.init();

});