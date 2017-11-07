module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    compileEstimate: function (req, res) {
        if (req.body) {
            DraftEstimate.compileEstimate(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },

    createDraftEstimate: function (req, res) {
        if (req.body) {
            DraftEstimate.createDraftEstimate(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },

    getDraftEstimateData: function (req, res) {
        if (req.body) {
            DraftEstimate.getDraftEstimateData(req.body, res.callback);
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