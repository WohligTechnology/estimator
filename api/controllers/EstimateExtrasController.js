module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    importExtra: function (req, res) {
        if (req.body) {
            // please remove Controller.js from below line
            EstimateExtras.importExtra(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getEstimateExtraData: function (req, res) {
        if (req.body) {
            EstimateExtras.getEstimateExtraData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getAllExtrasNo: function (req, res) {
        if (req.body) {
            EstimateExtras.getAllExtrasNo(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getVersionsOfExtrassNo: function (req, res) {
        if (req.body) {
            EstimateExtras.getVersionsOfExtrassNo(req.body, res.callback);
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