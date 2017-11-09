myApp.controller('masterExtraCtrl', function ($scope, $http, $uibModal, masterExtraService) {


    // *************************** default variables/tasks begin here ***************** //
    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = true;
    $scope.showSaveBtn = true;
    $scope.showEditBtn = false;
    $scope.bulkExtras = [];


    // *************************** default functions begin here  ********************** //
    //- function to get all extras data
    $scope.getMasterExtraData = function () {
        masterExtraService.getMasterExtraData(function (data) {
            $scope.extraData = data.results;
            masterExtraService.getPaginationDetails(1, 10, data, function (obj) {
                $scope.obj = obj;
                $scope.page = 1;
            });
        });
    }


    // *************************** functions to be triggered form view begin here ***** // 
    //- modal to create new extra 
    $scope.addOrEditExtraModal = function (operation, extra) {

        masterExtraService.getExtraModalData(operation, extra, function (data) {

            $scope.formData = data.extra;
            $scope.uoms = data.uoms;

            if (angular.isDefined(data.extra)) {
                $scope.selectedRateUom = data.extra.rate.uom;
            }

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
    //- function to  create new customer
    $scope.addOrEditExtra = function (extraData, selectedRateUom) {
        extraData.rate.uom = selectedRateUom;

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
    //- function for  extra deletion
    $scope.deleteExtra = function (extraId) {
        masterExtraService.deleteExtra(extraId, function (data) {
            $scope.operationStatus = "Record deleted successfully";
            $scope.cancelModal();
            $scope.getMasterExtraData();
        });
    }

    //- function for pagination of master extras' records
    $scope.getPaginationData = function (page, numberOfRecords, keyword) {
        if (angular.isUndefined(keyword) || keyword == '') {
          if (numberOfRecords != '10') {
            masterExtraService.getPageDataWithShowRecords(page, numberOfRecords, function (data) {
              $scope.extraData = data.results;
              masterExtraService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
                $scope.obj = obj;
              });
            });
          } else {
            masterExtraService.getPaginationDatawithoutKeyword(page, function (data) {
              $scope.extraData = data.results;
              masterExtraService.getPaginationDetails(page, 10, data, function (obj) {
                $scope.obj = obj;
              });
            });
          }
        } else {
            masterExtraService.getPaginationDataWithKeyword(page, numberOfRecords, keyword, function (data) {
            $scope.extraData = data.results;
            masterExtraService.getPaginationDetails(page, numberOfRecords, data, function (obj) {
              $scope.obj = obj;
            });
          });
        }
      }

    //- function to search the text in table
    $scope.serachText = function (keyword, count) {
        masterExtraService.getSearchResult(keyword, function (data) {
            $scope.extraData = data.results;
            masterExtraService.getPaginationDetails(1, count, data, function (obj) {
                $scope.obj = obj;
            });
        });
    }

    //- to dismiss modal instance
    $scope.cancelModal = function () {
        $scope.modalInstance.dismiss();
    }
    
      //- modal to confirm bulk extras deletion
      $scope.deleteBulkExtrasModal = function (addonIdArray, getFunction) {
        $scope.idsToDelete = addonIdArray;
        $scope.functionToCall = getFunction;
    
        $scope.modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'views/content/deleteBulkModal.html',
          scope: $scope,
          size: 'md'
        });
      }
      //- function to delete extra
      $scope.deleteBulkExtras = function (extras) {
        masterExtraService.deleteBulkExtras(extras, function (data) {
          $scope.operationStatus = "Records deleted successfully";
          $scope.cancelModal();
          $scope.getMasterExtraData();
        });
      }
      //- function to get bulk extras
      $scope.selectBulkExtras = function (checkboxStatus, addonId) {
        masterExtraService.selectBulkExtras(checkboxStatus, addonId, function (data) {
          if (data.length >= 1) {
            $scope.recordSelected = true;
          } else {
            $scope.recordSelected = false;
          }
          $scope.bulkExtras = data;
        });
      }
      //- to select all records
      $scope.selectAll = function (extras, checkboxStatus) {
        masterExtraService.selectAll(extras, checkboxStatus, function (data) {
          $scope.bulkExtras = data;
        });
      }


    // *************************** init all default functions begin here ************** //
    //- to initilize the default function 
    $scope.init = function () {
        $scope.getMasterExtraData();
    }
    $scope.init();

});