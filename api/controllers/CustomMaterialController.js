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

    createCustomMat: function (req, res) {
        if (req.body) {
            CustomMaterial.createCustomMat(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },

    getAllFavouriteCm: function (req, res) {
        if (req.body) {
            // please remove Controller.js from below line
            CustomMaterial.getAllFavouriteCm(req.body, res.callback);
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