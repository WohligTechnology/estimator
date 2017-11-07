var schema = new Schema({
    subAssemblyName: String,
    subAssemblyNumber: { //  a1sX where a1 --> assembly name, sX --> X is auto increasing number
        type: String
    },
    quantity: Number,
    totalValue: Number,
    keyValueCalculations: {
        perimeter: Number,
        sheetMetalArea: Number,
        surfaceArea: Number,
        weight: Number,
        numbers: Number,
        hours: Number
    },
    estimateId: { // two way data binding
        type: Schema.Types.ObjectId,
        ref: "Estimate",
        index: true
        // key: 'subAssemblies'
    },

    subAssemblyParts: [{
        type: Schema.Types.ObjectId,
        ref: "EstimatePart",
        index: true
    }],

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
    subAssemblyObj: {
        type: Object,
        index: true
    },
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('EstimateSubAssembly', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    importSubAssembly: function (data, callback) {
        EstimateSubAssembly.findOne({
                subAssemblyNumber: data.subAssemblyNumber
            }).deepPopulate('processing addons extras subAssemblyParts subAssemblyParts.processing subAssemblyParts.addons subAssemblyParts.extras')
            .lean().exec(function (err, found) {
                if (err) {
                    console.log('**** error at importSubAssembly of EstimateSubAssembly.js ****', err);
                    callback(err, null);
                } else if (_.isEmpty(found)) {
                    callback(null, 'noDataFound');
                } else {
                    delete found._id;
                    delete found.createdAt;
                    delete found.updatedAt;
                    delete found.__v;

                    async.eachSeries(found.subAssemblyParts, function (subAss, callback) {
                        delete subAss._id;
                        delete subAss.createdAt;
                        delete subAss.updatedAt;
                        delete subAss.__v;

                        async.parallel([
                            function (callback) {
                                async.eachSeries(subAss.processing, function (subAssPro, callback) {
                                    delete subAssPro._id;
                                    delete subAssPro.createdAt;
                                    delete subAssPro.updatedAt;
                                    delete subAssPro.__v;

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
                                async.eachSeries(subAss.addons, function (subAssAdd, callback) {
                                    delete subAssAdd._id;
                                    delete subAssAdd.createdAt;
                                    delete subAssAdd.updatedAt;
                                    delete subAssAdd.__v;

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
                                async.eachSeries(subAss.extras, function (subAssExt, callback) {
                                    delete subAssExt._id;
                                    delete subAssExt.createdAt;
                                    delete subAssExt.updatedAt;
                                    delete subAssExt.__v;

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
                                console.log('***** error at final response of async.parallel in function_name of Components.js *****', err);
                            } else {
                                callback();
                            }
                        });

                    }, function (err) {
                        if (err) {
                            console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                        } else {
                            async.parallel([
                                function (callback) {
                                    async.eachSeries(found.processing, function (assPro, callback) {
                                        delete assPro._id;
                                        delete assPro.createdAt;
                                        delete assPro.updatedAt;
                                        delete assPro.__v;

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
                                    async.eachSeries(found.addons, function (assAdd, callback) {
                                        delete assAdd._id;
                                        delete assAdd.createdAt;
                                        delete assAdd.updatedAt;
                                        delete assAdd.__v;

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
                                    async.eachSeries(found.extras, function (assExt, callback) {
                                        delete assExt._id;
                                        delete assExt.createdAt;
                                        delete assExt.updatedAt;
                                        delete assExt.__v;

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
                                    console.log('***** error at final response of async.parallel in function_name of Components.js *****', err);
                                } else {
                                    callback(null, found);
                                }
                            });
                        }
                    });

                }
            });
    },
    getSubAssemblyData: function (data, callback) {
        EstimateSubAssembly.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getSubAssemblyData of EstimateSubAssembly.js ****', err);
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