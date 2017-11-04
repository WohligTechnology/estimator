module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getMExtraPresetData: function (req, res) {
        if (req.body) {
            MExtrasPreset.getMExtraPresetData(req.body, res.callback);
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