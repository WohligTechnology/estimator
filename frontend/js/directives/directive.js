myApp
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

    .directive('uploadImage', function ($http, $filter) {
        console.log('**** inside uploadImage of app.js ****');
        return {
            templateUrl: 'frontend/views/directive/uploadFile.html',
            scope: {
                model: '=ngModel',
                callback: "=ngCallback",
                disabled: "=ngDisabled"
            },
            link: function ($scope, element, attrs) {
                debugger;
                console.log('**** inside model of directive.js ****',$scope.model);
                function checkIfBroken() {
                    if ($scope.model && $scope.model != "broken") {
                        // because institute-form will have lot of files in it (around or more than 1 GB), it will 
                        // take huge amount of time to download all files from server  
                        // so we have to stop downloading all files 
                        // if it is affecting on other webpages where you have used same directive, then simply make a 
                        // copy of same directive with different name, uncomment following downloadpath filter in that copy
                        // & use new directive but please do not change it
    
                        var str = $scope.model;
                        if ($scope.model.slice(str.length - 3, str.length) != 'pdf') {
                            $http.get($filter("downloadpath")($scope.model)).then(function (data) {
                                if (data.data && data.data.value === false) {
                                    $scope.model = "broken";
                                }
                            });
                        }
                    }
                }
    
    
                $scope.showImage = function () {
                    console.log($scope.image);
                };
                $scope.$watch("model", function (newVal, oldVal) {
                    debugger;
                    checkIfBroken();
                });
    
    
    
    
                $scope.isMultiple = false;
                $scope.inObject = false;
                if (attrs.multiple || attrs.multiple === "") {
                    $scope.isMultiple = true;
                    $("#inputImage").attr("multiple", "ADD");
                }
                if (attrs.noView || attrs.noView === "") {
                    $scope.noShow = true;
                }
    
                $scope.$watch("image", function (newVal, oldVal) {
                    console.log('**** inside newVal of app.js ****', newVal);
                    console.log('**** inside oldVal of app.js ****', oldVal);
                    if (newVal && newVal.file) {
                        $scope.uploadNow(newVal);
                    }
                });
    
                if ($scope.model) {
                    if (_.isArray($scope.model)) {
                        $scope.image = [];
                        _.each($scope.model, function (n) {
                            $scope.image.push({
                                url: n
                            });
                        });
                    }    
                }
                if (attrs.inobj || attrs.inobj === "") {
                    $scope.inObject = true;
                }
                $scope.clearOld = function () {
                    $scope.model = [];
                };
                $scope.uploadNow = function (image) {
                    console.log('**** inside uploadImage uploadNow of app.js ****');
                    debugger;
                    $scope.uploadStatus = "uploading";
    
                    var Template = this;
                    image.hide = true;
                    var formData = new FormData();
                    formData.append('file', image.file, image.name);
                    $http.post(uploadurl, formData, {
                        headers: {
                            'Content-Type': undefined
                        },
                        transformRequest: angular.identity
                    }).then(function (data) {
                        data = data.data;
                        if ($scope.callback) {
                            $scope.callback(data);
                        } else {
                            $scope.uploadStatus = "uploaded";
                            if ($scope.isMultiple) {
                                if ($scope.inObject) {
                                    $scope.model.push({
                                        "image": data.data[0]
                                    });
                                } else {
                                    $scope.model.push(data.data[0]);
                                }
                            } else {
                                $scope.model = data.data[0];
                            }
                        }
                    });
                };
            }
        };
    });