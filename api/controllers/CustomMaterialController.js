module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getAllCustomMaterial: function (req, res) {
        if (req.body) {
            // please remove Controller.js from below line
            CustomMaterial.getAllCustomMaterial(req.body, res.callback);
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
