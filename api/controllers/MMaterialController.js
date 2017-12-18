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
    deleteMultipleModelRecords: function (req, res) {
        console.log('****!!!!!!!!!!!!!!! ****', req);
        if (req.body) {
            var modelName = req.options.model + req.options.model.slice(1);
                    
            // console.log('**** !!!!!!!!!!!!!!!****', data);
            // var modelName = req.url.split("/").pop();
            console.log('****%%%%%%%%%%% ****', modelName);
            var myModel = modelName
            this[modelName].findOne({
                _id: req.body._id
            }).exec(function (err, found) {
                if (err) {
                    console.log('**** error at deleteMultipleMaterials of Material.js ****', err);
                    res.callback(err, null);
                } else if (_.isEmpty(found)) {
                    res.callback(null, 'no data found');
                } else {
                    res.callback(null, found);
                }
            });
        }
        // MMaterial.deleteMultipleModelRecords(req.body, req.originalUrl, res.callback);
        else {
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