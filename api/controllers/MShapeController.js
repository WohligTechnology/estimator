module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getMShapeData: function (req, res) {
        if (req.body) {
            MShape.getMShapeData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    delRestrictionsMultiDeletionMShape: function (req, res) {
        if (req.body) {
            MShape.delRestrictionsMultiDeletionMShape(req.body, res.callback);
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