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
        mulFact: Number,
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
        mulfact: Number,
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

    // what this function will do ?
    // req data --> ?
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
                }).populate('processItems').select('processItems').exec(function (err, itemsData) {
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
};


module.exports = _.assign(module.exports, exports, model);