var schema = new Schema({
    customMaterialName: {
        type: String
    },
    uniqueId: String,
    basePlate: {
        thickness: Number,
        baseMetal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MMaterial'
        },
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
    difficultyFactor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MDifficultyFactor'
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

};
module.exports = _.assign(module.exports, exports, model);