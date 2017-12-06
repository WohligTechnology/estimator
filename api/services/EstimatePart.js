var schema = new Schema({
    partName: String,
    partIcon:String,
    partNumber: { // a1s1pX where a1 --> assembly name, s1 --> subAssemblyName, X is auto increasing number
        type: String
    },
    subAssemblyId: {
        type: Schema.Types.ObjectId,
        ref: "EstimateSubAssembly",
        index: true
        // key: 'subAssemblyParts'
    },
    shortcut: {
        type: Schema.Types.ObjectId,
        ref: "MPartPresets",
        index: true,
    },
    partType:{
        type: Schema.Types.ObjectId,
        ref: "MPartType",
        index: true,
    },
    material: {
        type: Schema.Types.ObjectId,
        ref: "MMaterial",
        index: true,
    },
    size: String,
    customMaterialId:{
        type: Schema.Types.ObjectId,
        ref: "MMaterial",
        index: true,
    },
    quantity: Number,
    variable: [{}], // Structure not defined yet    

    processing: [{
        type: Schema.Types.ObjectId,
        ref: "EstimateProcessing",
        index: true
    }],
    addons: [{
        type: Schema.Types.ObjectId,
        ref: "EstimateAddons",
        index: true
    }],
    extras: [{
        type: Schema.Types.ObjectId,
        ref: "EstimateExtras",
        index: true
    }],
    partObj: {},

    scaleFactor: Number, // it is %      
    finalCalculation: {
        materialPrice: Number,
        itemUnitPrice: Number,
        totalCostForQuantity: Number
    },
    keyValueCalculations: {
        perimeter: Number,
        sheetMetalArea: Number,
        surfaceArea: Number,
        weight: Number
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('EstimatePart', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    importEstimatePart: function (data, callback) {
        EstimatePart.findOne({
                partNumber: data.partNumber
            }).deepPopulate('processing addons extras')
            .lean().exec(function (err, found) {
                if (err) {
                    console.log('**** error at function_name of EstimatePart.js ****', err);
                    callback(err, null);
                } else if (_.isEmpty(found)) {
                    callback(null, 'noDataFound');
                } else {
                    delete found._id;
                    delete found.createdAt;
                    delete found.updatedAt;
                    delete found.__v;

                    async.parallel([
                        function (callback) {
                            async.eachSeries(found.addons, function (add, callback) {
                                delete add._id;
                                delete add.createdAt;
                                delete add.updatedAt;
                                delete add.__v;
                                callback();

                            }, function (err) {
                                if (err) {
                                    console.log('***** error at final response of async.eachSeries in function_name of EstimatePart.js*****', err);
                                } else {
                                    callback();
                                }
                            });
                        },
                        function (callback) {
                            async.eachSeries(found.processing, function (proc, callback) {
                                delete proc._id;
                                delete proc.createdAt;
                                delete proc.updatedAt;
                                delete proc.__v;
                                callback();

                            }, function (err) {
                                if (err) {
                                    console.log('***** error at final response of async.eachSeries in function_name of EstimatePart.js*****', err);
                                } else {
                                    callback();
                                }
                            });
                        },
                        function (callback) {
                            async.eachSeries(found.extras, function (ext, callback) {
                                delete ext._id;
                                delete ext.createdAt;
                                delete ext.updatedAt;
                                delete ext.__v;
                                callback();

                            }, function (err) {
                                if (err) {
                                    console.log('***** error at final response of async.eachSeries in function_name of EstimatePart.js*****', err);
                                } else {
                                    callback();
                                }
                            });

                        }
                    ], function () {
                        if (err) {
                            console.log('********** error at final response of async.parallel  EstimatePart.js ************', err);
                            callback(err, null);
                        } else {
                            callback(null, found);
                        }
                    });
                }
            });
    },
    getEstimatePartData: function (data, callback) {
        EstimatePart.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getEstimatePartData of EstimatePart.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    importPart: function (data, callback) {
        data.lastPartNumber = data.lastPartNumber.replace(/\d+$/, function (n) {
            return ++n
        });

        EstimatePart.findOne({
            partNumber: data.partNumber
        }).select('partObj').lean().exec(function (err, found) {
            delete found._id;
            if (err) {
                console.log('**** error at function_name of EstimatePart.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                var lastPartNumber = data.lastPartNumber;
                found.partObj.partNumber = lastPartNumber;

                var partProcessIndex = 1;
                var partAddonIndex = 1;
                var partExtraIndex = 1;
                async.waterfall([
                    function (callback) {
                        async.eachSeries(found.partObj.processing, function (partPro, callback) {
                            partPro.processingNumber = lastPartNumber + 'PR' + partProcessIndex;
                            partProcessIndex++;
                            callback();

                        }, function (err) {
                            if (err) {
                                console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                            } else {
                                callback();
                            }
                        });
                    },
                    function (callback) {
                        async.eachSeries(found.partObj.addons, function (subAssAdd, callback) {
                            subAssAdd.addonNumber = lastPartNumber + 'AD' + partAddonIndex;
                            partAddonIndex++;
                            callback();

                        }, function (err) {
                            if (err) {
                                console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                            } else {
                                callback();
                            }
                        });
                    },
                    function (callback) {
                        async.eachSeries(found.partObj.extras, function (subAssExt, callback) {
                            subAssExt.extraNumber = lastPartNumber + 'EX' + partExtraIndex;
                            partExtraIndex++;
                            callback();

                        }, function (err) {
                            if (err) {
                                console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                            } else {
                                callback();
                            }
                        });
                    },
                ], function () {
                    if (err) {
                        console.log('***** error at final response of async.waterfall in function_name of Components.js *****', err);
                    } else {
                        callback(null, found);
                    }
                });

            }

        });
    },

    getAllPartsNo: function (data, callback) {
        EstimatePart.find({},{
            partNumber:1
        }).lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of EstimatePart.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null,[]);
            } else {
                callback(null, found);
            }
        });
    },
};
module.exports = _.assign(module.exports, exports, model);