module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getMProcessItemData: function (req, res) {
        if (req.body) {
            MProcessItem.getMProcessItemData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    delRestrictionMProcessItem: function (req, res) {
        if (req.body) {
            MProcessItem.delRestrictionMProcessItem(req.body, res.callback);
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