module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    importSubAssembly: function (req, res) {
        if (req.body) {
            EstimateSubAssembly.importSubAssembly(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getSubAssemblyData: function (req, res) {
        if (req.body) {
            EstimateSubAssembly.getSubAssemblyData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getAllSubAssNo: function (req, res) {
        if (req.body) {
            EstimateSubAssembly.getAllSubAssNo(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getVersionsOfSubAssNo: function (req, res) {
        if (req.body) {
            EstimateSubAssembly.getVersionsOfSubAssNo(req.body, res.callback);
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