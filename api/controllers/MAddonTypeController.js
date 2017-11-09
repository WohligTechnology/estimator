module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getAddonMaterial: function (req, res) {
        if (req.body) {
            MAddonType.getAddonMaterial(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getMAddonTypeData: function (req, res) {
        if (req.body) {
            MAddonType.getMAddonTypeData(req.body, res.callback);
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
            MAddonType.search(req.body, res.callback);
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