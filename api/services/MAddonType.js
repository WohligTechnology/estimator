var schema = new Schema({
    addonTypeName: {
        type: String,
        required: true
    },
    materialCat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MMaterialCat'
    },
    materialSubCat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MMaterialSubCat'
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
        additionalInput: String, // additional input
        additionalInputUom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MUom',
            required: true
        },
        linkedKey: String,
        linkedKeyUom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MUom',
            required: true
        },
        mulFact: String,
        percentageUse: Number,
        finalUom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MUom',
            required: true
        }

    },
    remarks: {
        type: String
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MAddonType', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'materialCat materialCat.subCat materialSubCat rate.uom quantity.additionalInputUom quantity.linkedKeyUom quantity.finalUom', 'materialCat materialCat.subCat materialSubCat rate.uom quantity.additionalInputUom quantity.linkedKeyUom quantity.finalUom'));
var model = {

    //-Get all addon materials for single document of MAddon Type table.
    getAddonMaterial: function (data, callback) {
        MAddonType.findOne({
            _id: data._id
        }).lean().exec(function (err, myData) {
            if (err) {
                console.log('**** error at getAddonMaterial of MAddonType.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(myData)) {
                callback(null, []);
            } else {
                MMaterialSubCat.findOne({
                    _id: myData.materialSubCat
                }).populate('materials').select('materials').exec(function (err, finalResult) {
                    if (err) {
                        console.log('**** error at function_name of MAddonType.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(finalResult)) {
                        callback(null, []);
                    } else {
                        callback(null, finalResult);
                    }
                });
            }

        });
    },

    //-get all master addon type records from MAddonType table.
    getMAddonTypeData: function (data, callback) {
        MAddonType.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getMAddonTypeData of MAddonType.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    //-Search the MAddon Type records on basis of addon type name with pagination.
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
                    fields: ['addonTypeName'],
                    term: data.keyword
                }
            },
            sort: {
                desc: 'createdAt'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        MAddonType.find({}).sort({
                createdAt: -1
            })
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
                        callback(null, found);
                    }
                });
    },

    //-Delete multiple records from table MAddon type by passing multiple MAddon Type Ids.
    deleteMultipleAddonsType: function (data, callback) {
        MAddonType.remove({
            _id: {
                $in: data.idsArray
            }
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at deleteMultipleAddonsType of MAddonType.js ****', err);
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