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
    contingencyOrWastage: {
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

    delRestrictions: function (data, callback) {
        if (data.modelName == 'Customer') {
            var myModel = [{
                models: "Enquiry",
                fieldName: ["customerId"]
            }]
        }
        if (data.modelName == 'DraftEstimate') {
            var myModel = [{
                models: "Estimate",
                fieldName: ["draftEstimateId"]
            }]
        }
        if (data.modelName == 'Enquiry') {
            var myModel = [{
                    models: "DraftEstimate",
                    fieldName: ["enquiryId"]
                },
                {
                    models: "Estimate",
                    fieldName: ["enquiryId"]
                }
            ]
        }
        if (data.modelName == 'Estimate') {
            var myModel = [{
                    models: "EstimateSubAssembly",
                    fieldName: ["estimateId"]
                },
                {
                    models: "MMaterial",
                    fieldName: ["estimateId"]
                }
            ]
        }
        if (data.modelName == 'EstimateAddons') {
            var myModel = [{
                    models: "Estimate",
                    fieldName: ["addons"]
                },
                {
                    models: "EstimateSubAssembly",
                    fieldName: ["addons"]
                },
                {
                    models: "EstimatePart",
                    fieldName: ["addons"]
                }
            ]
        }
        if (data.modelName == 'EstimateExtras') {
            var myModel = [{
                    models: "Estimate",
                    fieldName: ["extras"]
                },
                {
                    models: "EstimateSubAssembly",
                    fieldName: ["extras"]
                },
                {
                    models: "EstimatePart",
                    fieldName: ["extras"]
                }

            ]
        }
        if (data.modelName == 'EstimatePart') {
            var myModel = [{
                models: "EstimateSubAssembly",
                fieldName: ["subAssemblyParts"]
            }]
        }
        if (data.modelName == 'EstimateProcessing') {
            var myModel = [{
                    models: "Estimate",
                    fieldName: ["processing"]
                },
                {
                    models: "EstimatePart",
                    fieldName: ["processing"]
                },
                {
                    models: "EstimateSubAssembly",
                    fieldName: ["processing"]
                }
            ]
        }
        if (data.modelName == 'EstimateSubAssembly') {
            var myModel = [{
                    models: "Estimate",
                    fieldName: ["subAssemblies"]
                },
                {
                    models: "EstimatePart",
                    fieldName: ["subAssemblyId"]
                }
            ]
        }
        // if (data.modelName == 'MAddonsPresets') {
        //     var myModel = [{
        //         models: "EstimateAddons",
        //         fieldName: ["addonType"]
        //     }]
        // }

        if (data.modelName == 'MAddonType') {
            var myModel = [{
                    models: "EstimateAddons",
                    fieldName: ["addonType"]
                },
                {
                    models: "MPartType",
                    fieldName: ["addons"]
                }
            ]
        }
        if (data.modelName == 'MExtra') {
            var myModel = [{
                    models: "EstimateExtra",
                    fieldName: ["extraItem"]
                },
                {
                    models: "MPartType",
                    fieldName: ["extras"]
                }
            ]
        }
        // if (data.modelName == 'MExtrasPreset') {
        //     var myModel = [{
        //         models: "",
        //         fieldName: [""]
        //     }]
        // }

        if (data.modelName == 'MMaterial') {
            var myModel = [{
                    models: "EstimateAddons",
                    fieldName: ["addonItem"]
                },
                {
                    models: "EstimatePart",
                    fieldName: ["material", "customMaterial"]
                },
                {
                    models: "MMaterialSubCat",
                    fieldName: ["materials"]
                },
                {
                    models: "MPartType",
                    fieldName: ["material"]
                }


            ]
        }
        if (data.modelName == 'MMaterialCat') {
            var myModel = [{
                    models: "MAddonType",
                    fieldName: ["materialCat"]
                },
                {
                    models: "MMaterialSubCat",
                    fieldName: ["catId"]
                }
            ]
        }
        if (data.modelName == 'MMaterialSubCat') {
            var myModel = [{
                    models: "MAddonType",
                    fieldName: ["materialSubCat"]
                },
                {
                    models: "MMaterial",
                    fieldName: ["materialSubCategory"]
                },
                {
                    models: "MMaterialCat",
                    fieldName: ["subCat"]
                },

            ]
        }
        if (data.modelName == 'MPartPresets') {
            var myModel = [{
                models: "EstimatePart",
                fieldName: ["shortcut"]

            }]
        }
        if (data.modelName == 'MPartType') {
            var myModel = [{
                models: "EstimatePart",
                fieldName: ["partType"]
            },
            {
                models: "MPartPresets",
                fieldName: ["partType"]
            },
            {
                models: "MPartTypeCat",
                fieldName: ["partTypes"]
            }
        ]
        }
        if (data.modelName == 'MPartTypeCat') {
            var myModel = [{
                models: "MPartType",
                fieldName: ["partTypeCat"]
            }]
        }
        if (data.modelName == 'MProcessCat') {
            var myModel = [{
                models: "MProcessItem",
                fieldName: ["processCat"]
            }, {
                models: "MProcessType",
                fieldName: ["processCat"]
            }]
        }
        // if (data.modelName == 'MProcessingPresets') {
        //     var myModel = [{
        //         models: "",
        //         fieldName: [""]
        //     }]
        // }
        if (data.modelName == 'MProcessItem') {
            var myModel = [{
                    models: "EstimateProcessing",
                    fieldName: ["processItem"]
                },
                {
                    models: "MProcessCat",
                    fieldName: ["processItems"]
                }
            ]
        }
        if (data.modelName == 'MProcessType') {
            var myModel = [{
                    models: "EstimateProcessing",
                    fieldName: ["processType"]
                },
                {
                    models: "MPartType",
                    fieldName: ["proccessing"]
                }
            ]
        }
        if (data.modelName == 'MShape') {
            var myModel = [{
                models: "MPartPresets",
                fieldName: ["shape"]
            }]
        }
        if (data.modelName == 'MUom') {
            var myModel = [{
                    models: "MAddonType",
                    fieldName: ["rate.uom", "quantity.additionalInputUom", "quantity.linkedKeyUom", "quantity.finalUom"]
                },
                {
                    models: "MExtra",
                    fieldName: ["rate.uom"]
                },
                {
                    models: "MProcessCat",
                    fieldName: ["uom"]
                },
                {
                    models: "MProcessType",
                    fieldName: ["rate.uom", "quantity.uom", "quantity.finalUom"]
                }
            ]
        }
        if (data.modelName == 'User') {
            var myModel = [{
                    models: "DraftEstimate",
                    fieldName: ["estimateCreatedUser","estimateUpdatedUser"]
                },
                {
                    models: "Enquiry",
                    fieldName: ["estimator"]
                },
                {
                    models: "Estimate",
                    fieldName: ["estimateCreatedUser","estimateUpdatedUser"]
                }
            ]
        }

        allDependency = [];
        async.eachSeries(myModel, function (m, callback) {
                i = 0;
                async.eachSeries(m.fieldName, function (f, callback) {
                        this[m.models].findOne({
                            [f]: data._id
                        }).select('_id').lean().exec(function (err, found) {
                            console.log('****&&&&&&&&&&&&& ****', found);
                            i++;
                            if (err) {
                                console.log('**** error at delRestrictions ****', err);
                                callback(err, null);
                            } else if (_.isEmpty(found)) {
                                // console.log('****no dependency of the table ' + m.models);
                                callback(null, []);
                            } else {
                                var tablesDependency = {
                                    model: m.models,
                                    fieldName: f,
                                    _id: found._id
                                };
                                console.log('dependency of the table ' + m.models + ' with attribute ' + [f]);
                                allDependency.push(tablesDependency);
                                callback();
                            }
                        });
                    },
                    function (err) {
                        if (err) {
                            callback('***** error at final response of async.eachSeries in function_name of MMaterial.js*****', err);
                        } else {
                            callback();
                        }
                    });
            },
            function (err) {
                if (err) {
                    callback('**** error at delRestrictions ****', err);
                } else if (_.isEmpty(allDependency)) {
                    this[data.modelName].find({
                        _id: data._id
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
                } else {
                    callback(null, allDependency);
                }
            });
    },
    deleteMultipleMaterials: function (data, callback) {
        MMaterial.remove({
            _id: {
                $in: data.idsArray
            }
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at deleteMultipleMaterials of Material.js ****', err);
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