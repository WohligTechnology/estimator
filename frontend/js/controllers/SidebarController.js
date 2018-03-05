/* Setup Layout Part - Sidebar */
myApp.controller('SidebarController', SidebarController);


function SidebarController(toastr, $state, $scope, usersRoleService) {
  $scope.$on('$includeContentLoaded', function () {
    Layout.initSidebar($state); // init sidebar
  });

  // var str = window.location.href;
  // var url = str.split('/');
  // var getState = url[url.length - 1];
  var getState = $state.current.name;

  // get current state & set a class to li
  if (getState == 'app.dashboard') {
    $scope.currentState = 'dashboard';
  } else if (getState == 'app.enquiry') {
    $scope.currentState = 'enquiry';
  } else if (getState == 'app.estimate') {
    $scope.currentState = 'estimate';
  } else if (getState == 'app.customer') {
    $scope.currentState = 'customer';
  } else if (getState == 'app.users') {
    $scope.currentState = 'user';
  } else if (getState == 'app.masterAddon') {
    $scope.currentState = 'master';
    $scope.subMenuState = 'masterAddon';
  } else if (getState == 'app.baseMatser') {
    $scope.currentState = 'master';
    $scope.subMenuState = 'masterBaseMaster';
  } else if (getState == 'app.masterExtra') {
    $scope.currentState = 'master';
    $scope.subMenuState = 'masterExtra';
  } else if (getState == 'app.settings') {
    $scope.currentState = 'setting';
  }

  var userDetails = $.jStorage.get("allRoles");
  // console.log(" In navigation = ",userDetails);
  //-Get Navigation Role wise flags
  usersRoleService.getNavigationRole(userDetails, function (response) {
    if (response.value) {
      $scope.navigationFlags = {};
      $scope.navigationFlags = response.data;
      console.log('****.......... $scope.navigationFlags...... ****',$scope.navigationFlags);
    } else {
      // Infinite toastr. hide only when clicked to it.
      toastr[response.status]('', response.message, {
        timeOut: 0,
        extendedTimeOut: 0
      });
    }
  });
}