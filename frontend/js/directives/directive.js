myApp

    .directive('loading', function () {
        return {
            restrict: 'A',
            replace: true,
            template: '<div class="loading"><img style="left: 40%; z-index: 1; position: relative;" src="img/Spin.gif" width="200px" height="200px" /></div>',
            link: function (scope, element, attr) {
                scope.$watch('loading', function (val) {
                    if (val)
                        $(element).show();
                    else
                        $(element).hide();
                });
            }
        }
    })

    .directive('inputDate', function ($compile, $parse) {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                value: "=ngModel",
            },
            templateUrl: 'frontend/views/directive/date.html',
            link: function ($scope, element, attrs) {
                $scope.data = {};
                $scope.dateOptions = {
                    dateFormat: "dd/mm/yy"
                };
                if (!_.isEmpty($scope.value)) {
                    $scope.data.model = moment($scope.value).toDate();
                }
                $scope.changeDate = function (data) {
                    // $scope.value = $scope.data.model;
                    $scope.value = data;
                };
            }
        };
    })

    .factory('accessApp', function ($location) {
        return {
            isLoggedIn: function () {
                if ($.jStorage.get("loggedInUser")) {
                    return true;
                } else {
                    return $location.path('/');
                }
            }
        }
    })

    .directive('uploadAllFiles', function ($http) {
        return {
            restrict: 'E',
            scope: {
                model: '=ngModel',
                fileLocation: '@fileLocation',
                isMultiple: '=isMultiple',
                icon: '@icon'
            },
            templateUrl: '/views/directive/uploadAllFiles.html',

            link: function (scope, element, attrs) {
                if (scope.isMultiple) {
                   if (!scope.model) {
                        scope.model = [];
                    }
                } else {
                    if (scope.model) {
                        var fileName = _.split(scope.model, '.');
                        var fileType = fileName[1];

                        scope.isPhoto = (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png');
                        scope.isPdf = (fileType == 'pdf');
                        scope.isDocs = (fileType == 'doc' || fileType == 'docx');
                        scope.isOtherFile = !scope.isPhoto && !scope.isPdf && !scope.isDocs;
                    }
                }

                scope.uploadImage = function (files) {
                    // scope.isNoFile = !scope.model && !scope.pdfFile && !scope.icon;
                    var fileName = _.split(files[0].name, '.');
                    var fileType = fileName[1];

                    if(fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png'){
                        scope.isPhoto = (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png');
                    }else if(fileType == 'pdf'){
                        scope.fileImage = "frontend/img/pdf.jpg";
                    }else if(fileType == 'doc' || fileType == 'docx'){
                        scope.fileImage = "frontend/img/doc.png";
                    }else {
                        scope.fileImage = "frontend/img/file.png";
                    }

                    //  = (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png');
                    // scope.isPdf = (fileType == 'pdf');
                    // scope.isDocs = (fileType == 'doc' || fileType == 'docx');
                    // scope.isOtherFile = !scope.isPhoto && !scope.isPdf && !scope.isDocs;

                    if (files.length > 1 && scope.isMultiple) {
                        angular.forEach(files, function (file) {
                            var fd = new FormData();
                            fd.append('file', file);

                            $http.post(adminurl + 'User/uploadAvtar', fd, {
                                    headers: {
                                        'Content-Type': undefined
                                    },
                                    transformRequest: angular.identity
                                })
                                .then(function (data) {
                                    scope.model.push(data.data.data[0]);
                                });
                        });
                    } else {
                        var fd = new FormData();
                        fd.append('file', files[0]);

                        $http.post(adminurl + 'User/uploadAvtar', fd, {
                                headers: {
                                    'Content-Type': undefined
                                },
                                transformRequest: angular.identity
                            })
                            .then(function (data) {
                                scope.model = data.data.data[0];
                            });
                    }
                };
            }
        };
    })


    .filter('uploadpath', function () {
        return function (input, width, height, style) {
            var other = "";
            if (input.search(".pdf") >= 0) {
                return "frontend/img/pdf.jpg";
            } else {
                if (input.search(".jpg") >= 0 || input.search(".png") >= 0) {
                    return "frontend/img/image.png";
                } else {
                    if (input.search(".doc") >= 0 || input.search(".docx") >= 0) {
                        return "frontend/img/doc.png";
                    } else if (input == 'broken') {
                        return "frontend/img/nofile.png";
                    }
                }
            }
            if (width && width !== "") {
                other += "&width=" + width;
            }
            if (height && height !== "") {
                other += "&height=" + height;
            }
            if (style && style !== "") {
                other += "&style=" + style;
            }
            if (input) {
                if (input.indexOf('https://') == -1) {
                    return imgpath + "?file=" + input + other;
                } else {
                    return input;
                }
            }
        };
    })

    .filter('downloadpath', function () {
                
        return function (input, width, height, style) {
            var other = "";
            if (width && width !== "") {
                other += "&width=" + width;
            }
            if (height && height !== "") {
                other += "&height=" + height;
            }
            if (style && style !== "") {
                other += "&style=" + style;
            }
            if (input) {
                if (input.indexOf('https://') == -1) {
                    return adminurl + "User/download/" + input;
                } else {
                    return adminurl;
                }
            }
        };
    })

    .filter('readFile', function () {
        
        return function (input, width, height, style) {
            var other = "";
            if (width && width !== "") {
                other += "&width=" + width;
            }
            if (height && height !== "") {
                other += "&height=" + height;
            }
            if (style && style !== "") {
                other += "&style=" + style;
            }
            if (input) {
                if (input.indexOf('https://') == -1) {
                    return adminurl + "User/readFile/" + input;
                } else {
                    return adminurl;
                }
            }
        };
    })

    .filter('dateFormat', function () {
        return function (input, width, height, style) {
            var temp = "";
            if (input) {
                temp = _.split(input, '-');
                temp[2] = _.split(temp[2], 'T');
                return temp[2][0] + "/" + temp[1] + "/" + temp[0];
            } else {
                return temp;
            }
        }
    })

    .filter('getExtension',function(){
        return function (input) {  
            if (input) {
                return input.split(".").pop();;
            } else {
                return "";
            }
        }
    })

    .directive('img', function ($compile, $parse) {
        return {
            restrict: 'E',
            replace: false,
            link: function ($scope, element, attrs) {
                var $element = $(element);
                if (!attrs.noloading) {
                    $element.after("<img src='img/loading.gif' class='loading' />");
                    var $loading = $element.next(".loading");
                    $element.load(function () {
                        $loading.remove();
                        $(this).addClass("doneLoading");
                    });
                } else {
                    $($element).addClass("doneLoading");
                }
            }
        };
    })

    .directive('hideOnScroll', function ($document) {
        return {
            restrict: 'EA',
            replace: false,
            link: function (scope, element, attr) {
                var $element = $(element);
                var lastScrollTop = 0;
                $(window).scroll(function (event) {
                    var st = $(this).scrollTop();
                    if (st > lastScrollTop) {
                        $(element).addClass('nav-up');
                    } else {
                        $(element).removeClass('nav-up');
                    }
                    lastScrollTop = st;
                });
            }
        };
    })

    .directive('fancybox', function ($document) {
        return {
            restrict: 'EA',
            replace: false,
            link: function (scope, element, attr) {
                var $element = $(element);
                var target;
                if (attr.rel) {
                    target = $("[rel='" + attr.rel + "']");
                } else {
                    target = element;
                }

                target.fancybox({
                    openEffect: 'fade',
                    closeEffect: 'fade',
                    closeBtn: true,
                    padding: 0,
                    helpers: {
                        media: {}
                    }
                });
            }
        };
    })

    .directive('autoHeight', function ($compile, $parse) {
        return {
            restrict: 'EA',
            replace: false,
            link: function ($scope, element, attrs) {
                var $element = $(element);
                var windowHeight = $(window).height();
                $element.css("min-height", windowHeight);
            }
        };
    })

    .directive('replace', function () {
        return {
            require: 'ngModel',
            scope: {
                regex: '@replace',
                with: '@with'
            },
            link: function (scope, element, attrs, model) {
                model.$parsers.push(function (val) {
                    if (!val) {
                        return;
                    }
                    var regex = new RegExp(scope.regex);
                    var replaced = val.replace(regex, scope.with);
                    if (replaced !== val) {
                        model.$setViewValue(replaced);
                        model.$render();
                    }
                    return replaced;
                });
            }
        };
    })

    // Route State Load Spinner(used on page or content load)
    .directive('ngSpinnerBar', ['$rootScope', '$state',
        function ($rootScope, $state) {
            return {
                link: function (scope, element, attrs) {
                    // by defult hide the spinner bar
                    element.addClass('hide'); // hide spinner bar by default

                    // display the spinner bar whenever the route changes(the content part started loading)
                    $rootScope.$on('$stateChangeStart', function () {
                        element.removeClass('hide'); // show spinner bar
                    });

                    // hide the spinner bar on rounte change success(after the content loaded)
                    $rootScope.$on('$stateChangeSuccess', function (event) {
                        element.addClass('hide'); // hide spinner bar
                        $('body').removeClass('page-on-load'); // remove page loading indicator
                        Layout.setAngularJsSidebarMenuActiveLink('match', null, event.currentScope.$state); // activate selected link in the sidebar menu

                        // auto scorll to page top
                        setTimeout(function () {
                            App.scrollTop(); // scroll to the top on content load
                        }, $rootScope.settings.layout.pageAutoScrollOnLoad);
                    });

                    // handle errors
                    $rootScope.$on('$stateNotFound', function () {
                        element.addClass('hide'); // hide spinner bar
                    });

                    // handle errors
                    $rootScope.$on('$stateChangeError', function () {
                        element.addClass('hide'); // hide spinner bar
                    });
                }
            };
        }
    ])

    // Handle global LINK click
    .directive('a', function () {
        return {
            restrict: 'E',
            link: function (scope, elem, attrs) {
                if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                    elem.on('click', function (e) {
                        e.preventDefault(); // prevent link click for above criteria
                    });
                }
            }
        };
    })

    // Handle Dropdown Hover Plugin Integration
    .directive('dropdownMenuHover', function () {
        return {
            link: function (scope, elem) {
                elem.dropdownHover();
            }
        };
    })

    .directive('onlyDigits', function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attr, ctrl) {
                var digits;

                function inputValue(val) {
                    if (val) {
                        var otherVal = val + "";
                        if (attr.type == "text") {
                            digits = otherVal.replace(/[^0-9\-\.\\]/g, '');
                        } else {
                            digits = otherVal.replace(/[^0-9\-\.\\]/g, '');
                        }


                        if (digits !== val) {
                            ctrl.$setViewValue(digits);
                            ctrl.$render();
                        }
                        return parseInt(digits, 10);
                    }
                    return undefined;
                }
                ctrl.$parsers.push(inputValue);
            }
        };
    });