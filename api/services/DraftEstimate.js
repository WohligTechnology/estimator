// estimate collection schema
var schema = new Schema({
    enquiryId: {
        type: Schema.Types.ObjectId,
        ref: "Enquiry",
        index: true,
    },
    assemblyName: {
        type: String,
        required: true
    },
    assemplyNumber: { //  start with a + X where X is increasing numbers
        type: String
    },
    keyValueCalculations: {
        perimeter: Number,
        sheetMetalArea: Number,
        surfaceArea: Number,
        weight: Number,
        numbers: Number,
        hours: Number
    },
    totalWeight: Number,
    materialCost: Number,
    processingCost: Number,
    addonCost: Number,
    extrasCost: Number,
    totalCost: Number,
    estimateId: { // it is a common & unique field to backup estimate document
        type: String,
        unique: true
    },
    estimateCreatedUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    estimateUpdatedUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    estimateDetails: {}, // not defined yet
    estimateBoq: {},
    estimateAttachment: [{
        file: String
    }],

    subAssemblies: [{
        subAssemblyName: String,
        subAssemblyNumber: { //  a1sX where a1 --> assembly name, sX --> X is auto increasing number
            type: String
        },
        quantity: Number,
        totalValue: Number,
        keyValueCalculations: {
            perimeter: Number,
            sheetMetalArea: Number,
            surfaceArea: Number,
            weight: Number,
            numbers: Number,
            hours: Number
        },

        subAssemblyParts: [{
            partName: String,
            partNumber: { // a1s1pX where a1 --> assembly name, s1 --> subAssemblyName, X is auto increasing number
                type: String
            },
            shortcut: String,
            scaleFactor: Number, // it is %
            finalCalculation: {
                materialPrice: Number,
                itemUnitPrice: Number,
                totalCostForQuantity: Number
            },
            keyValueCalculations: {
                perimeter: Number,
                sheetMetalArea: Number,
                surfaceArea: Number,
                weight: Number
            },
            sectionCode: {
                type: Schema.Types.ObjectId,
                ref: "MPartPresets",
                index: true,
            },
            material: {
                type: Schema.Types.ObjectId,
                ref: "MMaterial",
                index: true,
            },
            size: String,
            quantity: Number,
            variable: [{}], // Structure not defined yet    

            proccessing: [{
                processType: {
                    type: Schema.Types.ObjectId,
                    ref: "MProcessType",
                    index: true,
                },
                processItem: {
                    type: Schema.Types.ObjectId,
                    ref: "MProcessItem",
                    index: true,
                },
                rate: Number,
                quantity: {
                    keyValue: {
                        keyVariable: String,
                        keyValue: String
                    },
                    utilization: Number,
                    contengncyOrWastage: Number,
                    total: Number
                },
                totalCost: Number,
                remarks: String
            }],
            addons: [{
                addonType: {
                    type: Schema.Types.ObjectId,
                    ref: "MAddonType",
                    index: true,
                },
                addonItem: {
                    type: Schema.Types.ObjectId,
                    ref: "MMaterial",
                    index: true,
                },
                rate: Number,
                quantity: {
                    supportingVariable: {
                        supportingVariable: String,
                        value: Number
                    },
                    keyValue: {
                        keyVariable: String,
                        keyValue: String
                    },
                    utilization: Number,
                    contengncyOrWastage: Number,
                    total: Number
                },
                totalCost: Number,
                remarks: String
            }],
            extras: [{
                extraItem: {
                    type: Schema.Types.ObjectId,
                    ref: "MExtra",
                    index: true,
                },
                quantity: Number,
                totalCost: Number,
                remarks: String
            }],
        }],

        proccessing: [{
            processType: {
                type: Schema.Types.ObjectId,
                ref: "MProcessType",
                index: true,
            },
            processItem: {
                type: Schema.Types.ObjectId,
                ref: "MProcessItem",
                index: true,
            },
            rate: Number,
            quantity: {
                keyValue: {
                    keyVariable: String,
                    keyValue: String
                },
                utilization: Number,
                contengncyOrWastage: Number,
                total: Number
            },
            totalCost: Number,
            remarks: String
        }],
        addons: [{
            addonType: {
                type: Schema.Types.ObjectId,
                ref: "MAddonType",
                index: true,
            },
            addonItem: {
                type: Schema.Types.ObjectId,
                ref: "MMaterial",
                index: true,
            },
            rate: Number,
            quantity: {
                supportingVariable: {
                    supportingVariable: String,
                    value: Number
                },
                keyValue: {
                    keyVariable: String,
                    keyValue: String
                },
                utilization: Number,
                contengncyOrWastage: Number,
                total: Number
            },
            totalCost: Number,
            remarks: String
        }],
        extras: [{
            extraItem: {
                type: Schema.Types.ObjectId,
                ref: "MExtra",
                index: true,
            },
            quantity: Number,
            totalCost: Number,
            remarks: String
        }],
    }],

    proccessing: [{
        processType: {
            type: Schema.Types.ObjectId,
            ref: "MProcessType",
            index: true,
        },
        processItem: {
            type: Schema.Types.ObjectId,
            ref: "MProcessItem",
            index: true,
        },
        rate: Number,
        quantity: {
            keyValue: {
                keyVariable: String,
                keyValue: String
            },
            utilization: Number,
            contengncyOrWastage: Number,
            total: Number
        },
        totalCost: Number,
        remarks: String
    }],
    addons: [{
        addonType: {
            type: Schema.Types.ObjectId,
            ref: "MAddonType",
            index: true,
        },
        addonItem: {
            type: Schema.Types.ObjectId,
            ref: "MMaterial",
            index: true,
        },
        rate: Number,
        quantity: {
            supportingVariable: {
                supportingVariable: String,
                value: Number
            },
            keyValue: {
                keyVariable: String,
                keyValue: String
            },
            utilization: Number,
            contengncyOrWastage: Number,
            total: Number
        },
        totalCost: Number,
        remarks: String
    }],
    extras: [{
        extraItem: {
            type: Schema.Types.ObjectId,
            ref: "MExtra",
            index: true,
        },
        quantity: Number,
        totalCost: Number,
        remarks: String
    }]

});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('DraftEstimate', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    //- compile draft estimate & store it into an 6 coolections
    // req data --> _id (i.e. estimate Id)
    compileEstimate: function (data, callback) {

        DraftEstimate.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of DraftEstimate.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                var subAssembliesArray = [];
                var partsArray = [];
                var partProccessingArray = [];
                var partAddonsArray = [];
                var partExtrasArray = [];
                var subAssProccessingArray = [];
                var subAssAddonsArray = [];
                var subAssExtrasArray = [];
                var assProccessingArray = [];
                var assAddonsArray = [];
                var assExtrasArray = [];
                // 1st async.eachSeries

                var assemblyObj = {
                    enquiryId: found.enquiryId,
                    assemblyName: found.assemblyName,
                    assemplyNumber: found.assemplyNumber,
                    keyValueCalculations: found.keyValueCalculations,
                    totalWeight: found.totalWeight,
                    materialCost: found.materialCost,
                    processingCost: found.processingCost,
                    addonCost: found.addonCost,
                    extrasCost: found.extrasCost,
                    totalCost: found.totalCost,
                    estimateId: found.estimateId,
                    estimateCreatedUser: found.estimateCreatedUser,
                    estimateUpdatedUser: found.estimateUpdatedUser,
                    estimateDetails: found.estimateDetails,
                    estimateBoq: found.estimateBoq,
                    estimateAttachment: found.estimateAttachment,
                    subAssemblies: [],
                    proccessing: [],
                    addons: [],
                    extras: []
                };
                console.log(' @@@@@@@@@@@@@@@@@ assemblyObj @@@@@@@@@@@@@@@@@@@', assemblyObj);

                Estimate.saveData(assemblyObj, function (err, savedAssembly) {
                    if (err) {
                        console.log('**** error at function_name of DraftEstimate.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(savedAssembly)) {
                        callback(null, 'noDataFound');
                    } else {

                        async.eachSeries(found.subAssemblies, function (subAss, callback) {

                            var subAssObj = {
                                subAssemblyName: subAss.subAssemblyName,
                                subAssemblyNumber: subAss.subAssemblyNumber,
                                quantity: subAss.quantity,
                                totalValue: subAss.totalValue,
                                estimateId: savedAssembly._id,
                                keyValueCalculations: subAss.keyValueCalculations,
                                subAssemblyParts: [],
                                proccessing: [],
                                addons: [],
                                extras: []
                            };

                            EstimateSubAssembly.saveData(subAssObj, function (err, savedSubAss) {
                                if (err) {
                                    console.log('**** error at function_name of DraftEstimate.js ****', err);
                                    callback(err, null);
                                } else if (_.isEmpty(savedSubAss)) {
                                    callback(null, 'noDataFound');
                                } else {
                                    async.eachSeries(subAss.subAssemblyParts, function (part, callback) {

                                        var partObj = {
                                            partName: part.partName,
                                            partNumber: part.partNumber,
                                            shortcut: part.shortcut,
                                            scaleFactor: part.scaleFactor,
                                            finalCalculation: part.finalCalculation,
                                            keyValueCalculations: part.keyValueCalculations,
                                            sectionCode: part.sectionCode,
                                            material: part.material,
                                            size: part.size,
                                            quantity: part.quantity,
                                            variable: part.variable,
                                            subAssemblyId: savedSubAss._id,
                                            proccessing: [],
                                            addons: [],
                                            extras: []
                                        };

                                        EstimatePart.saveData(partObj, function (err, savedPart) {
                                            if (err) {
                                                console.log('**** error at function_name of DraftEstimate.js ****', err);
                                                callback(err, null);
                                            } else if (_.isEmpty(savedPart)) {
                                                callback(null, 'noDataFound');
                                            } else {
                                                async.parallel({
                                                    partProcessing: function (callback) {
                                                        async.eachSeries(part.proccessing, function (proObj, callback) {
                                                            EstimateProcessing.saveData(proObj, function (err, savedPartProcess) {
                                                                if (err) {
                                                                    console.log('**** error at partProcessing of DraftEstimate.js ****', err);
                                                                } else {
                                                                    partProccessingArray.push(savedPartProcess._id);
                                                                    callback();
                                                                }
                                                            });
                                                        }, function (err) {
                                                            if (err) {
                                                                console.log('***** error at final response of async.eachSeries in partProcessing of DraftEstimate.js*****', err);
                                                            } else {
                                                                callback();
                                                            }
                                                        });
                                                    },
                                                    partAddons: function (callback) {
                                                        async.eachSeries(part.addons, function (addonsObj, callback) {
                                                            EstimateAddons.saveData(addonsObj, function (err, savedPartAddon) {
                                                                if (err) {
                                                                    console.log('**** error at partAddons of DraftEstimate.js ****', err);
                                                                } else {
                                                                    partAddonsArray.push(savedPartAddon._id);
                                                                    callback();
                                                                }
                                                            });
                                                        }, function (err) {
                                                            if (err) {
                                                                console.log('***** error at final response of async.eachSeries in partAddons of DraftEstimate.js*****', err);
                                                            } else {
                                                                callback();
                                                            }
                                                        });
                                                    },
                                                    partExtras: function (callback) {
                                                        async.eachSeries(part.extras, function (extrasObj, callback) {
                                                            EstimateExtras.saveData(extrasObj, function (err, savedPartExtra) {
                                                                if (err) {
                                                                    console.log('**** error at partExtras of DraftEstimate.js ****', err);
                                                                } else {
                                                                    partExtrasArray.push(savedPartExtra._id);
                                                                    callback();
                                                                }
                                                            });
                                                        }, function (err) {
                                                            if (err) {
                                                                console.log('***** error at final response of async.eachSeries in partExtras of DraftEstimate.js*****', err);
                                                            } else {
                                                                callback();
                                                            }
                                                        });
                                                    }
                                                }, function (err, finalResults) {
                                                    if (err) {
                                                        console.log('********** error at final response of async.parallel  DraftEstimate.js ************', err);
                                                        callback(err, null);
                                                    } else {

                                                        part.proccessing = partProccessingArray;
                                                        part.addons = partAddonsArray;
                                                        part.extras = partExtrasArray;

                                                        EstimatePart.saveData(part, function (err, savedPart) {
                                                            if (err) {
                                                                console.log('**** error at function_name of DraftEstimate.js ****', err);
                                                                callback(err, null);
                                                            } else {
                                                                callback(null, savedPart);
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });

                                    }, function (err) {
                                        if (err) {
                                            console.log('***** error at final response of 1st async.eachSeries in function_name of DraftEstimate.js *****', err);
                                        } else {

                                            // following callback is the final callback of 2nd async.eachSeries
                                            // here it will call next iteration of 1st async.eachSeries
                                            callback();
                                        }
                                    });
                                }
                            });

                        }, function (err) {
                            if (err) {
                                console.log('***** error at final response of 2nd async.eachSeries in function_name of DraftEstimate.js *****', err);
                            } else {
                                callback();
                            }
                        });

                    }
                });



            }
        });

    },
};
module.exports = _.assign(module.exports, exports, model);