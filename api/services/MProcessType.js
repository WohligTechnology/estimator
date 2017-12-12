var schema = new Schema({
    processTypeName: {
        type: String,
        required: true
    },
    processCat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MProcessCat',
        required: true
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
    }
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
        MProcessType.findOne().lean().exec(function (err, myData) {
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
        MProcessType.find().populate({ 
            path: 'rate',
            populate: {
              path: 'uom',
              model: 'MUom'
            }
          }).exec(function (err, found) {
            if (err) {
                console.log('**** error at getProcessTypeData of MProcessType.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    //-Delete multiple process type from MProcess Type table by passing multiple MProcessType Ids.
    deleteMultipleProcessType: function (data, callback) {
        MProcessType.remove({
            _id:{
                $in:data.idsArray
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