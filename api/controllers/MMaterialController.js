module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getSubCatMaterials: function (req, res) {
        if (req.body) {
            MMaterial.getSubCatMaterials(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },

    getAllMaterials: function (req, res) {
        if (req.body) {
            // please remove Controller.js from below line
            MMaterial.getAllMaterials(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },

    updateAllSubCatMatType: function (req, res) {
        if (req.body) {
            MMaterial.updateAllSubCatMatType(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getAllMaterialsByMatType: function (req, res) {
        if (req.body) {
            MMaterial.getAllMaterialsByMatType(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    search: function (req, res) {
        if (req.body) {
            MMaterial.search(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    delRestrictions: function (req, res) {
        if (req.body) {
            MMaterial.delRestrictions(req.body, res.callback);
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