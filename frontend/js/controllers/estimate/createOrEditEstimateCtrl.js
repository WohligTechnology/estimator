myApp.controller('createOrEditEstimateCtrl', function ($rootScope, $scope, $http, $timeout, $uibModal) {

    $scope.$parent.isSidebarActive = false;
    $scope.getEstimateView = "../frontend/views/content/estimate/estimateViews/assembly.html";

    $scope.subAssembly = [{
        "name": "subAssName 1",
        "part": [{
            "name": "partName1"
        }, {
            "name": "partName2"
        }]
    }, {
        "name": "subAssName 2",
        "part": [{
            "name": "partName1"
        }, {
            "name": "partName2"
        }, {
            "name": "partName3"
        }]
    }, {
        "name": "subAssName 3",
        "part": [{
            "name": "partName1"
        }]
    }];

    $scope.getAssemblyView = function () {
        alert('**** inside getAssemblyView of createOrEditEstimateCtrl.js ****');
    }

    $scope.createSubAssemblyModal = function () {
        alert('**** inside createSubAssemblyModal of createOrEditEstimateCtrl.js ****');
    }

    $scope.editAssembly = function () {
        alert('**** inside editAssembly of createOrEditEstimateCtrl.js ****');
    }

    $scope.getSubAssemblyView = function () {
        alert('**** inside getSubAssemblyView of createOrEditEstimateCtrl.js ****');
        $scope.getEstimateView = "../frontend/views/content/estimate/estimateViews/subassembly.html";
    }

    $scope.createEstimatePart = function () {
        alert('**** inside createEstimatePart of createOrEditEstimateCtrl.js ****');
    }

    $scope.editSubAssembly = function () {
        alert('**** inside editSubAssembly of createOrEditEstimateCtrl.js ****');
    }

    $scope.deleteSubAssembly = function () {
        alert('**** inside deleteSubAssembly of createOrEditEstimateCtrl.js ****');
    }

    $scope.editEstimatePart = function () {
        alert('**** inside editEstimatePart of createOrEditEstimateCtrl.js ****');
    }

    $scope.deleteEstimatePart = function () {
        alert('**** inside deleteEstimatePart of createOrEditEstimateCtrl.js ****');
    }

    $scope.getProcessingView = function () {
        alert('**** inside deleteEstimatePart of createOrEditEstimateCtrl.js ****');
    }

    $scope.getAddonsView = function () {
        alert('**** inside deleteEstimatePart of createOrEditEstimateCtrl.js ****');
    }

    $scope.getExtrasView = function () {
        alert('**** inside deleteEstimatePart of createOrEditEstimateCtrl.js ****');
    }

    $scope.getCustomMaterialsView = function () {
        alert('**** inside deleteEstimatePart of createOrEditEstimateCtrl.js ****');
    }

});