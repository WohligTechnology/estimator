var schema = new Schema({
    partTypeCatName: {
        type: String
    },
    partTypes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MPartType',
        index: true
    }]

});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MPartTypeCat', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'partTypes', 'partTypes'));
var model = {

    //-Get All Master Part Type Cat. records from MPartTypeCat table. 
    getMPartTypeCatData: function (data, callback) {
        MPartTypeCat.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getMPartTypeCatData of MPartTypeCat.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    //- req data --> ? part type cat _id
    delRestrictionOfMPartTypeCat: function (data, callback) {
        MPartTypeCat.findOne({
            _id: data._id
        }).lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of MPartTypeCat.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                console.log('****found.partTypesfound.partTypes ****', found.partTypes);
                EstimatePart.find({
                    partType: found.partTypes
                }).lean().exec(function (err, partData) {
                    if (err) {
                        console.log('**** error at function_name of MPartTypeCat.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(partData)) {
                        async.parallel([
                            function (callback) {
                                MPartType.remove({
                                    _id: found.partTypes
                                }).exec(function (err, mPartTypeRemoved) {
                                    console.log('****part typeppp ****', mPartTypeRemoved);
                                    if (err) {
                                        console.log('**** error at function_name of MPartTypeCat.js ****', err);
                                        callback(err, null);
                                    } else if (_.isEmpty(mPartTypeRemoved)) {
                                        callback(null, 'noDataFound');
                                    } else {
                                        callback(null, mPartTypeRemoved);
                                    }
                                });
                            },
                            function (callback) {
                                MPartPresets.remove({
                                    partType: found.partTypes
                                }).exec(function (err, mPartPresetsRemoved) {
                                    if (err) {
                                        console.log('**** error at function_name of MPartTypeCat.js ****', err);
                                        callback(err, null);
                                    } else if (_.isEmpty(mPartPresetsRemoved)) {
                                        callback(null, 'noDataFound');
                                    } else {
                                        callback(null, mPartPresetsRemoved);
                                    }
                                });
                            },
                        ], function (err, finalResults) {
                            if (err) {
                                console.log('********** error at final response of async.parallel  MPartTypeCat.js ************', err);
                                callback(err, null);
                            } else if (_.isEmpty(finalResults)) {
                                callback(null, 'noDataFound');
                            } else {
                                callback(null, finalResults);
                            }
                        });
                    } else {
                        callback(null, 'dependecy of table estimate part');
                    }
                });
            }
        });
    },
};
module.exports = _.assign(module.exports, exports, model);