module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    importAddon: function (req, res) {
        if (req.body) {
            EstimateAddons.importAddon(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getEstimateAddonsData: function (req, res) {
        if (req.body) {
            EstimateAddons.getEstimateAddonsData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getAllAddonsNo: function (req, res) {
        if (req.body) {
            EstimateAddons.getAllAddonsNo(req.body, res.callback);
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