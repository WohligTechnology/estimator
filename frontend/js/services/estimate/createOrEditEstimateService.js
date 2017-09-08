myApp
    .service('createOrEditEstimateService', function ($http) {

        this.estimateView = function (estimateView, callback) {
            if (estimateView == 'estimateAssembly') {
                getEstimateView = "../frontend/views/content/estimate/estimateViews/assembly.html";
            } else if (estimateView == 'estimateSubAssembly') {
                getEstimateView = "../frontend/views/content/estimate/estimateViews/subAssembly.html";
            } else if (estimateView == 'estimatePartDetail') {
                getEstimateView = "../frontend/views/content/estimate/estimateViews/partDetail.html";
            } else if (estimateView == 'estimatePartItemDetail') {
                getEstimateView = "../frontend/views/content/estimate/estimateViews/editPartItemDetail.html";
            } else if (estimateView == 'estimateProcessing') {
                getEstimateView = "../frontend/views/content/estimate/estimateViews/processing.html";
            } else if (estimateView == 'estimateAddons') {
                getEstimateView = "../frontend/views/content/estimate/estimateViews/addons.html";
            } else if (estimateView == 'estimateExtras') {
                getEstimateView = "../frontend/views/content/estimate/estimateViews/extras.html";
            } else if (estimateView == 'estimateCustomMaterial') {
                getEstimateView = "../frontend/views/content/estimate/estimateViews/customMaterial.html";
            }

            callback(getEstimateView);
        }
        this.estimateViewData = function(estimateView,getId,getLevelName, callback){
            console.log('**** inside estimateViewData of createOrEditEstimateCtrl.js ****');
            if (estimateView == 'estimateAssembly') {
                
            } else if (estimateView == 'estimateSubAssembly') {
                
            } else if (estimateView == 'estimatePartDetail') {
                
            } else if (estimateView == 'estimatePartItemDetail') {
                
            } else if (estimateView == 'estimateProcessing') {
                
            } else if (estimateView == 'estimateAddons') {
                
            } else if (estimateView == 'estimateExtras') {
                
            } else if (estimateView == 'estimateCustomMaterial') {
                
            }

            callback();
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
    });