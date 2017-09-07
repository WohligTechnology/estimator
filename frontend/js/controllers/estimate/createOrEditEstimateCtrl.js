myApp.controller('createOrEditEstimateCtrl', function ($scope, $http, createOrEditEstimateService) {


    // *************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = false;


    // *************** default functions begin here  ********************** //
    //- to get all views of createOrEdit estimate screen dynamically 
    $scope.getEstimateView = function (getViewName) {
        $scope.estimateView = createOrEditEstimateService.estimateView(getViewName);
    }
    //- get data to generate tree structure dynamically i.e. get assembly stucture
    $scope.getEstimateData = function () {
        createOrEditEstimateService.getEstimateData(function (data) {
            $scope.estimteData = data;
        });
    }


    // *************** functions to be triggered form view begin here ***** //
    //- to edit assembly name
    $scope.editAssemblyNameModal = function () {}
    $scope.editAssemblyName = function () {}

    //- to add or edit subAssembly name
    $scope.addOrEditSubAssemblyModal = function () {}
    $scope.addOrEditSubAssembly = function (subAssemblyId) {}
    
    //- modal to confirm subssembly deletion
    $scope.deleteSubAssemblyModal = function (subAssemblyId) {}
    $scope.deleteSubAssembly = function (subAssemblyId) {}
    
    //- to add or edit subAssembly name
    $scope.addOrEditPartModal = function () {}
    $scope.addOrEditPart = function (subAssemblyId) {}

    //- modal to confirm part deletion
    $scope.deletePartModal = function (partId,) {}
    $scope.deletePart = function (partId) {}

    //- to add or edit proccessing at assembly or subssembly or at partLevel
    $scope.addOrEditProceesingModal = function(){}
    $scope.addOrEditProceesingModal = function(){}
    //- 
    $scope.deleteProccesingModal = function(){}
    $scope.deleteProccesing = function(){}


    // *************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function () {
        $scope.getEstimateView('estimateAssembly');
        $scope.getEstimateData();
    }

    $scope.init();

});