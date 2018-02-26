var schema = new Schema({
    processItemName: {
        type: String
    },
    processCat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MProcessCat',
        required: true,
        key: "processItems"
    },
    rate: Number
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MProcessItem', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    //-Get All MProcess items records from MProcess Item table
    getMProcessItemData: function (data, callback) {
        MProcessItem.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getMProcessItemData of MProcessItem.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    // req data --> _id
    //- allow to delete restridction for mprocess type.
    delRestrictionMProcessItem: function (data, callback) {
        MProcessItem.findOne({
            _id: data._id
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of MProcessItem.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                EstimateProcessing.findOne({
                    processItem: data._id
                }).exec(function (err, proData) {
                    console.log('****proData ****', proData);
                    if (err) {
                        console.log('**** error at function_name of MProcessItem.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(proData)) {
                        async.parallel([
                            function (callback) {
                                MProcessCat.findOneAndUpdate({
                                    processItems: data._id
                                }, {
                                    $pull: {
                                        processItems: data._id
                                    },
                                }).exec(function (err, updatedProItem) {
                                    if (err) {
                                        console.log('**** error at function_name of MProcessItem.js ****', err);
                                        callback(err, null);
                                    } else if (_.isEmpty(updatedProItem)) {
                                        callback(null, []);
                                    } else {
                                        callback(null, updatedProItem);
                                    }
                                });
                            },
                            function (callback) {
                                MProcessItem.remove({
                                    _id: data._id
                                }).exec(function (err, mProcessItemRemoved) {
                                    if (err) {
                                        console.log('**** error at function_name of MProcessItem.js ****', err);
                                        callback(err, null);
                                    } else if (_.isEmpty(mProcessItemRemoved)) {
                                        callback(null, []);
                                    } else {
                                        callback(null, mProcessItemRemoved);
                                    }
                                });
                            }
                        ], function (err, finalResults) {
                            if (err) {
                                console.log('********** error at final response of async.parallel  MProcessItem.js ************', err);
                                callback(err, null);
                            } else if (_.isEmpty(finalResults)) {
                                callback(null, 'noDataFound');
                            } else {
                                callback(null, finalResults);
                            }
                        });
                    } else {
                        callback(null, 'dependecy of table estimate processing');
                    }
                });
            }
        });
    },
};
module.exports = _.assign(module.exports, exports, model);