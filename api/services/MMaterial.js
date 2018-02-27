var schema = new Schema({
    materialName: {
        type: String,
        required: true
    },
    materialSubCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MMaterialSubCat',
        required: true,
        key: "materials"
    },
    datasheet: {
        type: String
    },
    density: {
        type: Number
    },
    typicalRatePerKg: {
        type: Number
    },
    rollingIndex: {
        type: Number
    },
    bendingIndex: {
        type: Number
    },
    fabrictionIndex: {
        type: Number
    },
    cuttingIndex: {
        type: Number
    },
    type: {
        type: String,
        enum: ["standard", "customBase", "customOverlay"],
        default: "standard"
    },
    estimateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estimate'
    },
    efficiency: {
        type: Number
    },
    weightPerUnit: {
        type: Number
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MMaterial', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    getSubCatMaterials: function (data, callback) {
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
        MMaterial.find({
                materialSubCategory: data.subCatId
            }).sort({
                createdAt: -1
            })
            .order(options)
            .keyword(options)
            .page(options,
                function (err, found) {
                    if (err) {
                        console.log('**** error at getSubCatMaterials of MMaterial.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(found)) {
                        callback(null, []);
                    } else {
                        callback(null, found);
                    }
                });
    },

    //-Get all material records from MMaterial table.
    getAllMaterials: function (data, callback) {
        MMaterial.find().exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of MMaterial.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, found);
            }
        });
    },
    materialAddEdit: function (data, callback) {},

    //-update sub cat material type by passing material sub cat Id.
    updateAllSubCatMatType: function (data, callback) {
        MMaterial.update({
            materialSubCategory: data.matSubCatId,
        }, {
            type: data.type
        }, {
            multi: true
        }).exec(function (err, updatedData) {
            if (err) {
                console.log('**** error at updateAllSubCatMatType of MMaterial.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(updatedData)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, updatedData);
            }
        });
    },

    //-get all material data on the basis of Material type.
    getAllMaterialsByMatType: function (data, callback) {
        MMaterial.find({
            type: data.type
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of MMaterial.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },
    //-Search the MMaterial records on the basis of materialName field
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
                    fields: ['materialName'],
                    term: data.keyword
                }
            },
            sort: {
                desc: 'createdAt'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        MMaterial.find({}).sort({
                createdAt: -1
            })
            .order(options)
            .keyword(options)
            .page(options,
                function (err, found) {
                    if (err) {
                        console.log('**** error at search of Estimate.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(found)) {
                        callback(null, 'noDataFound');
                    } else {
                        callback(null, found);
                    }
                });
    },

    //- get all custome base and custome overlay type of Master Material table.
    getAllCustomeBaseOverlay: function (data, callback) {
        MMaterial.find({
            type: {
                $in: ["customBase", "customOverlay"]
            }
        }).select('type').lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of MMaterial.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                finalData = _.groupBy(found, "type");
                callback(null, finalData);
            }
        });
    },
    // del restrictions of Material to restrict and delete data on the basis of conditions
    // req data --> id's arrays
    delRestrictionsOfMaterial: function (data, callback) {
        async.eachSeries(data.idsArray, function (ids, callback) {
            MMaterial.find({
                _id: ids
            }).exec(function (err, matData) {
                if (err) {
                    console.log('**** error at function_name of MMaterial.js ****', err);
                    callback(err, null);
                } else if (_.isEmpty(matData)) {
                    callback(null, 'noDataFound');
                } else {
                    EstimateAddons.find({
                        addonItem: ids
                    }).exec(function (err, found) {
                        if (err) {
                            console.log('**** error at function_name of MMaterial.js ****', err);
                            callback(err, null);
                        } else if (_.isEmpty(found)) {
                            EstimatePart.find({
                                // material: ids
                                material: ids

                            }).exec(function (err, partData) {
                                if (err) {
                                    console.log('**** error at function_name of MMaterial.js ****', err);
                                    callback(err, null);
                                } else if (_.isEmpty(partData)) {
                                    async.parallel([
                                            function (callback) {
                                                MMaterialSubCat.update({
                                                    materials: ids
                                                }, {
                                                    $pull: {
                                                        materials: ids
                                                    }
                                                }).exec(function (err, updatedData) {

                                                    if (err) {
                                                        console.log('**** error at function_name of MMaterial.js ****', err);
                                                        callback(err, null);
                                                    } else if (_.isEmpty(updatedData)) {
                                                        callback(null, 'noDataFound');
                                                    } else {
                                                        callback(null, updatedData);
                                                    }
                                                });
                                            },
                                            function (callback) {
                                                MMaterial.remove({
                                                    _id: ids
                                                }).exec(function (err, removedMaterial) {
                                                    console.log('**** inside paralle ****');
                                                    if (err) {
                                                        console.log('**** error at materil removed of MMaterial.js ****', err);
                                                        callback(err, null);
                                                    } else if (_.isEmpty(removedMaterial)) {
                                                        callback(null, 'noDataFound');
                                                    } else {
                                                        callback(null, removedMaterial);
                                                    }
                                                });
                                            },
                                        ],
                                        function (err, finalResults) {
                                            if (err) {
                                                console.log('********** error at final response of async.parallel  MMaterial.js ************', err);
                                                callback(err, null);
                                            } else if (_.isEmpty(finalResults)) {
                                                callback(null, 'noDataFound');
                                            } else {
                                                callback(null, 'Records updated successfully');
                                            }
                                        });
                                } else {
                                    callback(null, 'dependecny of table Estimate Part');
                                }
                            });
                        } else {
                            callback(null, 'dependecny of table Estimate Addon');
                        }
                    });
                }
            });
        }, function (err) {
            if (err) {
                console.log('***** error at final response of async.eachSeries in function_name of MMaterial.js*****', err);
            } else {
                callback(null, 'Records updated successfully');
            }
        });
    },
};

module.exports = _.assign(module.exports, exports, model);