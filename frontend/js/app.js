// Link all the JS Docs here
var myApp = angular.module('myApp', [
    'ui.router',
    'pascalprecht.translate',
    'angulartics',
    'angulartics.google.analytics',
    'ui.bootstrap',
    'ngAnimate',
    'ngSanitize',
    'angular-flexslider',
    'ui.swiper',
    'angularPromiseButtons',
    'toastr',
    "oc.lazyLoad"
]);

// For Language JS
myApp.config(function ($translateProvider) {
    $translateProvider.translations('en', LanguageEnglish);
    $translateProvider.translations('hi', LanguageHindi);
    $translateProvider.preferredLanguage('en');
});


myApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

// AngularJS v1.3.x workaround for old style controller declarition in HTML
myApp.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
// 
myApp.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../frontend/themeassets',
        globalPath: '../frontend/themeassets/global',
        layoutPath: '../frontend/themeassets/layouts/layout',
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
myApp.controller('AppController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function () {
        App.initComponents(); // init core components
        Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
myApp.controller('HeaderController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
myApp.controller('SidebarController', ['$state', '$scope', function ($state, $scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar($state); // init sidebar
    });
}]);

/* Setup Layout Part - Quick Sidebar */
myApp.controller('QuickSidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        setTimeout(function () {
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
myApp.controller('ThemePanelController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
myApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);

/* Init global settings and run the app */
myApp.run(["$rootScope", "settings", "$state", function ($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);


// Define all the routes below
myApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    var tempateURL = "views/template/template.html"; //Default Template URL

    // for http request with session
    $httpProvider.defaults.withCredentials = true;
    $stateProvider

        .state('app', {
            abstract: true,
            url: "/app",
            templateUrl: "views/tpl/template.html",
            controller: "appCtrl"
        })

        // ********************************** login module ********************************** //
        .state('app.login', {
            url: "/login",
            views: {
                "sidebar": {
                    templateUrl: "views/tpl/sidebar.html",
                    controller: "SidebarController"
                },
                "mainView": {
                    templateUrl: "views/login/login.html",
                    controller: "loginCtrl"
                }
            }
        })

        // ******************************** dashboard module ******************************** //
        .state('app.dashboard', {
            url: "/dashboard",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'myApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            './themeassets/global/plugins/morris/morris.css',
                            './themeassets/global/plugins/morris/morris.min.js',
                            './themeassets/global/plugins/morris/raphael-min.js',
                            './themeassets/global/plugins/jquery.sparkline.min.js',
                            './themeassets/pages/scripts/dashboard.min.js',
                            // 'controllers/DashboardController.js',
                        ]
                    });
                }]
            },
            views: {
                "sidebar": {
                    templateUrl: "views/tpl/sidebar.html",
                    controller: "SidebarController"
                },
                "mainView": {
                    templateUrl: "views/dashboard.html",
                    controller: "DashboardController"
                }
            }
        })

        // ********************************* enquiry module ********************************* //
        .state('app.enquiry', {
            url: "/enquiry",
            views: {
                "sidebar": {
                    templateUrl: "views/tpl/sidebar.html",
                    controller: "SidebarController"
                },
                "mainView": {
                    templateUrl: "views/content/enquiry/allEnquies.html",
                    controller: "enquiryCtrl"
                }
            }
        })
        .state('app.createEnquiry', {
            url: "/enquiry/create",
            views: {
                "mainView": {
                    templateUrl: "views/content/enquiry/createOrEditEnquiry.html",
                    controller: "createOrEditEnquiryCtrl"
                }
            }
        })
        .state('app.editEnquiry', {
            url: "/enquiry/edit/:enquiryId",
            views: {
                "mainView": {
                    templateUrl: "views/content/enquiry/createOrEditEnquiry.html",
                    controller: "createOrEditEnquiryCtrl"
                }
            }
        })

        // ******************************** estimate module ******************************** //
        .state('app.estimate', {
            url: "/estimate",
            views: {
                "sidebar": {
                    templateUrl: "views/tpl/sidebar.html",
                    controller: "SidebarController"
                },
                "mainView": {
                    templateUrl: "views/content/estimate/allEstimates.html",
                    controller: "estimateCtrl"
                }
            }
        })
        .state('app.createEstimate', {
            url: "/estimate/create/:enquiryId",
            views: {
                "mainView": {
                    templateUrl: "views/content/estimate/createOrEditEstimate.html",
                    controller: "createOrEditEstimateCtrl"
                }
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'myApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            './themeassets/global/plugins/jstree/dist/themes/default/style.min.css',
                            './themeassets/global/plugins/jstree/dist/jstree.js',
                            './themeassets/pages/scripts/ui-tree.js'
                        ]
                    });
                }]
            }
        })
        .state('app.editEstimate', {
            url: "/estimate/edit/:estimateId",
            data: {
                isSidebActive: true
            },
            views: {
                "mainView": {
                    templateUrl: "views/createOrEditEstimate.html",
                    controller: "createOrEditEstimateCtrl"
                }
            },
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'myApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            './themeassets/global/plugins/jstree/dist/themes/default/style.min.css',
                            './themeassets/global/plugins/jstree/dist/jstree.js',
                            './themeassets/pages/scripts/ui-tree.js',
                        ]
                    });
                }]
            }
        })

        // ********************************** user module ********************************* //
        .state('app.users', {
            url: "/user",
            views: {
                "sidebar": {
                    templateUrl: "views/tpl/sidebar.html",
                    controller: "SidebarController"
                },
                "mainView": {
                    templateUrl: "views/content/user/allUsers.html",
                    controller: "userCtrl"
                }
            }
        })

        // ******************************** customer module ******************************* //
        .state('app.customer', {
            url: "/customer",
            views: {
                "sidebar": {
                    templateUrl: "views/tpl/sidebar.html",
                    controller: "SidebarController"
                },
                "mainView": {
                    templateUrl: "views/content/customer/allCustomers.html",
                    controller: "customerCtrl"
                }
            }
        })

        // ******************************** master module ******************************** // 

        .state('app.baseMatser', {
            url: "/master/baseMatser",
            views: {
                "sidebar": {
                    templateUrl: "views/tpl/sidebar.html",
                    controller: "SidebarController"
                },
                "mainView": {
                    templateUrl: "views/content/master/base/baseMatser.html",
                    controller: "baseMasterCtrl"
                }
            }
        })
        .state('app.masterAddon', {
            url: "/master/addon",
            views: {
                "sidebar": {
                    templateUrl: "views/tpl/sidebar.html",
                    controller: "SidebarController"
                },
                "mainView": {
                    templateUrl: "views/content/master/addon/masterAddon.html",
                    controller: "masterAddonCtrl"
                }
            }
        })
        .state('app.masterExtra', {
            url: "/master/extra",
            views: {
                "sidebar": {
                    templateUrl: "views/tpl/sidebar.html",
                    controller: "SidebarController"
                },
                "mainView": {
                    templateUrl: "views/content/master/extra/masterExtra.html",
                    controller: "masterExtraCtrl"
                }
            }
        })
        .state('app.masterMaterial', {
            url: "/master/material",
            views: {
                "mainView": {
                    templateUrl: "views/content/master/material/masterMaterial.html",
                    controller: "masterMaterialCtrl"
                }
            }
        })
        .state('app.masterPart', {
            url: "/master/part",
            views: {
                // "sidebar": {
                //     templateUrl: "views/tpl/sidebar.html",
                //     controller: "SidebarController"
                // },
                "mainView": {
                    templateUrl: "views/content/master/part/masterPart.html",
                    controller: "masterPartCtrl"
                }
            }
        })
        .state('app.masterProcess', {
            url: "/master/process",
            views: {
                "mainView": {
                    templateUrl: "views/content/master/process/masterProcess.html",
                    controller: "masterProcessCtrl"
                }
            }
        })
        .state('app.masterShape', {
            url: "/master/shape",
            views: {
                "mainView": {
                    templateUrl: "views/content/master/shape/masterShape.html",
                    controller: "masterShapeCtrl"
                }
            }
        })

        // ******************************** settings module ******************************** // 
        .state('app.settings', {
            url: "/settings",
            views: {
                "sidebar": {
                    templateUrl: "views/tpl/sidebar.html",
                    controller: "SidebarController"
                },
                "mainView": {
                    templateUrl: "",
                    controller: ""
                }
            }
        })









        // ******************************** extra unwanted states ************************ // 
        // delete all following states after complete the project

        // estimate
        .state("estimate", {
            url: "/estimate",
            templateUrl: "views/estimate.html",
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'myApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            './themeassets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            './themeassets/apps/css/todo-2.css',
                            './themeassets/global/plugins/select2/css/select2.min.css',
                            './themeassets/global/plugins/select2/css/select2-bootstrap.min.css',
                            './themeassets/global/plugins/select2/js/select2.full.min.js',
                            './themeassets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            './themeassets/apps/scripts/todo-2.min.js',
                            './themeassets/global/plugins/jstree/dist/themes/default/style.min.css',
                            './themeassets/global/plugins/jstree/dist/jstree.js',
                            './themeassets/pages/scripts/ui-tree.js',
                            // 'controllers/TodoController.js'
                        ]
                    });
                }]
            }
        })
        //estimate assembly
        .state('app.assembly', {
            url: "/assembly",
            views: {
                "sidebar": {
                    templateUrl: "views/tpl/sidebar.html",
                    controller: "SidebarController"
                },
                "mainView": {
                    templateUrl: "views/content/insideestimate/assembly.html",
                    controller: ""
                }
            }
        })
        //subasembly
        .state('app.subassembly', {
            url: "/subassembly",
            views: {
                "sidebar": {
                    templateUrl: "views/tpl/sidebar.html",
                    controller: "SidebarController"
                },
                "mainView": {
                    templateUrl: "views/content/insideestimate/subassembly.html",
                    controller: ""
                }
            }
        })
        //processing view
        .state('app.processing', {
            url: "/processing",
            views: {
                "sidebar": {
                    templateUrl: "views/tpl/sidebar.html",
                    controller: "SidebarController"
                },
                "mainView": {
                    templateUrl: "views/content/insideestimate/processing.html",
                    controller: ""
                }
            }
        })
        //part

        .state('app.part', {
            url: "/part",
            views: {
                "sidebar": {
                    templateUrl: "views/tpl/sidebar.html",
                    controller: "SidebarController"
                },
                "mainView": {
                    templateUrl: "views/content/insideestimate/part.html",
                    controller: ""
                }
            }
        })
        //addore
        .state('app.addons', {
            url: "/addons",
            views: {
                "sidebar": {
                    templateUrl: "views/tpl/sidebar.html",
                    controller: "SidebarController"
                },
                "mainView": {
                    templateUrl: "views/content/insideestimate/addons.html",
                    controller: ""
                }
            }
        })
        //extras
        .state('app.extras', {
            url: "/extras",
            views: {
                "sidebar": {
                    templateUrl: "views/tpl/sidebar.html",
                    controller: "SidebarController"
                },
                "mainView": {
                    templateUrl: "views/content/insideestimate/extras.html",
                    controller: ""
                }
            }
        })


        .state('enquiries', {
            url: "/enquiries",
            templateUrl: "views/enquiries.html",
            controller: "EnquiriesController",
        })
        //  .state('subasembly', {
        //     url: "/subasembly",
        //     templateUrl: "views/content/insideestimate/subasembly.html",
        //     controller: "",
        // })

        // Blank Page
        .state('blank', {
            url: "/blank",
            templateUrl: "views/blank.html",
            data: {
                pageTitle: 'Blank Page Template'
            },
            controller: "BlankController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'myApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'controllers/BlankController.js'
                        ]
                    });
                }]
            }
        })

        // AngularJS plugins
        .state('fileupload', {
            url: "/file_upload.html",
            templateUrl: "views/file_upload.html",
            data: {
                pageTitle: 'AngularJS File Upload'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'angularFileUpload',
                        files: [
                            './themeassets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        ]
                    }, {
                        name: 'myApp',
                        files: [
                            // 'controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // UI Select
        .state('uiselect', {
            url: "/ui_select",
            templateUrl: "views/ui_select.html",
            data: {
                pageTitle: 'AngularJS Ui Select'
            },
            controller: "UISelectController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'ui.select',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            './themeassets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            './themeassets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                        ]
                    }, {
                        name: 'myApp',
                        files: [
                            // 'controllers/UISelectController.js'
                        ]
                    }]);
                }]
            }
        })

        // UI Bootstrap
        .state('uibootstrap', {
            url: "/ui_bootstrap.html",
            templateUrl: "views/ui_bootstrap.html",
            data: {
                pageTitle: 'AngularJS UI Bootstrap'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'myApp',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Tree View
        .state('tree', {
            url: "/tree",
            templateUrl: "views/tree.html",
            data: {
                pageTitle: 'jQuery Tree View'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'myApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            './themeassets/global/plugins/jstree/dist/themes/default/style.min.css',
                            './themeassets/global/plugins/jstree/dist/jstree.js',
                            './themeassets/pages/scripts/ui-tree.js',
                            // 'controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Form Tools
        .state('formtools', {
            url: "/form-tools",
            templateUrl: "views/form_tools.html",
            data: {
                pageTitle: 'Form Tools'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'myApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            './themeassets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            './themeassets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            './themeassets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            './themeassets/global/plugins/typeahead/typeahead.css',

                            './themeassets/global/plugins/fuelux/js/spinner.min.js',
                            './themeassets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            './themeassets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            './themeassets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            './themeassets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            './themeassets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            './themeassets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            './themeassets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            './themeassets/global/plugins/typeahead/handlebars.min.js',
                            './themeassets/global/plugins/typeahead/typeahead.bundle.min.js',
                            './themeassets/pages/scripts/components-form-tools-2.min.js',

                            // 'controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Date & Time Pickers
        .state('pickers', {
            url: "/pickers",
            templateUrl: "views/pickers.html",
            data: {
                pageTitle: 'Date & Time Pickers'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'myApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            './themeassets/global/plugins/clockface/css/clockface.css',
                            './themeassets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            './themeassets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            './themeassets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            './themeassets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            './themeassets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            './themeassets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            './themeassets/global/plugins/clockface/js/clockface.js',
                            './themeassets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            './themeassets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            './themeassets/pages/scripts/components-date-time-pickers.min.js',

                            // 'controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Custom Dropdowns
        .state('dropdowns', {
            url: "/dropdowns",
            templateUrl: "views/dropdowns.html",
            data: {
                pageTitle: 'Custom Dropdowns'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'myApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            './themeassets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            './themeassets/global/plugins/select2/css/select2.min.css',
                            './themeassets/global/plugins/select2/css/select2-bootstrap.min.css',

                            './themeassets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            './themeassets/global/plugins/select2/js/select2.full.min.js',

                            './themeassets/pages/scripts/components-bootstrap-select.min.js',
                            './themeassets/pages/scripts/components-select2.min.js',

                            // 'controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // Advanced Datatables
        .state('datatablesmanaged', {
            url: "/datatables",
            templateUrl: "views/datatables/managed.html",
            data: {
                pageTitle: 'Advanced Datatables'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'myApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            './themeassets/global/plugins/datatables/datatables.min.css',
                            './themeassets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            './themeassets/global/plugins/datatables/datatables.all.min.js',
                            './themeassets/pages/scripts/table-datatables-managed.min.js',
                            // 'controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Ajax Datetables
        .state('datatablesajax', {
            url: "/datatables",
            templateUrl: "views/datatables/ajax.html",
            data: {
                pageTitle: 'Ajax Datatables'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'myApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            './themeassets/global/plugins/datatables/datatables.min.css',
                            './themeassets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            './themeassets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',

                            './themeassets/global/plugins/datatables/datatables.all.min.js',
                            './themeassets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            './themeassets/global/scripts/datatable.js',

                            'scripts/table-ajax.js',
                            // 'controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile
        .state("profile", {
            url: "/profile",
            templateUrl: "views/profile/main.html",
            data: {
                pageTitle: 'User Profile'
            },
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'myApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            './themeassets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            './themeassets/pages/css/profile.css',

                            './themeassets/global/plugins/jquery.sparkline.min.js',
                            './themeassets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            './themeassets/pages/scripts/profile.min.js',

                            // 'controllers/UserProfileController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/profileDashboard",
            templateUrl: "views/profile/dashboard.html",
            data: {
                pageTitle: 'User Profile'
            }
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: {
                pageTitle: 'User Account'
            }
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: {
                pageTitle: 'User Help'
            }
        })

        // Todo
        .state('todo', {
            url: "/todo",
            templateUrl: "views/todo.html",
            data: {
                pageTitle: 'Todo'
            },
            controller: "TodoController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'myApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            './themeassets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            './themeassets/apps/css/todo-2.css',
                            './themeassets/global/plugins/select2/css/select2.min.css',
                            './themeassets/global/plugins/select2/css/select2-bootstrap.min.css',
                            './themeassets/global/plugins/select2/js/select2.full.min.js',
                            './themeassets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            './themeassets/apps/scripts/todo-2.min.js',
                            // 'controllers/TodoController.js'
                        ]
                    });
                }]
            }
        });

    $urlRouterProvider.otherwise("/app");
    $locationProvider.html5Mode(isproduction);
});


myApp.directive('inputDate', function ($compile, $parse) {
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
});