module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    addPartTypeMaterial: function (req, res) {
        if (req.body) {
            MPartType.addPartTypeMaterial(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    addPartTypeProcessing: function (req, res) {
        if (req.body) {
            MPartType.addPartTypeProcessing(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    addPartTypeAddons: function (req, res) {
        if (req.body) {
            MPartType.addPartTypeAddons(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    addPartTypeExtras: function (req, res) {
        if (req.body) {
            MPartType.addPartTypeExtras(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    deletePartTypeMaterial: function (req, res) {
        if (req.body) {
            MPartType.deletePartTypeMaterial(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    deleteProcessingPartType: function (req, res) {
        if (req.body) {
            MPartType.deleteProcessingPartType(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    deleteAddonsPartType: function (req, res) {
        if (req.body) {
            MPartType.deleteAddonsPartType(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    deleteExtrasPartType: function (req, res) {
        if (req.body) {
            MPartType.deleteExtrasPartType(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getPartTypeData: function (req, res) {
        if (req.body) {
            MPartType.getPartTypeData(req.body, res.callback);
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