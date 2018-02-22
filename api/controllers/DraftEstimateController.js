module.exports = _.cloneDeep(require("sails-wohlig-controller"));

var controller = {
    compileEstimate: function (req, res) {
        if (req.body) {
            DraftEstimate.compileEstimate(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },

    createDraftEstimate: function (req, res) {
        if (req.body) {
            DraftEstimate.createDraftEstimate(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },

    getDraftEstimateData: function (req, res) {
        if (req.body) {
            DraftEstimate.getDraftEstimateData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getDraftEstimateCustomerName: function (req, res) {
        if (req.body) {
            DraftEstimate.getDraftEstimateCustomerName(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    generateDraftEstExcel: function (req, res) {
        if (req.body) {
            DraftEstimate.generateDraftEstExcel(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },


    checkEnquiryEstimate: function (req, res) {
        if (req.body) {
            // please remove Controller.js from below line
            DraftEstimate.checkEnquiryEstimate(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    generateDraftEstimateExcel: function (req, res) {
        if (req.body) {
            DraftEstimate.generateDraftEstimateExcel(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            });
        }
    },
    downloadDraftExcel: function (req, res) {
        var file = req.params.file;
        var path = require('path');
        path = path.resolve(".") + '/assets/importFormat/' + file;
        res.download(path, file, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('downloading successful');
            }
        });
    },

};
module.exports = _.assign(module.exports, controller);