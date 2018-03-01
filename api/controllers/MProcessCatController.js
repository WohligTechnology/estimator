module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getMProcessCatData: function (req, res) {
        if (req.body) {
            MProcessCat.getMProcessCatData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            });
        }
    },
    delRestrictionsMProcessCat: function (req, res) {
        if (req.body) {
            MProcessCat.delRestrictionsMProcessCat(req.body, res.callback);
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