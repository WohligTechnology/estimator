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
    estimateVersion: {
        type: String,
    },
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('EstimateSubAssembly', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

getVersionsOfSubAssNo: function (data, callback) {
    EstimateSubAssembly.aggregate(
        [{
            $group: {
                _id: '$subAssemblyNumber',
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
                subAssemblyNumber: "",
                versionDetail: []
            };
            async.eachSeries(found, function (n, callback) {
                temp.push({
                    subAssemblyNumber: n._id,
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

importSubAssembly: function (data, callback) {
    data.lastAssemblyNumber = data.lastSubAssemblyNumber.replace(/\d+$/, function (n) {
        return ++n
    });

    EstimateSubAssembly.findOne({
        _id: data._id
    }).select('subAssemblyObj').lean().exec(function (err, found) {

        if (err) {
            console.log('**** error at importAssembly of Estimate.js ****', err);
            callback(err, null);
        } else if (_.isEmpty(found)) {
            callback(null, []);
        } else {
            delete found._id;
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
                    callback(null, found);
                }

            });
        }
    });
}

});
},

//-Get all sub Assembly records from Estimate Sub Assembly table.
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

    //-Get all sub assembly numbers only.
    getAllSubAssNo: function (data, callback) {
        EstimateSubAssembly.find({}, {
            subAssemblyNumber: 1
        }).lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of EstimateSubAssembly.js ****', err);
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