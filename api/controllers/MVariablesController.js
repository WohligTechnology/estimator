module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getAllVarId: function (req, res) {
        if (req.body) {
            // please remove Controller.js from below line
            MVariables.getAllVarId(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getMVariableData: function (req, res) {
        if (req.body) {
            MVariables.getMVariableData(req.body, res.callback);
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