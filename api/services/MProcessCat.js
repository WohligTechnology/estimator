var schema = new Schema({
    processCatName: {
        type: String,
        required: true
    },
    uom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MUom',
        required: true,
    },
    processItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MProcessItem'
    }]
});

schema.plugin(deepPopulate, {
    populate: {
        'processItems': {
            select: "processItemName rate"
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MProcessCat', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'processItems uom', 'processItems uom'));
var model = {

    //-Get all MProcessCatData records from MProcessCat table.
    getMProcessCatData: function (data, callback) {
        MProcessCat.find().deepPopulate('processItems uom').lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getMProcessCatData of MProcessCat.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    // req data --> _id?
    delRestrictionsMProcessCat: function (data, callback) {
        MProcessCat.findOne({
            _id: data._id
        }).lean().exec(function (err, processCatData) {
            if (err) {
                console.log('**** error at function_name of MProcessCat.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(processCatData)) {
                callback(null, 'noDataFound');
            } else {
                MProcessType.findOne({
                    processCat: data._id
                }).lean().exec(function (err, processTypeData) {
                    console.log('****processCatData processCatData ****', processCatData);
                    if (err) {
                        console.log('**** error at function_name of MProcessCat.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(processCatData)) {
                        async.parallel([
                            function (callback) {
                                MProcessItem.remove({
                                    _id: {
                                        $in: processCatData.processItems
                                    }
                                }).exec(function (err, found) {
                                    if (err) {
                                        console.log('**** error at function_name of MProcessCat.js ****', err);
                                        callback(err, null);
                                    } else if (_.isEmpty(found)) {
                                        callback(null, 'noDataFound');
                                    } else {
                                        callback(null, found);
                                    }
                                });
                            },
                            function (callback) {
                                MProcessCat.remove({
                                    _id: data._id
                                }).exec(function (err, found) {
                                    if (err) {
                                        console.log('**** error at function_name of MProcessCat.js ****', err);
                                        callback(err, null);
                                    } else if (_.isEmpty(found)) {
                                        callback(null, 'noDataFound');
                                    } else {
                                        callback(null, found);
                                    }
                                });
                            },
                        ], function (err, finalResults) {
                            if (err) {
                                console.log('********** error at final response of async.parallel  MProcessCat.js ************', err);
                                callback(err, null);
                            } else if (_.isEmpty(finalResults)) {
                                callback(null, 'noDataFound');
                            } else {
                                callback(null, 'Records deleted successfully');
                            }
                        });

                    } else {
                        callback(null, 'dependency of table MProcessType');
                    }
                });
            }
        });
    },
};
module.exports = _.assign(module.exports, exports, model);