myApp.controller('customerCtrl', function ($scope, $http, $uibModal, customerService) {


  // *************************** default variables/tasks begin here ***************** //
  //- to show/hide sidebar of dashboard 

  $scope.$parent.isSidebarActive = true;
  $scope.showSaveBtn = true;
  $scope.showEditBtn = false;

  // *************************** default functions begin here  ********************** //
  $scope.getCustomerData = function () {
    customerService.getCustomerData(function (data) {
      $scope.customerData = data;
    });
  }
    // *************************** functions to be triggered form view begin here ***** // 
    $scope.addOrEditCustomerModal = function (operation, customer) {
      customerService.getCustomerModalData(operation, customer, function (data) {
        $scope.formData = data.customer;
        $scope.showSaveBtn = data.saveBtn;
        $scope.showEditBtn = data.editBtn;

        $scope.modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'views/content/customer/modal/createOrEditCustomer.html',
          scope: $scope,
          size: 'md'
        });

      });
    }
    $scope.addOrEditCustomer = function (customerData) {
      console.log("asdsfdgd", customerData);
      customerService.addOrEditCustomer(customerData, function (data) {

        $scope.operationStatus = "Record added successfully";
        $scope.getCustomerData();
        $scope.cancelModal();
      });
    }

    //- modal to confirm customer deletion
    $scope.deleteCustomerModal = function (customerId, getFunction) {
      $scope.idToDelete = customerId;
      $scope.functionToCall = getFunction;

      $scope.modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
        scope: $scope,
        size: 'md'
      });
    }
    $scope.deleteCustomer = function (customerId) {
      customerService.deleteCustomer(customerId, function (data) {
        $scope.operationStatus = "Record deleted successfully";
        $scope.cancelModal();
        $scope.getCustomerData();
      });
    }



  //- to dismiss modal instance
  $scope.cancelModal = function () {
    $scope.modalInstance.dismiss();
  };

 // *************************** init all default functions begin here ************** //
  //- to initilize the default function 
  $scope.init = function () {
    // to get BaseMaster Data
    $scope.getCustomerData();
  }

  $scope.init();
});