module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getMPartTypeCatData: function (req, res) {
        if (req.body) {
            MPartTypeCat.getMPartTypeCatData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            });
        }
    },
    delRestrictionOfMPartTypeCat: function (req, res) {
        if (req.body) {
            MPartTypeCat.delRestrictionOfMPartTypeCat(req.body, res.callback);
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