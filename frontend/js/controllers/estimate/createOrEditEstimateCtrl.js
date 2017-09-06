myApp.controller('createOrEditEstimateCtrl', function ($scope, $http, createOrEditEstimateService) {

    $scope.$parent.isSidebarActive = false;
 
    $scope.getEstimateView = function (getViewName) {
        $scope.estimateView = createOrEditEstimateService.estimateView(getViewName);
    }

    $scope.getEstimateData = function(){
        createOrEditEstimateService.getEstimateData(function(data){
            $scope.estimteData = data;
        });
    }

    $scope.init = function(){
        $scope.getEstimateView('estimateAssembly');
        $scope.getEstimateData();
    }

    $scope.init();
    
});