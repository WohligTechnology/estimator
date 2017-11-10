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
    subAssemblyObj: {},
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('EstimateSubAssembly', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    importEstimateSubAssembly: function (data, callback) {
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

    importSubAssembly: function (data, callback) {
        EstimateSubAssembly.findOne({
            subAssemblyNumber: data.subAssemblyNumber
        }).select('subAssemblyObj').lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at importAssembly of Estimate.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                var lastSubAssemblyNumber = data.lastSubAssemblyNumber;
                found.subAssemblyObj.subAssemblyNumber = lastSubAssemblyNumber;
                var partNumber = 1;
                async.eachSeries(found.subAssemblyObj.subAssemblyParts, function (part, callback) {
                    part.partNumber = lastSubAssemblyNumber + 'PT' + partNumber;
                    partNumber++;
                    var partProcessIndex = 1;
                    var partAddonIndex = 1;
                    var partExtraIndex = 1;

                    async.waterfall([
                        function (callback) {
                            async.eachSeries(part.processing, function (partPro, callback) {
                                partPro.processingNumber = part.partNumber + 'PR' + partProcessIndex;
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
                            async.eachSeries(part.addons, function (partAdd, callback) {
                                partAdd.addonNumber = part.partNumber + 'AD' + partAddonIndex;
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
                            async.eachSeries(part.extras, function (partExt, callback) {
                                partExt.extraNumber = part.partNumber + 'EX' + partExtraIndex;
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
                            var subAssProcessIndex = 1;
                            var subAssAddonIndex = 1;
                            var subAssExtraIndex = 1;
                            async.waterfall([
                                function (callback) {
                                    async.eachSeries(found.subAssemblyObj.processing, function (subAssPro, callback) {
                                        subAssPro.processingNumber = lastSubAssemblyNumber + 'PR' + subAssProcessIndex;
                                        subAssProcessIndex++;
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
                                    async.eachSeries(found.subAssemblyObj.addons, function (subAssAdd, callback) {
                                        subAssAdd.addonNumber = lastSubAssemblyNumber + 'AD' + subAssAddonIndex;
                                        subAssAddonIndex++;
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
                                    async.eachSeries(found.subAssemblyObj.extras, function (subAssExt, callback) {
                                        subAssExt.extraNumber = lastSubAssemblyNumber + 'EX' + subAssExtraIndex;
                                        subAssExtraIndex++;
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
                }, function (err) {
                    if (err) {
                        console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                    } else {
                        callback(found);
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