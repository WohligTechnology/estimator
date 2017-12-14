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
    materialAddEdit: function (data, callback) {

    },

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
         console.log('**** inside function_name of MMaterial.js & data is ****',data);
            var modelName = [{
                models: "Enquiry",
                fieldName: ["customerId", "enquiryDetails.estimator"]
            }]
            var modelName =[{
                models: "Estimate",
                fieldName: ["enquiryId", "draftEstimateId", "estimateCreatedUser", "estimateUpdatedUser", "subAssemblies", "processing", "addons", "extras","estimateAttachment._id"]
            }]
            // var modelName =[{
            //     models: "EstimateAddons",
            //     fieldName: ["addonType", "addonItem","addonsLevelId"]
            // }]
            // var modelName =[{
            //     models: "EstimateExtras",
            //     fieldName: ["extraItem","extraLevelId"]
            // }]
            // var modelName = [{
            //     models: "EstimatePart",
            //     fieldName: ["subAssemblyId", "shortcut", "partType", "material", "customMaterial", "processing", "addons", "extras"]
            // }]
            // var modelName =[{
            //     models: "EstimateProcessing",
            //     fieldName: ["processType", "processItem","processingLevelId"]
            // }]
            // var modelName = [{
            //     models: "EstimateSubAssembly",
            //     fieldName: ["estimateId", "subAssemblyParts", "processing", "addons", "extras"]
            // }]
            // var modelName = [{
            //     models: "MAddonType",
            //     fieldName: ["materialCat", "materialSubCat", "rate.uom", "quantity.additionalInputUom", "quantity.linkedKeyUom", "quantity.finalUom"]
            // }]
            // var modelName = [{
            //     models: "MExtra",
            //     fieldName: ["rate.uom"]
            // }]

            // var modelName = 
            // {
            //     models: "MMaterial",
            //     fieldName: ["materialSubCategory", "estimateId"]
            // },
            // {
            //     models: "MMaterialCat",
            //     fieldName: ["subCat"]
            // },

            // var modelName = 
            // {
            //     models: "MMaterialSubCat",
            //     fieldName: ["catId", "materials"]
            // },

            // var modelName = 
            // {
            //     models: "MPartPresets",
            //     fieldName: ["shape", "partType"]
            // },
            // var modelName = 
            // {
            //     models: "MPartType",
            //     fieldName: ["partTypeCat", "proccessing", "addons", "extras", "material"]
            // },
            // var modelName = 
            // {
            //     models: "MPartTypeCat",
            //     fieldName: ["partTypes"]
            // },
            // {
            //     models: "MProcessCat",
            //     fieldName: ["uom", "processItems"]
            // },
            // var modelName = 
            // {
            //     models: "MProcessItem",
            //     fieldName: ["processCat"]
            // },
            // var modelName = 
            // {
            //     models: "MProcessType",
            //     fieldName: ["processCat", "rate.uom", "quantity.uom", "quantity.finalUom"]
            // },
        // ];
        var allDependency = [];
        
        async.eachSeries(modelName, function (m, callback) {
                i = 0;
                async.eachSeries(m.fieldName, function (f, callback) {
                        this[m.models].findOne({
                            [f]: data._id
                        }).select('_id').lean().exec(function (err, found) {
                            // console.log('****&&&&&&&&&&&&& ****', found);
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
                                    fieldName:f
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
                    callback('***no data found*****', err);
                } else {
                    callback(null,allDependency);
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
