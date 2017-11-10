myApp.controller('estimateCtrl', function ($rootScope, $scope, $http, $timeout, $uibModal, estimateService) {
    $scope.$parent.isSidebarActive = true;
    $scope.bulkEstimates = [];
    $scope.operationStatus = '';
    //table data
    $scope.tableData = [{
            "id": "1",
            "name": "kishori",
            "cname": "1",
            "dname": "kishori",
            "cid": "1",
            "pname": "kishori",
            "did": "1",
            "bname": "kishori",

        },
        {
            "id": "1",
            "name": "kishori",
            "cname": "1",
            "dname": "kishori",
            "cid": "1",

        },
        {
            "id": "1",
            "name": "kishori",
            "cname": "1",
            "dname": "kishori",
            "cid": "1",
        }
    ]

    // Delete modal start
    $scope.deleteItem = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/delete.html',
            scope: $scope,
            size: 'sm',
        });
    };
    //end of modal

    //Edit Estimate modal start
    $scope.allEstimateEdit = function () {
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/estimate/estimateModal/allEstimateEdit.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal

    //- to dismiss modal instance
    $scope.cancelModal = function () {
        $scope.modalInstance.dismiss();
    }

    //- modal to confirm bulk estimates deletion
    $scope.deleteBulkEstimatesModal = function (estimateIdArray, getFunction) {
        $scope.idsToDelete = estimateIdArray;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/deleteBulkModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    //- function to delete estimate
    $scope.deleteBulkEstimates = function (estimates) {
        estimateService.deleteBulkEstimates(estimates, function () {
            $scope.cancelModal();
            $scope.getEstimateData();
            $scope.bulkEstimates = [];
            $scope.operationStatus = "***   Records deleted successfully   ***";

            $timeout(function () {
                $scope.operationStatus = "";
            }, 4000);
        });
    }
    //- function to get bulk estimates
    $scope.selectBulkEstimates = function (checkboxStatus, estimateId) {
        estimateService.selectBulkEstimates(checkboxStatus, estimateId, function (data) {
            if (data.length >= 1) {
                $scope.recordSelected = true;
            } else {
                $scope.recordSelected = false;
            }
            $scope.bulkEstimates = data;
        });
    }
    //- to select all records
    $scope.selectAll = function (estimates, checkboxStatus) {
        estimateService.selectAll(estimates, checkboxStatus, function (data) {
            $scope.bulkEstimates = data;
        });
    }

    // *************************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function () {
       // $scope.getEstimateData();
    }
    $scope.init();


});