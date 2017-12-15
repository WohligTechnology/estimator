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

        if (data.modelName == 'DraftEstimate') {
            var myModel = [{
                    models: "Enquiry",
                    fieldName: ["enquiryId"]
                },
                {
                    models: "User",
                    fieldName: ["estimateCreatedUser"]
                },
                {
                    models: "User",
                    fieldName: ["estimateUpdatedUser"]
                }
            ]
        }
        if (data.modelName == 'Enquiry') {
            var myModel = [{
                    models: "Customer",
                    fieldName: ["customerId"]
                },
                {
                    models: "User",
                    fieldName: ["enquiryDetails.estimator"]
                }
            ]
        }
        if (data.modelName == 'Estimate') {
            var myModel = [{
                    models: "Enquiry",
                    fieldName: ["enquiryId"]
                },
                {
                    models: "DraftEstimate",
                    fieldName: ["draftEstimateId"]
                },
                {
                    models: "User",
                    fieldName: ["estimateCreatedUser"]
                },
                {
                    models: "User",
                    fieldName: ["estimateUpdatedUser"]
                },
                {
                    models: "EstimateSubAssembly",
                    fieldName: ["subAssemblies"]
                },
                {
                    models: "EstimateProcessing",
                    fieldName: ["processing"]
                },
                {
                    models: "EstimateAddons",
                    fieldName: ["addons"]
                },
                {
                    models: "EstimateExtras",
                    fieldName: ["extras"]
                }
            ]
        }
        if (data.modelName == 'EstimateAddons') {
            var myModel = [{
                    models: "MAddonType",
                    fieldName: ["addonType"]
                },
                {
                    models: "MMaterial",
                    fieldName: ["addonItem"]
                }
            ]
        }
        if (data.modelName == 'EstimateExtra') {
            var myModel = [{
                    models: "MExtra",
                    fieldName: ["extraItem"]
                },
                {
                    models: "----",
                    fieldName: ["extraLevelId"]
                }
            ]
        }
        if (data.modelName == 'EstimatePart') {
            var myModel = [{
                    models: "EstimateSubAssembly",
                    fieldName: ["subAssemblyId"]
                },
                {
                    models: "MPartPresets",
                    fieldName: ["shortcut"]
                },
                {
                    models: "MPartType",
                    fieldName: ["partType"]
                },
                {
                    models: "MMaterial",
                    fieldName: ["material"]
                },
                {
                    models: "MMaterial",
                    fieldName: ["customMaterial"]
                },
                {
                    models: "EstimateProcessing",
                    fieldName: ["processing"]
                },
                {
                    models: "EstimateAddons",
                    fieldName: ["addons"]
                },
                {
                    models: "EstimateExtras",
                    fieldName: ["extras"]
                }
            ]
        }
        if (data.modelName == 'EstimateProcessing') {
            var myModel = [{
                    models: "------",
                    fieldName: ["processingLevelId"]
                },
                {
                    models: "MProcessType",
                    fieldName: ["processType"]
                },
                {
                    models: "MProcessItem",
                    fieldName: ["processItem"]
                }
            ]
        }
        if (data.modelName == 'EstimateSubAssembly') {
            var myModel = [{
                    models: "Estimate",
                    fieldName: ["estimateId"]
                },
                {
                    models: "EstimatePart",
                    fieldName: ["subAssemblyParts"]
                },
                {
                    models: "EstimateProcessing",
                    fieldName: ["processing"]
                },
                {
                    models: "EstimateAddons",
                    fieldName: ["addons"]
                },
                {
                    models: "EstimateExtras",
                    fieldName: ["extras"]
                }
            ]
        }
        if (data.modelName == 'MAddonType') {
            var myModel = [{
                    models: "MMaterialCat",
                    fieldName: ["materialCat"]
                },
                {
                    models: "MPartType",
                    fieldName: ["materialSubCat"]
                },
                {
                    models: "MUom",
                    fieldName: ["rate.uom"]
                },
                {
                    models: "MUom",
                    fieldName: ["quantity.additionalInputUom"]
                },
                {
                    models: "MUom",
                    fieldName: ["quantity.linkedKeyUom"]
                },
                {
                    models: "MUom",
                    fieldName: ["quantity.finalUom"]
                },

            ]
        }
        if (data.modelName == 'MExtra') {
            var myModel = [{
                models: "MUom",
                fieldName: ["rate.uom"]
            }]
        }
        if (data.modelName == 'MMaterial') {
            var myModel = [{
                    models: "MMaterialSubCat",
                    fieldName: ["materialSubCategory"]
                },
                {
                    models: "Estimate",
                    fieldName: ["estimateId"]
                }
            ]
        }
        if (data.modelName == 'MMaterialCat') {
            var myModel = [{
                models: "MMaterialSubCat",
                fieldName: ["subCat"]
            }]
        }
        if (data.modelName == 'MMaterialSubCat') {
            var myModel = [{
                    models: "MMaterialCat",
                    fieldName: ["catId"]
                },
                {
                    models: "MMaterial",
                    fieldName: ["materials"]
                }
            ]
        }
        if (data.modelName == 'MPartPresets') {
            var myModel = [{
                    models: "EstimatePart",
                    fieldName: ["shortcut"]

                }, {

                    models: "MShape",
                    fieldName: ["shape"]
                },
                {
                    models: "MPartType",
                    fieldName: ["partType"]
                }
            ]
        }
        if (data.modelName == 'MPartType') {
            var myModel = [{
                    models: "MPartTypeCat",
                    fieldName: ["partTypeCat"]
                },
                {
                    models: "MProcessType",
                    fieldName: ["proccessing"]
                },
                {
                    models: "MAddonType",
                    fieldName: ["addons"]
                },
                {
                    models: "MExtra",
                    fieldName: ["extras"]
                },
                {
                    models: "MMaterial",
                    fieldName: ["material"]
                }
            ]
        }
        if (data.modelName == 'MPartTypeCat') {
            var myModel = [{
                models: "MPartType",
                fieldName: ["partTypes"]
            }]
        }
        if (data.modelName == 'MProcessCat') {
            var myModel = [{
                    models: "MUom",
                    fieldName: ["uom"]
                },
                {
                    models: "MProcessItem",
                    fieldName: ["processItems"]
                }
            ]
        }
        if (data.modelName == 'MProcessItem') {
            var myModel = [{
                models: "MProcessCat",
                fieldName: ["processCat"]
            }]
        }
        if (data.modelName == 'MProcessType') {
            var myModel = [{
                    models: "MProcessCat",
                    fieldName: ["processCat"]
                },
                {
                    models: "MUom",
                    fieldName: ["rate.uom"]
                },
                {
                    models: "MUom",
                    fieldName: ["quantity.uom"]
                },
                {
                    models: "MUom",
                    fieldName: ["quantity.finalUom"]
                }
            ]
        }
        allDependency = [];
        console.log('**** 222222222222222 ****', myModel);
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
                                    fieldName: f
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
                    callback('***errrrrrrr*****', err);
                } else if (_.isEmpty(allDependency)) {
                    this[data.modelName].findOne({
                        _id: data._id
                    }).exec(function (err, found) {
                        if (err) {
                            console.log('**** error at function_name of MMaterial.js ****', err);
                            callback(err, null);
                        } else if (_.isEmpty(found)) {
                            callback(null, 'noDataFound');
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