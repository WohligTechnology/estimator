module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    getPresetSizes: function (req, res) {
        if (req.body) {
            MPartPresets.getPresetSizes(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getPresetMaterials: function (req, res) {
        if (req.body) {
            MPartPresets.getPresetMaterials(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    addMaterial: function (req, res) {
        if (req.body) {
            MPartPresets.addMaterial(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getMPartPresetData: function (req, res) {
        if (req.body) {
            MPartPresets.getMPartPresetData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getPresetsShapeAndPartType: function (req, res) {
        if (req.body) {
            MPartPresets.getPresetsShapeAndPartType(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getAllPartPresetsData: function (req, res) {
        if (req.body) {
            MPartPresets.getAllPartPresetsData(req.body, res.callback);
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