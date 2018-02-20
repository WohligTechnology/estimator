var schema = new Schema({
    processingLevel: {
        type: String,
        enum: ['estimate', 'subAssembly', 'part'],
        default: 'estimate'
    },
    showRateFields: Boolean,
    showQuantityFields: Boolean,
    processingLevelId: {
        type: String,
        required: true
    },
    processingNumber: {
        type: String,
        required: true
    },
    processType: {
        type: Schema.Types.ObjectId,
        ref: "MProcessType",
        index: true,
    },
    processItem: {
        type: Schema.Types.ObjectId,
        ref: "MProcessItem",
        index: true,
    },
    rate: Number,
    quantity: {
        linkedKeyValue: {
            keyVariable: String,
            keyValue: String
        },
        utilization: Number,
        contengncyOrWastage: Number,
        totalQuantity: Number
    },
    totalCost: Number,
    remark: String,
    processingObj: {},
    estimateVersion: {
        type: String,
    },
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('EstimateProcessing', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getVersionsOfProcessingNo: function (data, callback) {
        EstimateProcessing.aggregate(
            [{
                $group: {
                    _id: '$processingNumber',
                    versionDetail: {
                        $push: {
                            versionNumber: "$estimateVersion",
                            _id: "$_id"
                        }
                    }
                },
            }]
        ).exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of Estimate.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                var temp = [];
                var tempObj = {
                    processingNumber: "",
                    versionDetail: []
                };
                async.eachSeries(found, function (n, callback) {
                    temp.push({
                        processingNumber: n._id,
                        versionDetail: n.versionDetail
                    });
                    callback();

                }, function (err) {
                    if (err) {
                        console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                    } else {
                        callback(null, temp);
                    }
                });
            }
        });
    },

    importProcessing: function (data, callback) {
        data.lastProcessingNumber = data.lastProcessingNumber.replace(/\d+$/, function (n) {
            return ++n;
        });
        EstimateProcessing.findOne({
            _id: data._id
        }).deepPopulate('processType processItem').lean().exec(function (err, found) {
            // console.log('****hhhhhhhhhhhhhhh ****',found);
            if (err) {
                console.log('**** error at importProcessing of EstimateProcessing.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                MUom.findOne({
                    _id: found.processType.rate.uom
                }).exec(function (err, foundRateUom) {
                    if (err) {
                        console.log('**** error at rate uom of MProcessType.js ****', err);
                    } else {
                        found.processType.rate.uom = foundRateUom;
                        MUom.findOne({
                            _id: found.processType.quantity.uom
                        }).exec(function (err, foundQuantityUom) {
                            console.log('****foundQuantityFinalUom ****',foundQuantityUom);
                            if (err) {
                                console.log('**** error at rate uom of MProcessType.js ****', err);
                            } else {
                                found.processType.quantity.uom = foundQuantityUom;
                                MUom.findOne({
                                    _id: found.processType.quantity.finalUom
                                }).exec(function (err, foundQuantityFinalUom) {
                                    if (err) {
                                        console.log('**** error at quantity uom of MProcessType.js ****', err);
                                    } else {
                                        found.processType.quantity.finalUom = foundQuantityFinalUom;
                                        MUom.findOne({
                                            _id: found.processType.quantity.linkedKeyUom
                                        }).exec(function (err, foundQuantitylinkedKeyUom) {
                                            if (err) {
                                                console.log('**** error at quantity finalUom  of MProcessType.js ****', err);
                                            } else {
                                                found.processType.quantity.linkedKeyUom = foundQuantitylinkedKeyUom;
                                                var lastProcessingNumber = data.lastProcessingNumber;
                                                found.processingNumber = lastProcessingNumber;
                                                Estimate.removeUnwantedField(found, function (finalData) {
                                                    console.log('**** inside function_name of EstimateProcessing.js ****');
                                                    callback(null, finalData);
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

    },

    //-Get all estimate processing records from Estimate Processing table.
    getEstimateProcessingData: function (data, callback) {
        EstimateProcessing.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getEstimateProcessingData of EstimateProcessing.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });

    },

    //-Get all estimate processing nos only from Estimate Processing table.
    getAllProcessingsNo: function (data, callback) {
        EstimateProcessing.find({}, {
            processingNumber: 1
        }).lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of EstimateProcessing.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },
};
module.exports = _.assign(module.exports, exports, model);