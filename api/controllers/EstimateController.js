module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    addSubAssembly: function (req, res) {
        if (req.body) {
            // please remove Controller.js from below line
            Estimate.addSubAssembly(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    updateSubAssembly: function (req, res) {
        if (req.body) {
            // please remove Controller.js from below line
            Estimate.updateSubAssembly(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },

    addSubAssemblyPart: function (req, res) {
        if (req.body) {
            // please remove Controller.js from below line
            Estimate.addSubAssemblyPart(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },

    updateSubAssemblyPart: function (req, res) {
        if (req.body) {
            // please remove Controller.js from below line
            Estimate.updateSubAssemblyPart(req.body, res.callback);
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