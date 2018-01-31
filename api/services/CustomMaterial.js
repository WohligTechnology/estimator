var schema = new Schema({
    customMaterialName: {
        type: String
    },
    estimateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estimate'
    },
    favourite: Boolean,
    customMaterialId: String,
    basePlate: {
        thickness: Number,
        baseMetal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MMaterial'
        },
        costOfDepRsPerKg: Number,
        costOfDepRsPerSm: Number
    },
    hardFacingAlloys: [{
        thickness: Number,
        alloy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MMaterial'
        },
        costOfDepRsPerKg: Number,
        costOfDepRsPerSm: Number
    }],
    difficultyFactor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MDifficultyFactor'
    }],
    density: {
        type: Number
    },
    rollingIndex: {
        type: Number
    },
    bendingIndex: {
        type: Number
    },
    fabrictionIndex: {
        type: Number
    },
    cuttingIndex: {
        type: Number
    },
    freeIssue: Boolean,
    totalCostRsPerKg: Number,
    totalCostRsPerSm: Number,
    thickness: String
});

schema.plugin(deepPopulate, {
    populate: {
        'difficultyFactor': {
            select: ''
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('CustomMaterial', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'difficultyFactor', 'difficultyFactor'));
var model = {

    // what this function will do ?
    // req data --> ?
    getAllCustomMaterial: function (data, callback) {
        CustomMaterial.find().deepPopulate('difficultyFactor').lean().exec(function (err, found) {

            if (err) {
                console.log('**** error at function_name of CustomMaterial.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {

                var index = 0;
                var finalResult = [];
                async.eachSeries(found, function (f, callback) {
                    MMaterial.findOne({
                        _id: f.basePlate.baseMetal
                    }).exec(function (err, baseMetal) {
                        if (err) {
                            console.log('**** error at function_name of CustomMaterial.js ****', err);
                            callback(err, null);
                        } else if (_.isEmpty(baseMetal)) {
                            callback(null, 'noDataFound');
                        } else {
                            f.basePlate.baseMetal = baseMetal;

                            var hardFacingAlloys = [];

                            async.eachSeries(f.hardFacingAlloys, function (a, callback) {
                                MMaterial.findOne({
                                    _id: a.alloy
                                }).exec(function (err, alloy) {
                                    if (err) {
                                        console.log('**** error at function_name of CustomMaterial.js ****', err);
                                        callback(err, null);
                                    } else if (_.isEmpty(alloy)) {
                                        callback(null, 'noDataFound');
                                    } else {
                                        a.alloy = alloy;
                                        hardFacingAlloys.push(a);
                                        callback();
                                    }
                                });
                            }, function (err) {
                                if (err) {
                                    console.log('***** error at final response of async.eachSeries in function_name of CustomMaterial.js*****', err);
                                } else {
                                    f.hardFacingAlloys = hardFacingAlloys;
                                    finalResult.push(f);
                                    callback();
                                }
                            });

                        }
                    });

                }, function (err) {
                    if (err) {
                        console.log('***** error at final response of async.eachSeries in function_name of CustomMaterial.js*****', err);
                    } else {
                        callback(null, finalResult);
                    }
                });
            }
        });
    },


    // what this function will do ?
    // req data --> ?
    createCustomMat: function (data, callback) {
        CustomMaterial.findOne().sort({
            createdAt: -1
        }).limit(1).lean().exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                data.customMaterialId = "cm1";
                CustomMaterial.saveData(data, function (err, savedData) {
                    if (err) {
                        callback(err, null);
                    } else if (_.isEmpty(savedData)) {
                        callback(null, 'noDataFound');
                    } else {
                        callback(null, savedData);
                    }
                });
            } else {
                if (data._id) {
                    data._id = data._id;
                } else {
                    var custMatNewId = found.customMaterialId;
                    custMatNewId = custMatNewId.replace(/\d+$/, function (n) {
                        return ++n
                    });
                    data.customMaterialId = custMatNewId;
                }

                CustomMaterial.saveData(data, function (err, savedData) {
                    if (err) {
                        console.log('**** error at function_name of Components.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(savedData)) {
                        callback(null, 'noDataFound');
                    } else {
                        callback(null, savedData);
                    }
                });

            }
        });
    },


    // what this function will do ?
    // req data --> ?
    getAllFavouriteCm: function (data, callback) {
        CustomMaterial.find({favourite:true}).exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of CustomMaterial.js ****', err);
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