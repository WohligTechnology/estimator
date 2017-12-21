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

    //- Get all addon type data from MAddon Type table without pagination.
    getAllMAddonTypeOfMuom: function (data, callback) {
        MAddonType.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getAllMAddonType of MAddonType.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                var index = 0;
                async.eachSeries(found, function (addType, callback) {
                        MUom.findOne({
                            _id: addType.rate.uom
                        }).exec(function (err, foundRateUom) {
                            if (err) {
                                console.log('**** error at rate uom of MProcessType.js ****', err);
                            } else {
                                found[index].rate.uom = foundRateUom;
                                MUom.findOne({
                                    _id: addType.quantity.additionalInputUom
                                }).exec(function (err, foundQuantityAdditionalInputUom) {
                                    if (err) {
                                        console.log('**** error at quantity uom of MProcessType.js ****', err);
                                    } else {
                                        found[index].quantity.additionalInputUom = foundQuantityAdditionalInputUom;
                                        MUom.findOne({
                                            _id: addType.quantity.linkedKeyUom
                                        }).exec(function (err, foundQuantitylinkedKeyUom) {
                                            if (err) {
                                                console.log('**** error at quantity finalUom  of MProcessType.js ****', err);
                                            } else {
                                                found[index].quantity.linkedKeyUom = foundQuantitylinkedKeyUom;
                                                MUom.findOne({
                                                    _id: addType.quantity.finalUom
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

    //-Get All materials of addon type's material sub cat by passing maddon type id.
    getSubCatMaterials: function (data, callback) {
        var materials = {};
        MAddonType.find({
            _id: data._id
        }).lean().deepPopulate('materialSubCat.materials').exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of MAddonType.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                async.eachSeries(found, function (f, callback) {
                    materials = f.materialSubCat.materials
                    
                    callback();

                }, function (err) {
                    if (err) {
                        console.log('***** error at final response of async.eachSeries in function_name of MAddonType.js*****', err);
                    } else {
                        callback(null, materials);
                    }
                });
            }
        });
    },

};
module.exports = _.assign(module.exports, exports, model);