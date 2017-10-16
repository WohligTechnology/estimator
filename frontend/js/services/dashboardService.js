myApp.service('dashboardService', function ($http, $uibModal, NavigationService) {

  this.getDashboardData = function (callback) {
    NavigationService.boxCall('User/getAllDashboardData', function (data) {
      callback(data.data);
    });
  }

});