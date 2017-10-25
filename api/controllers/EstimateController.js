module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    importAssembly: function (req, res) {
        if (req.body) {
            Estimate.importAssembly(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    importSubAssembly: function (req, res) {
        if (req.body) {
            // please remove Controller.js from below line
            Estimate.importSubAssembly(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    importPart: function (req, res) {
        if (req.body) {
            // please remove Controller.js from below line
            Estimate.importPart(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    importProcessing: function (req, res) {
        if (req.body) {
            Estimate.importProcessing(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    importAddon: function (req, res) {
        if (req.body) {
            Estimate.importAddon(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    importExtra: function (req, res) {
        if (req.body) {
            Estimate.importExtra(req.body, res.callback);
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