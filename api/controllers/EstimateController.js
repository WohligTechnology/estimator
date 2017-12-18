module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    importAssembly: function (req, res) {
        if (req.body) {
            Estimate.importAssembly(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    generateAsseblyNumber: function (req, res) {
        if (req.body) {
            Estimate.generateAsseblyNumber(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getEstimateData: function (req, res) {
        if (req.body) {
            Estimate.getEstimateData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },

    search: function (req, res) {
        if (req.body) {
            // please remove Controller.js from below line
            Estimate.search(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getAllUniqueAssembliesNo: function (req, res) {
        if (req.body) {
            Estimate.getAllUniqueAssembliesNo(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getEstimateVersion: function (req, res) {
        if (req.body) {
            Estimate.getEstimateVersion(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getAllEstimateVersionOnAssemblyNo: function (req, res) {
        if (req.body) {
            Estimate.getAllEstimateVersionOnAssemblyNo(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
};
module.exports = _.assign(module.exports, controller);