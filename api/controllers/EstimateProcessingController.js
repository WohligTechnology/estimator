module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    importProcessing: function (req, res) {
        if (req.body) {
            EstimateProcessing.importProcessing(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getEstimateProcessingData: function (req, res) {
        if (req.body) {
            EstimateProcessing.getEstimateProcessingData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getAllProcessingsNo: function (req, res) {
        if (req.body) {
            EstimateProcessing.getAllProcessingsNo(req.body, res.callback);
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