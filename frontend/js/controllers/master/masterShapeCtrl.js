myApp.controller('masterShapeCtrl', function ($scope, $http, $timeout, $uibModal, masterShapeService) {

    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = false;
    //- to show/hide save & update button on pop-up according to operation
    $scope.showSaveBtn = true;
    $scope.showEditBtn = false;
    $scope.shapeVariables = [];

    // *************************** default functions begin here  ********************** //
    $scope.getShapeData = function () {
        masterShapeService.geShapeData(function (data) {
            console.log('**** inside function_name of masterShapeCtrl.js ****',data);
            $scope.shapeData = data;
        });
    }
    $scope.getVariablesData = function(){
        masterShapeService.geShapeData(function (data) {
            console.log('**** inside function_name of masterShapeCtrl.js ****',data);
            $scope.shapeData = data;
        });
    }

    $scope.createOrEditShapeData = function (operation, shape) {
        masterShapeService.createOrEditShapeData(operation, shape, function (data) {
            $scope.formData = data.shape;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;
        });
    }
    $scope.createOrEditShape = function (shape) {
        masterShapeService.createOrEditShape(shape, function (data) {
            $scope.operationStatus = "Shape added successfully";
            $scope.getShapeData();
        });
    }
    $scope.deleteShapeModal = function (shapeId, getFunction) {
        console.log('**** inside deleteShapeModal of masterShapeCtrl.js & data is ****', getFunction);
        $scope.idToDelete = shapeId;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    $scope.deleteShape = function (shapeId) {
        console.log('**** inside deleteShape of createOrEditMaterialCtrl.js ****');
        masterShapeService.deleteShape(shapeId, function (data) {
            $scope.operationStatus = "Record deleted successfully";
            $scope.cancelModal();
            $scope.getShapeData();
        });
    }

    // *************************** functions to be triggered form view begin here ***** //


    //- to dismiss modal instance
    $scope.cancelModal = function () {
        $scope.modalInstance.dismiss();
    };

    // *************************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function () {
        // to get Shape Data
        $scope.getShapeData();
    }

    $scope.init();


    $scope.checkBox = [

        {
            "name": "a",
        }, {
            "name": "b",
        }, {
            "name": "c",
        }, {
            "name": "d"
        }, {
            "name": "e"
        }, {
            "name": "f"
        }, {
            "name": "g"
        }, {
            "name": "q1"
        }, {
            "name": "q2"
        }, {
            "name": "Thikness(t)"
        }, {
            "name": "Length(l)"
        }, {
            "name": "Wastage(w)"
        },
    ]
    $scope.checkBox = _.chunk($scope.checkBox, 3);


});