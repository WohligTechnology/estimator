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

};
module.exports = _.assign(module.exports, controller);