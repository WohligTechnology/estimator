myApp.controller('masterExtraCtrl', function ($scope, $http, $uibModal, masterExtraService) {


    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = true;
    $scope.showSaveBtn = true;
    $scope.showEditBtn = false;

    // *************************** default functions begin here  ********************** //
    $scope.getMasterExtraData = function () {
        masterExtraService.getMasterExtraData(function (data) {
            $scope.extraData = data;
        });
    }


    // *************************** functions to be triggered form view begin here ***** // 
    $scope.addOrEditExtraModal = function (operation, extra) {
        masterExtraService.getExtraModalData(operation, extra, function (data) {
            $scope.formData = data.extra;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;
            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/master/extra/createOrEditExtra.html',
                scope: $scope,
                size: 'md'
            });
        });
    }

    $scope.addOrEditExtra = function (extraData) {
      masterExtraService.addOrEditExtra(extraData, function (data) {

            $scope.operationStatus = "Record added successfully";
            $scope.getMasterExtraData();
            $scope.cancelModal();
        });
    }

   //- modal to confirm extra deletion
    $scope.deleteExtraModal = function (extraId, getFunction) {
      $scope.idToDelete = extraId;
      $scope.functionToCall = getFunction;

      $scope.modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
        scope: $scope,
        size: 'md'
      });
    }

 $scope.deleteExtra = function (extraId) {
       masterExtraService.deleteExtra(extraId, function (data) {
        $scope.operationStatus = "Record deleted successfully";
        $scope.cancelModal();
        $scope.getMasterExtraData();
      });
    }
  //- to dismiss modal instance
  $scope.cancelModal = function () {
    $scope.modalInstance.dismiss();
  };


    // *************************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function () {

        $scope.getMasterExtraData();
    }

    $scope.init();

});