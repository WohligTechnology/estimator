module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    importProcessing: function (req, res) {
        if (req.body) {
            EstimateProcessing.importProcessing(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getEstimateProcessingData: function (req, res) {
        if (req.body) {
            EstimateProcessing.getEstimateProcessingData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getAllProcessingsNo: function (req, res) {
        if (req.body) {
            EstimateProcessing.getAllProcessingsNo(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    refIdDeleteRestrictions: function (req, res) {
        console.log('****!!!!!!!!!!! ****', req.body._id);
        EstimateProcessing.count({
                _id: req.body._id
            },
            (error, estProRecords) => {
                if (error) res.send(error);
                if (estProRecords >= 1) {
                    Estimate.count({
                            processing: req.body._id
                        },
                        (error, estimateLength) => {
                            if (error) res.send(error);
                            if (estimateLength < 1) {
                                EstimateSubAssembly.count({
                                    processing: req.body._id
                                }, (error, estimateLength) => {
                                    if (error) res.send(error);
                                    if (estimateLength < 1) {
                                        EstimateProcessing.remove({
                                            _id: req.body._id
                                        }, error => {
                                            if (error) res.send(error);
                                            res.json({
                                                message: 'EstimateProcessing successfully deleted.'
                                            });
                                        });
                                    } else {
                                        res.status(409).json({
                                            message: 'There are EstimateSubAssembly using the EstimateProcessing. Data could not be deleted'
                                        });
                                    }
                                });
                            } else {
                                res.status(409).json({
                                    message: 'There are Estimate using the EstimateProcessing. Data could not be deleted.'
                                });
                            }
                        });

                } else {
                    res.status(409).json({
                        message: 'No Records available.'
                    });
                }
            });
    },

};
module.exports = _.assign(module.exports, controller);