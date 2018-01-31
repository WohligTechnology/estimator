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

    saveImportedCustMat: function (req, res) {
        if (req.body) {
            // please remove Controller.js from below line
            var savedCustMats = [];
            async.eachSeries(req.body.cmArray, function (cmObj, callback) {

                CustomMaterial.createCustomMat(cmObj, function (err, data) {
                    console.log('**** inside function_name of CustomMaterialController.js ****',data);
                    savedCustMats.push(data);
                    callback();
                });

            }, function (err) {
                if (err) {
                    console.log('***** error at final response of async.eachSeries in function_name of CustomMaterialController.js*****', err);
                } else {
                    res.callback(null, savedCustMats);
                }
            });
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