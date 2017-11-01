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
};
module.exports = _.assign(module.exports, controller);