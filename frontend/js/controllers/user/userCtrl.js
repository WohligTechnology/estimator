myApp.controller('userCtrl', function ($scope, $http, $uibModal, userService) {



    // *************************** default variables/tasks begin here ***************** //

    //- to show/hide sidebar of dashboard 
    $scope.$parent.isSidebarActive = true;
    $scope.showSaveBtn = true;
    $scope.showEditBtn = false;

    // *************************** default functions begin here  ********************** //

    //- function to get all users from database
    $scope.getUserData = function () {
        userService.getUserData(function (data) {
            $scope.userData = data.results;
            userService.getPaginationDetails(1, data, function (obj) {
                $scope.total = obj.total;
                $scope.pageStart = obj.pageStart;
                $scope.pageEnd = obj.pageEnd;
                $scope.numberOfPages = obj.numberOfPages;
                $scope.pagesArray = obj.pagesArray;
            });

        });
    }


    // *************************** functions to be triggered form view begin here ***** //

    //- modal to create new user 
    $scope.addOrEditUserModal = function (operation, user) {
        userService.getUserModalData(operation, user, function (data) {
            $scope.formData = data.user;
            $scope.showSaveBtn = data.saveBtn;
            $scope.showEditBtn = data.editBtn;

            $scope.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/content/user/modal/createOrEditUser.html',
                scope: $scope,
                size: 'md'
            });

        });
    }
    //- function to  create new user
    $scope.addOrEditUser = function (userData) {
        userService.addOrEditUser(userData, function (data) {
            $scope.operationStatus = "Record added successfully";
            debugger;
            $scope.getUserData();
            $scope.cancelModal();
        });
    }

    //- modal to confirm user deletion
    $scope.deleteUserModal = function (userId, getFunction) {
        $scope.idToDelete = userId;
        $scope.functionToCall = getFunction;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/deleteBaseMasterModal.html',
            scope: $scope,
            size: 'md'
        });
    }
    //- function to delete user
    $scope.deleteUser = function (userId) {
        userService.deleteUser(userId, function (data) {
            $scope.operationStatus = "Record deleted successfully";
            $scope.cancelModal();
            $scope.getUserData();
        });
    }

    //- function for pagination of users' records
    $scope.getPaginationData = function (page, keyword) {
        if (angular.isDefined(keyword)) {
            userService.getPaginationDataWithKeyword(page, keyword, function (data) {
                $scope.data = data;

            });
        } else {
            userService.getPaginationData(page, function (data) {
                $scope.data = data;
            });
        }
        $scope.userData = $scope.data.results;
        console.log('...............................................', $scope.data)
        userService.getPaginationDetails(page, $scope.data, function (obj) {
            $scope.total = obj.total;
            $scope.pageStart = obj.pageStart;
            $scope.pageEnd = obj.pageEnd;
            $scope.numberOfPages = obj.numberOfPages;
            $scope.pagesArray = obj.pagesArray;

        });

    }

    //- function to search the text in table
    $scope.serachText = function (keyword) {
        userService.getSearchResult(keyword, function (data) {
            $scope.userData = data.results;
            userService.getPaginationDetails(1, data, function (obj) {
                $scope.total = obj.total;
                $scope.pageStart = obj.pageStart;
                $scope.pageEnd = obj.pageEnd;
                $scope.numberOfPages = obj.numberOfPages;
                $scope.pagesArray = obj.pagesArray;
            });
        });
    }

    //- to dismiss modal instance
    $scope.cancelModal = function () {
        $scope.modalInstance.dismiss();
    };


    // *************************** init all default functions begin here ************** //

    //- to initilize the default function 
    $scope.init = function () {
        $scope.getUserData();
    }
    $scope.init();

});