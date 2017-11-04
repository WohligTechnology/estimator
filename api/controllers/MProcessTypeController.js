module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getAllProcessType: function (req, res) {
        if (req.body) {
            MProcessType.getAllProcessType(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getProcessTypeItem: function (req, res) {
        if (req.body) {
            // please remove Controller.js from below line
            MProcessType.getProcessTypeItem(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getProcessTypeData: function (req, res) {
        if (req.body) {
            MProcessType.getProcessTypeData(req.body, res.callback);
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