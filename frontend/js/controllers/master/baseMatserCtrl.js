myApp.controller('baseMatserCtrl', function ($rootScope, $scope, $http, $timeout, $uibModal) {
    $scope.$parent.isSidebarActive = true;
    // Uom modal start
    $scope.createOrEditUom = function () {
        $scope.createOrEditModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/createOrEditUom.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
    //Variable modal start
    $scope.variable = function () {
        $scope.createOrEditModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/createOrEditVariable.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
    //Formulas modal start
    $scope.formulas = function () {
        $scope.createOrEditModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/createOrEditDFact.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
    //Markups modal start
    $scope.markups = function () {
        $scope.createOrEditModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/content/master/base/createOrEditMarkups.html',
            scope: $scope,
            size: 'md',
        });
    };
    //end of modal
    //UOM tree
    $scope.uom = [{
        "name": "UOM 1",
    }, {
        "name": "UOM 2",

    }, {
        "name": "UOM 3",
    }];
    //Variable tree
    $scope.variables = [{
        "name": "Variable 1",
    }, {
        "name": "Variable 2",

    }, {
        "name": "Variable 3",
    }];
    //Formulas tree
    $scope.Formula = [{
        "name": "Name 1",
    }, {
        "name": "Name 2",

    }, {
        "name": "Name 3",
    }];
    //Markups tree
    $scope.Markup = [{
        "name": "Markups Name",
    }, {
        "name": "Markups Name",

    }, {
        "name": "Markups Name",
    }];


//date picker
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.toggleMin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [{
        date: tomorrow,
        status: 'full'
    }, {
        date: afterTomorrow,
        status: 'partially'
    }];

    function getDayClass(data) {
        var date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }

});