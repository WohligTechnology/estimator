var schema = new Schema({
    processTypeName: {
        type: String,
        required: true
    },
    showRateFields: Boolean,
    showQuantityFields: Boolean,
    processCat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MProcessCat'
    },
    rate: {
        mulFact: String,
        uom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MUom',
            required: true
        }
    },
    quantity: {
        linkedKeyValue: String,
        uom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MUom',
            required: true
        },
        mulfact: String,
        utilization: Number,
        contengncyOrWastage: Number,
        finalUom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MUom',
            required: true
        },
    },
    allowAtAssSubAss: Boolean
});

schema.plugin(deepPopulate, {
    Populate: {
        'processCat': {
            select: ''
        },
        'rate.uom': {
            select: ''
        },
        'quantity.uom': {
            select: ""
        },
        'quantity.finalUom': {
            select: ""
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MProcessType', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "processCat rate.uom quantity.uom, quantity.finalUom", "processCat rate.uom quantity.uom, quantity.finalUom"));
var model = {

    //- Search the MProcess type data by passing Process Type name.
    getAllProcessType: function (data, callback) {
        var maxRow = Config.maxRow;
        var page = 1;
        if (data.page) {
            page = data.page;
        }
        var field = data.field;
        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: ['name'],
                    term: data.keyword
                }
            },
            sort: {
                desc: 'createdAt'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        MProcessType.find({}).sort({
                createdAt: -1
            })
            .deepPopulate('processCat rate.uom quantity.uom, quantity.finalUom')
            .order(options)
            .keyword(options)
            .page(options,
                function (err, found) {
                    if (err) {
                        console.log('**** error at getAllProcessType of MProcessType ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(found)) {
                        callback(null, 'noDataFound');
                    } else {
                        callback(null, found);
                    }
                });
    },

    getProcessTypeItem: function (data, callback) {
        MProcessType.findOne({
            _id: data._id
        }).lean().exec(function (err, myData) {
            if (err) {
                console.log('**** error at function_name of MProcessType.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(myData)) {
                callback(null, []);
            } else {
                MProcessCat.findOne({
                    _id: myData.processCat
                }).deepPopulate('processItems').select('processItems').exec(function (err, itemsData) {
                    if (err) {
                        console.log('**** error at function_name of MProcessType.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(itemsData)) {
                        callback(null, []);
                    } else {
                        callback(null, itemsData);
                    }
                });
            }
        });
    },

    //- Get all process type data from MProcess Type table without pagination
    getProcessTypeData: function (data, callback) {
        if (data.allowAtAssSubAss) {
            var tempProObj = {
                allowAtAssSubAss: true
            }
        }else{
            var tempProObj = {};
        }
        MProcessType.find(tempProObj).lean().exec(function (err, found) {

            if (err) {
                console.log('**** error at getProcessTypeData of MProcessType.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                var index = 0;
                async.eachSeries(found, function (proType, callback) {
                    delete proType.createdAt;
                    delete proType.updatedAt;
                    delete proType.__v;
                    MUom.findOne({
                        _id: proType.rate.uom
                    }).exec(function (err, foundRateUom) {
                        if (err) {
                            console.log('**** error at rate uom of MProcessType.js ****', err);
                        } else {
                            found[index].rate.uom = foundRateUom;
                            MUom.findOne({
                                _id: proType.quantity.uom
                            }).exec(function (err, foundQuantityUom) {
                                if (err) {
                                    console.log('**** error at quantity uom of MProcessType.js ****', err);
                                } else {
                                    found[index].quantity.uom = foundQuantityUom;

                                    MUom.findOne({
                                        _id: proType.quantity.finalUom
                                    }).exec(function (err, foundQuantityFinalUom) {
                                        if (err) {
                                            console.log('**** error at quantity finalUom  of MProcessType.js ****', err);
                                        } else {
                                            found[index].quantity.finalUom = foundQuantityFinalUom;
                                            index++;
                                            callback();
                                        }
                                    });
                                }
                            });
                        }
                    });

                }, function (err) {
                    if (err) {
                        console.log('***** error at final response of async.eachSeries in function_name of MProcessType.js*****', err);
                    } else {
                        callback(null, found);
                    }
                });
            }
        });
    },

    //-Delete multiple process type from MProcess Type table by passing multiple MProcessType Ids.
    deleteMultipleProcessType: function (data, callback) {
        MProcessType.remove({
            _id: {
                $in: data.idsArray
            }
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at deleteMultipleProcessType of MProcessType.js ****', err);
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