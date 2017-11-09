module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getMExtraData: function (req, res) {
        if (req.body) {
            MExtra.getMExtraData(req.body, res.callback);
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
            MExtra.search(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    deleteMultipleExtras: function (req, res) {
        if (req.body) {
            MExtra.deleteMultipleExtras(req.body, res.callback);
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