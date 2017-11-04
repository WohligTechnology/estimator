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


    .directive('uploadImage', function ($http, $filter, $timeout) {
        debugger;
        return {
            templateUrl: 'frontend/views/directive/uploadFile.html',
            scope: {
                model: '=ngModel',
                type: "@type",
                callback: "&ngCallback"
            },
            link: function ($scope, element, attrs) {
                console.log("***************** $scope.model *********************", $scope.model);
                $scope.showImage = function () {};
                $scope.check = true;
                if (!$scope.type) {
                    $scope.type = "image";
                }
                $scope.isMultiple = true;
                $scope.inObject = false;
                if (attrs.multiple == "true") {
                    $scope.isMultiple = true;
                    $("#inputImage").attr("multiple", "ADD");
                }
                if (attrs.noView || attrs.noView === "") {
                    $scope.noShow = true;
                }
                // if (attrs.required) {
                //     $scope.required = true;
                // } else {
                //     $scope.required = false;
                // }

                $scope.$watch("image", function (newVal, oldVal) {
                    debugger;
                    console.log("************************* inside watch 1st console *******************", newVal, oldVal);
                    var isArr = _.isArray(newVal);
                    if (!isArr && newVal && newVal.file) {
                        $scope.uploadNow(newVal);
                    } else if (isArr && newVal.length > 0 && newVal[0].file) {

                        $timeout(function () {
                            console.log("********** inside watch 2nd console ****************", oldVal, newVal);
                            //  console.log(newVal.length);
                            _.each(newVal, function (newV, key) {
                                if (newV && newV.file) {
                                    $scope.uploadNow(newV);
                                }
                            });
                        }, 100);

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
                    } else {
                        if (_.endsWith($scope.model, ".pdf")) {
                            $scope.type = "pdf";
                        }
                    }

                }
                if (attrs.inobj || attrs.inobj === "") {
                    $scope.inObject = true;
                }
                $scope.clearOld = function () {
                    $scope.model = [];
                    $scope.uploadStatus = "removed";
                };
                $scope.removeImage = function (index) {
                    $scope.image = [];
                    $scope.model.splice(index, 1);
                    _.each($scope.model, function (n) {
                        $scope.image.push({
                            url: n
                        });
                    });
                }
                $scope.uploadNow = function (image) {


                    console.log("*********** Inside upload now function ************** & image data is:", image);
                    $scope.uploadStatus = "uploading";

                    var Template = this;
                    image.hide = true;
                    var formData = new FormData();
                    formData.append('file', image.file, image.file.name);
                    $http.post(uploadurl, formData, {
                        headers: {
                            'Content-Type': undefined
                        },
                        transformRequest: angular.identity
                    }).then(function (data) {

                        console.log("data is here", data);
                        data = data.data.data;
                        console.log("inside http success", data);

                        var sendFileObj = {
                            fileName: image.file.name,
                            fileType: image.file.type,
                            fileUrl: data[0]
                        };

                        console.log("################## final fie Object ##################", sendFileObj);

                        $scope.uploadStatus = "uploaded";
                        if ($scope.isMultiple) {
                            if ($scope.inObject) {
                                $scope.model.push({
                                    "image": data[0]
                                });

                                console.log("&&&&&&&&&&&& $scope.model &&&&&&&&&&&&&", $scope.model);
                            } else {
                                if (!$scope.model) {
                                    $scope.clearOld();
                                }

                                //  $scope.model.push(data[0]);
                                $scope.model.push(sendFileObj);
                                console.log("************ $scope.model **************", $scope.model);
                            }
                        } else {
                            if (_.endsWith(data[0], ".pdf")) {
                                $scope.type = "pdf";
                            } else {
                                $scope.type = "image";
                            }

                            $scope.model = data[0];
                            console.log($scope.model, 'model means blob');
                        }
                        $timeout(function () {
                            $scope.callback();
                        }, 100);
                    });
                };
            }
        };
    })