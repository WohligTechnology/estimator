var schema = new Schema({
    extraName: String,
    rate: {
        name: String,
        uom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MUom',
            required: true
        }
    }
});

schema.plugin(deepPopulate, {
    Populate: {
        'rate.uom': {
            select: ''
        },
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MExtra', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "rate.uom"));
var model = {

    //-Get All Master extra data from MExtra table.
    getMExtraData: function (data, callback) {
        MExtra.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getMExtraData of MExtra.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    //-Do the searching of MExtra table records on basis of extra Name with pagination.
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
                    fields: ['extraName'],
                    term: data.keyword
                }
            },
            sort: {
                desc: 'createdAt'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        MExtra.find({}).sort({
                createdAt: -1
            }).lean()
            .order(options)
            .keyword(options)
            .page(options,
                function (err, found) {
                    if (err) {
                        console.log('**** error at search of Enquiry.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(found)) {
                        callback(null, []);
                    } else {
                        var index = 0;
                        async.eachSeries(found.results, function (extraObj, callback) {
                                MUom.find({
                                    _id: extraObj.rate.uom
                                }).lean().exec(function (err, foundRateUomObj) {
                                    if (err) {
                                        console.log('**** error at rate uom of MProcessType.js ****', err);
                                    } else {
                                        found.results[index].rate.uom = foundRateUomObj;
                                        index++;
                                        callback();
                                    }
                                });
                            },
                            function (err) {
                                if (err) {
                                    console.log('***** error at final response of async.eachSeries in function_name of MProcessType.js*****', err);
                                } else {
                                    callback(null, found);
                                }
                            });
                    }
                });
    },

    //-Delete multiple Extra Records by passing multiple Extra Ids in format of array.
    deleteMultipleExtras: function (data, callback) {
        MExtra.remove({
            _id: {
                $in: data.idsArray
            }
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of MExtra.js ****', err);
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