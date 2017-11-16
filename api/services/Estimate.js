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
    assemblyObj: {},
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

    //- import assembly by passing assembly number
    //- import assembly by making deepPopulate all fileds & then send response after deletion of _id,_v etc..  from object
    importEstimateAssembly: function (data, callback) {
        Estimate.findOne({
                assemblyNumber: data.assemblyNumber
            }).deepPopulate('subAssemblies processing addons extras subAssemblies.subAssemblyParts subAssemblies.extras subAssemblies.addons subAssemblies.processing subAssemblies.subAssemblyParts.processing subAssemblies.subAssemblyParts.addons subAssemblies.subAssemblyParts.extras')
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
                                async.eachSeries(subAss.subAssemblyParts, function (part, callback) {
                                    delete part._id;
                                    delete part.createdAt;
                                    delete part.updatedAt;
                                    delete part.__v;

                                    async.parallel([
                                        function (callback) {
                                            async.eachSeries(part.processing, function (partPro, callback) {
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

    importAssembly: function (data, callback) {
        data.lastAssemblyNumber = data.lastAssemblyNumber.replace(/\d+$/, function (n) {
            return ++n
        });

        Estimate.findOne({
            assemblyNumber: data.assemblyNumber
        }).select('assemblyObj').lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at importAssembly of Estimate.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {

                var lastAssemblyNumber = data.lastAssemblyNumber;
                found.assemblyObj.assemblyNumber = lastAssemblyNumber;
                var subAssNumber = 1;

                async.eachSeries(found.assemblyObj.subAssemblies, function (subAss, callback) {
                    subAss.subAssemblyNumber = lastAssemblyNumber + 'SA' + subAssNumber;
                    subAssNumber++;
                    var subAssProcessIndex = 1;
                    var subAssAddonIndex = 1;
                    var subAssExtraIndex = 1;

                    // subAssemblies  PAE
                    async.waterfall([
                        function (callback) {
                            async.eachSeries(subAss.processing, function (subAssPro, callback) {
                                subAssPro.processingNumber = subAss.subAssemblyNumber + 'PR' + subAssProcessIndex;
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
                            async.eachSeries(subAss.addons, function (subAssAdd, callback) {
                                subAssAdd.addonNumber = subAss.subAssemblyNumber + 'AD' + subAssAddonIndex;
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
                            async.eachSeries(subAss.extras, function (subAssExt, callback) {
                                subAssExt.extraNumber = subAss.subAssemblyNumber + 'EX' + subAssExtraIndex;
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
                            var partNumber = 1;
                            var partProcessIndex = 1;
                            var partAddonIndex = 1;
                            var partExtraIndex = 1;

                            async.eachSeries(subAss.subAssemblyParts, function (part, callback) {

                                part.partNumber = subAss.subAssemblyNumber + 'PT' + partNumber;

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
                                        console.log('***** error at final response of async.waterfall all in function_name of Components.js *****', err);
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
                        var assProcessIndex = 1;
                        var assAddonIndex = 1;
                        var assExtraIndex = 1;
                        async.waterfall([
                            function (callback) {
                                async.eachSeries(found.assemblyObj.processing, function (assPro, callback) {
                                    assPro.processingNumber = lastAssemblyNumber + 'PR' + assProcessIndex;
                                    assProcessIndex++;
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
                                async.eachSeries(found.assemblyObj.addons, function (assAdd, callback) {
                                    assAdd.addonNumber = lastAssemblyNumber + 'AD' + assAddonIndex;
                                    assAddonIndex++;
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
                                async.eachSeries(found.assemblyObj.extras, function (assExt, callback) {
                                    assExt.extraNumber = lastAssemblyNumber + 'EX' + assExtraIndex;
                                    assExtraIndex++;
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
        if (data.totalRecords) {
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
                    fields: ['assemblyName', 'assemblyNumber'],
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
    getAllAssembliesNo: function (data, callback) {
        Estimate.find({}, {
            assemblyNumber: 1
        }).lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getAllAssembliesNo of Estimate.js ****', err);
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