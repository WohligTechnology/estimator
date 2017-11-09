// estimate collection schema
var schema = new Schema({
    enquiryId: {
        type: Schema.Types.ObjectId,
        ref: "Enquiry",
        index: true
    },
    assemblyName: {
        type: String,
        required: true
    },
    assemblyNumber: { //  start with a + X where X is increasing numbers
        type: String
    },
    keyValueCalculations: {
        perimeter: Number,
        sheetMetalArea: Number,
        surfaceArea: Number,
        weight: Number,
        numbers: Number,
        hours: Number
    },
    totalWeight: Number,
    materialCost: Number,
    processingCost: Number,
    addonCost: Number,
    extrasCost: Number,
    totalCost: Number,
    draftEstimateId: { // corresponding draft estimate --> _id
        type: Schema.Types.ObjectId,
        ref: "DraftEstimate",
        index: true
    },
    estimateCreatedUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    estimateUpdatedUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    estimateDetails: {}, // not defined yet
    estimateBoq: {},
    estimateAttachment: [{
        file: String
    }],

    subAssemblies: [{
        type: Schema.Types.ObjectId,
        ref: "EstimateSubAssembly",
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
    assemblyObj: {
        type: Object,
        index: true
    },
    estimateVersion: {
        type: String,
        index: true
    },
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Estimate', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    removeUnwantedField: function (data, callback) {
        delete data._id;
        delete data.createdAt;
        delete data.updatedAt;
        delete data.__v;
        callback(data)
    },

    // import assembly by passing assembly number
    importAssembly: function (data, callback) {
        Estimate.findOne({
                assemblyNumber: data.assemblyNumber
            }).deepPopulate('subAssemblies proccessing addons extras subAssemblies.subAssemblyParts subAssemblies.extras subAssemblies.addons subAssemblies.proccessing subAssemblies.subAssemblyParts.proccessing subAssemblies.subAssemblyParts.addons subAssemblies.subAssemblyParts.extras')
            .lean().exec(function (err, found) {
                if (err) {
                    console.log('**** error at importAssembly of Estimate.js ****', err);
                    callback(err, null);
                } else if (_.isEmpty(found)) {
                    callback(null, 'noDataFound');
                } else {
                    delete found._id;
                    delete found.createdAt;
                    delete found.updatedAt;
                    delete found.__v;

                    console.log('**** inside success of find of Estimate.js ****', found);

                    async.eachSeries(found.subAssemblies, function (subAss, callback) {
                        delete subAss._id;
                        delete subAss.createdAt;
                        delete subAss.updatedAt;
                        delete subAss.__v;
                        console.log('**** inside success of subAss of Estimate.js ****', subAss);

                        async.parallel([
                            function (callback) {
                                async.eachSeries(subAss.proccessing, function (subAssPro, callback) {
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
                                async.eachSeries(subAss.subAssemblyParts, function (part, callback) {
                                    delete part._id;
                                    delete part.createdAt;
                                    delete part.updatedAt;
                                    delete part.__v;

                                    async.parallel([
                                        function (callback) {
                                            async.eachSeries(part.proccessing, function (partPro, callback) {
                                                delete partPro._id;
                                                delete partPro.createdAt;
                                                delete partPro.updatedAt;
                                                delete partPro.__v;

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
                                                delete partAdd._id;
                                                delete partAdd.createdAt;
                                                delete partAdd.updatedAt;
                                                delete partAdd.__v;

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
                                                delete partExt._id;
                                                delete partExt.createdAt;
                                                delete partExt.updatedAt;
                                                delete partExt.__v;

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
                                            console.log('***** error at final response of async.parallel all in function_name of Components.js *****', err);
                                        } else {
                                            callback();
                                        }
                                    });

                                }, function (err) {
                                    if (err) {
                                        console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                    } else {
                                        callback();
                                    }
                                });
                            }
                        });

                    }, function (err) {
                        if (err) {
                            console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                        } else {
                            async.parallel([
                                function (callback) {
                                    async.eachSeries(found.proccessing, function (assPro, callback) {
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

    getEstimateData: function (data, callback) {
        Estimate.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getEstimateData of Estimate.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    search: function (data, callback) {
        var maxRow = 10;
        if(data.totalRecords){
            maxRow = data.totalRecords;
        }
        var page = 1;
        if (data.page) {
            page = data.page;
        }
        var field = data.field;
        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: ['assemblyName','assemblyNumber'],
                    term: data.keyword
                }
            },
            sort: {
                desc: 'createdAt'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        Estimate.find({}).sort({
                createdAt: -1
            })
            .order(options)
            .keyword(options)
            .page(options,
                function (err, found) {
                    if (err) {
                        console.log('**** error at search of Estimate.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(found)) {
                        callback(null, 'noDataFound');
                    } else {
                        callback(null, found);
                    }
                });
    },

};
module.exports = _.assign(module.exports, exports, model);