module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    importPart: function (req, res) {
        if (req.body) {
            EstimatePart.importPart(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getEstimatePartData: function (req, res) {
        if (req.body) {
            EstimatePart.getEstimatePartData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getAllPartsNo: function (req, res) {
        if (req.body) {
            EstimatePart.getAllPartsNo(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getVersionsOfPartNo: function (req, res) {
        if (req.body) {
            EstimatePart.getVersionsOfPartNo(req.body, res.callback);
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