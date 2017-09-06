myApp
    .service('createOrEditEstimateService', function ($http) {

        this.init = function () {
            this.estimateView = function (estimateView) {
                if (estimateView == 'estimateAssembly') {
                    getEstimateView = "../frontend/views/content/estimate/estimateViews/assembly.html";
                } else if (estimateView == 'estimateSubAssembly') {
                    getEstimateView = "../frontend/views/content/estimate/estimateViews/subAssembly.html";
                } else if (estimateView == 'estimatePart') {
                    getEstimateView = "../frontend/views/content/estimate/estimateViews/part.html";
                } else if (estimateView == 'estimateProcessing') {
                    getEstimateView = "../frontend/views/content/estimate/estimateViews/processing.html";
                } else if (estimateView == 'estimateAddons') {
                    getEstimateView = "../frontend/views/content/estimate/estimateViews/addons.html";
                } else if (estimateView == 'estimateExtras') {
                    getEstimateView = "../frontend/views/content/estimate/estimateViews/extras.html";
                } else if (estimateView == 'estimateCustomMaterial') {
                    getEstimateView = "../frontend/views/content/estimate/estimateViews/customMaterial.html";
                } else if (estimateView == 'estimatePartDetail') {
                    getEstimateView = "../frontend/views/content/estimate/estimateViews/partDetail.html";
                }

                return getEstimateView;
            }
            this.createSubAssemblyModal = function () {
                alert('**** inside createSubAssemblyModal of createOrEditEstimateCtrl.js ****');
            }
            this.editAssembly = function () {
                alert('**** inside editAssembly of createOrEditEstimateCtrl.js ****');
            }
            this.createEstimatePart = function () {
                alert('**** inside createEstimatePart of createOrEditEstimateCtrl.js ****');
            }
            this.editSubAssembly = function () {
                alert('**** inside editSubAssembly of createOrEditEstimateCtrl.js ****');
            }
            this.deleteSubAssembly = function () {
                alert('**** inside deleteSubAssembly of createOrEditEstimateCtrl.js ****');
            }
            this.editEstimatePart = function () {
                alert('**** inside editEstimatePart of createOrEditEstimateCtrl.js ****');
            }
            this.deleteEstimatePart = function () {
                alert('**** inside deleteEstimatePart of createOrEditEstimateCtrl.js ****');
            }
        }

        this.getEstimateData = function (callback) {
            var subAssembly = [{
                "name": "subAssName 1",
                "part": [{
                    "name": "partName1"
                }, {
                    "name": "partName2"
                }]
            }, {
                "name": "subAssName 2",
                "part": [{
                    "name": "partName1"
                }, {
                    "name": "partName2"
                }, {
                    "name": "partName3"
                }]
            }, {
                "name": "subAssName 3",
                "part": [{
                    "name": "partName1"
                }]
            }];
            callback(subAssembly);            
        }

        this.init();

    });