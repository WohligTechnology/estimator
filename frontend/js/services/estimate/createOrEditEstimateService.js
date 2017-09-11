myApp
    .service('createOrEditEstimateService', function ($http) {

        this.getEstimateData = function (callback) {
            var subAssembly = [{
                "_id": "1111111111111111111111111",
                "name": "subAssName 1",
                "part": [{
                    "_id": "2222222222222222222222222",
                    "name": "partName1"
                }, {
                    "_id": "2222222222222222222222222",
                    "name": "partName2"
                }]
            }, {
                "_id": "1111111111111111111111111",
                "name": "subAssName 2",
                "part": [{
                    "_id": "2222222222222222222222222",
                    "name": "partName1"
                }, {
                    "_id": "2222222222222222222222222",
                    "name": "partName2"
                }, {
                    "_id": "2222222222222222222222222",
                    "name": "partName3"
                }]
            }, {
                "_id": "1111111111111111111111111",
                "name": "subAssName 3",
                "part": [{
                    "_id": "2222222222222222222222222",
                    "name": "partName1"
                }]
            }];

            var estimateData = {
                "_id": "000000000000000000000000000",
                "subAssemblies": subAssembly
            }
            callback(estimateData);
        }

        this.estimateView = function (estimateView, callback) {
            getEstimateView = "../frontend/views/content/estimate/estimateViews/"+estimateView+".html";
            callback(getEstimateView);
        }
        this.estimateViewData = function (estimateView, getId, getLevelName, callback) {

            if (estimateView == 'assembly') {
                // get all subAssemblies from API
                var getAllSubAssemblies = [{}];
                callback();
            } else if (estimateView == 'subAssembly') {
                // get all parts from API
                var getAllParts = [{}];
                callback();
            } else if (estimateView == 'partDetail') {
                // get part all detail (with processing count, addons count & extras count) from API
                var getPartDetail = {};
                callback();
            } else if (estimateView == 'editPartItemDetail') {
                // get part Item detail only from API
                var getPartItemDetail = {};
                callback();
            } else if (estimateView == 'processing') {
                // get all processing of corresponding level (assembly, subAssembly & part) from API
                var getAllProcessing = [{}];
                callback();
            } else if (estimateView == 'addons') {
                // get all addons of corresponding level (assembly, subAssembly & part) from API
                var getAllAddons = [{}];
                callback();
            } else if (estimateView == 'extras') {
                // get all extras of corresponding level (assembly, subAssembly & part) from API
                var getAllEtras = [{}];
                callback();
            } else if (estimateView == 'customMaterial') {
                // get all custome materials of estimate from API
                var getAllCustomMaterial = [{}];
                callback();
            }

        }

        this.createSubAssemblyModal = function () {
            console.log('**** inside createSubAssemblyModal of createOrEditEstimateCtrl.js ****');
        }
        this.editAssembly = function () {
            console.log('**** inside editAssembly of createOrEditEstimateCtrl.js ****');
        }
        this.createEstimatePart = function () {
            console.log('**** inside createEstimatePart of createOrEditEstimateCtrl.js ****');
        }
        this.editSubAssembly = function () {
            console.log('**** inside editSubAssembly of createOrEditEstimateCtrl.js ****');
        }
        this.deleteSubAssembly = function () {
            console.log('**** inside deleteSubAssembly of createOrEditEstimateCtrl.js ****');
        }
        this.editEstimatePart = function () {
            console.log('**** inside editEstimatePart of createOrEditEstimateCtrl.js ****');
        }
        this.deleteEstimatePart = function () {
            console.log('**** inside deleteEstimatePart of createOrEditEstimateCtrl.js ****');
        }


    });