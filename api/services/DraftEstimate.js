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
    assemblyNumber: { //  start with a + X where X is increasing numbers
        type: String,
        required: true
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
    subAssemblies: [],
    processing: [],
    addons: [],
    extras: []

});

schema.plugin(deepPopulate, {
    populate: {
        'enquiryId.customerId': {
            select: 'customerName',
        },

        'estimateCreatedUser': {
            select: 'name'
        },
        'estimateUpdatedUser': {
            select: 'name'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('DraftEstimate', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    //- compile draft estimate & store it into the 6 collections.
    // req data --> _id (i.e. estimate Id)
    compileEstimate: function (data, callback) {
        DraftEstimate.findOne({
            _id: data._id
        }).lean().exec(function (err, found) {
            var tempObj = {
                estimateVersion: 1
            };

            if (err) {
                console.log('**** error at function_name of DraftEstimate.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                delete found._id;
                delete found.createdAt;
                delete found.updatedAt;
                delete found.__v;

                console.log(' @@@@@@@@@@@@@@@@@ found @@@@@@@@@@@@@@@@@@@', found);

                var subAssembliesArray = [];
                var partsArray = [];
                var partprocessingArray = [];
                var partAddonsArray = [];
                var partExtrasArray = [];
                var subAssprocessingArray = [];
                var subAssAddonsArray = [];
                var subAssExtrasArray = [];
                var assprocessingArray = [];
                var assAddonsArray = [];
                var assExtrasArray = [];
                // 1st async.eachSeries

                Estimate.findOne({
                    assemblyNumber: data.assemblyNumber
                }).sort({
                    createdAt: -1
                }).lean().exec(function (err, estObj) {
                    console.log('**** !!!!!!!!!!!!! ****', estObj);
                    if (err) {
                        console.log('**** error at function_name of DraftEstimate.js ****', err);
                        callback(err, null);
                    } else {
                        if (estObj == null) {
                            console.log('**** inside function_name of DraftEstimate.js & data is ****', estObj);
                        } else {
                            tempObj.estimateVersion = parseInt(estObj.estimateVersion) + 1;
                            console.log('**** !!!!!!!!!!!!!!!!!! ****', tempObj);
                        }
                        var assemblyObj = {
                            estimateVersion: tempObj.estimateVersion,
                            enquiryId: found.enquiryId,
                            assemblyName: found.assemblyName,
                            assemblyNumber: found.assemblyNumber,
                            keyValueCalculations: found.keyValueCalculations,
                            totalWeight: found.totalWeight,
                            materialCost: found.materialCost,
                            processingCost: found.processingCost,
                            addonCost: found.addonCost,
                            extrasCost: found.extrasCost,
                            totalCost: found.totalCost,
                            draftEstimateId: found._id,
                            estimateCreatedUser: found.estimateCreatedUser,
                            estimateUpdatedUser: found.estimateUpdatedUser,
                            estimateDetails: found.estimateDetails,
                            estimateBoq: found.estimateBoq,
                            estimateAttachment: found.estimateAttachment,
                            subAssemblies: [],
                            processing: [],
                            addons: [],
                            extras: [],
                            assemblyObj: found
                        };

                        Estimate.saveData(assemblyObj, function (err, savedAssembly) {
                            if (err) {
                                console.log('**** error at Estimate.saveData of DraftEstimate.js ****', err);
                                callback(err, null);
                            } else if (_.isEmpty(savedAssembly)) {
                                callback(null, 'noDataFound');
                            } else {
                                async.eachSeries(found.subAssemblies, function (subAss, callback) {

                                    var subAssObj = {
                                        estimateVersion: tempObj.estimateVersion,
                                        subAssemblyName: subAss.subAssemblyName,
                                        subAssemblyNumber: subAss.subAssemblyNumber,
                                        quantity: subAss.quantity,
                                        totalValue: subAss.totalValue,
                                        estimateId: savedAssembly._id,
                                        keyValueCalculations: subAss.keyValueCalculations,
                                        subAssemblyParts: [],
                                        processing: [],
                                        addons: [],
                                        extras: [],
                                        subAssemblyObj: subAss
                                    };

                                    EstimateSubAssembly.saveData(subAssObj, function (err, savedSubAss) {
                                        if (err) {
                                            console.log(' **** error at EstimateSubAssembly.saveData of DraftEstimate.js **** ', err);
                                            callback(err, null);
                                        } else if (_.isEmpty(savedSubAss)) {
                                            callback(null, 'noDataFound');
                                        } else {
                                            subAssembliesArray.push(savedSubAss._id);
                                            async.eachSeries(subAss.subAssemblyParts, function (part, callback) {
                                                console.log('**** ^^^^^^^^^^^^^ ****', part);
                                                var partObj = {
                                                    estimateVersion: tempObj.estimateVersion,
                                                    partName: part.partName,
                                                    partIcon: part.partIcon,
                                                    partNumber: part.partNumber,
                                                    subAssemblyId: savedSubAss._id,
                                                    shortcut: part.shortcut,
                                                    partType: part.partType,
                                                    material: part.material,
                                                    size: part.size,
                                                    // customMaterial:part.customMaterial,
                                                    quantity: part.quantity,
                                                    variable: part.variable,
                                                    scaleFactor: part.scaleFactor,
                                                    finalCalculation: part.finalCalculation,
                                                    keyValueCalculations: part.keyValueCalculations,
                                                    processing: [],
                                                    addons: [],
                                                    extras: [],
                                                    partObj: part
                                                };

                                                EstimatePart.saveData(partObj, function (err, savedPart) {
                                                    if (err) {
                                                        console.log('**** error at EstimatePart.saveData of DraftEstimate.js ****', err);
                                                        callback(err, null);
                                                    } else if (_.isEmpty(savedPart)) {
                                                        callback(null, 'noDataFound');
                                                    } else {
                                                        partsArray.push(savedPart._id);
                                                        async.waterfall([
                                                            function (callback) {
                                                                async.eachSeries(part.processing, function (proObj, callback) {
                                                                    var tempProObj = proObj;
                                                                    tempProObj.processingLevel = "part";
                                                                    tempProObj.estimateVersion = tempObj.estimateVersion,
                                                                        tempProObj.processingLevelId = savedPart._id;
                                                                    // tempProObj.processingObj = proObj;
                                                                    EstimateProcessing.saveData(tempProObj, function (err, savedPartProcess) {
                                                                        if (err) {
                                                                            console.log('**** error at partProcessing of DraftEstimate.js ****', err);
                                                                        } else {
                                                                            partprocessingArray.push(savedPartProcess._id);
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
                                                            function (callback) {
                                                                async.eachSeries(part.addons, function (addonsObj, callback) {
                                                                    var tempAddonObj = addonsObj;
                                                                    tempAddonObj.estimateVersion = tempObj.estimateVersion,
                                                                        tempAddonObj.addonsLevel = "part";
                                                                    tempAddonObj.addonsLevelId = savedPart._id;
                                                                    // tempAddonObj.addonObj = addonsObj;
                                                                    EstimateAddons.saveData(tempAddonObj, function (err, savedPartAddon) {
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
                                                            function (callback) {
                                                                async.eachSeries(part.extras, function (extrasObj, callback) {
                                                                    var tempExtraObj = extrasObj;
                                                                    tempExtraObj.extraLevel = "part";
                                                                    tempExtraObj.estimateVersion = tempObj.estimateVersion,
                                                                        tempExtraObj.extraLevelId = savedPart._id;
                                                                    // tempExtraObj.extraObj = extrasObj;
                                                                    EstimateExtras.saveData(tempExtraObj, function (err, savedPartExtra) {
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
                                                        ], function (err, finalResults) {
                                                            if (err) {
                                                                console.log('********** error at final response of async.waterfall  DraftEstimate.js ************', err);
                                                                callback(err, null);
                                                            } else {

                                                                savedPart.processing = partprocessingArray;
                                                                savedPart.addons = partAddonsArray;
                                                                savedPart.extras = partExtrasArray;

                                                                EstimatePart.saveData(savedPart, function (err, updatedPart) {
                                                                    if (err) {
                                                                        console.log('**** error at function_name of DraftEstimate.js ****', err);
                                                                    } else {
                                                                        callback(null, updatedPart);
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

                                                    async.waterfall([
                                                        function (callback) {
                                                            async.eachSeries(subAss.processing, function (proObj, callback) {

                                                                var tempProObj = proObj;
                                                                tempProObj.processingLevel = "subAssembly";
                                                                tempProObj.estimateVersion = tempObj.estimateVersion,
                                                                    tempProObj.processingLevelId = savedSubAss._id;
                                                                // tempProObj.processingObj = proObj;
                                                                // tempProObj.processingObj = {};

                                                                EstimateProcessing.saveData(tempProObj, function (err, savedSubAssProcess) {
                                                                    if (err) {
                                                                        console.log('**** error at subAssProcessing of DraftEstimate.js ****', err);
                                                                    } else {
                                                                        subAssprocessingArray.push(savedSubAssProcess._id);
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
                                                        function (callback) {
                                                            async.eachSeries(subAss.addons, function (addonsObj, callback) {
                                                                var tempAddonObj = addonsObj;
                                                                tempAddonObj.addonsLevel = "subAssembly";
                                                                tempAddonObj.estimateVersion = tempObj.estimateVersion,
                                                                    tempAddonObj.addonsLevelId = savedSubAss._id;
                                                                // tempAddonObj.addonObj = addonsObj;
                                                                // tempAddonObj.addonObj = {};
                                                                EstimateAddons.saveData(tempAddonObj, function (err, savedSubAssAddon) {
                                                                    if (err) {
                                                                        console.log('**** error at subAssAddons of DraftEstimate.js ****', err);
                                                                    } else {
                                                                        subAssAddonsArray.push(savedSubAssAddon._id);
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
                                                        function (callback) {
                                                            async.eachSeries(subAss.extras, function (extrasObj, callback) {
                                                                var tempExtraObj = extrasObj;
                                                                tempExtraObj.extraLevel = "subAssembly";
                                                                tempExtraObj.extraLevelId = savedSubAss._id;
                                                                tempExtraObj.estimateVersion = tempObj.estimateVersion,
                                                                    // tempExtraObj.extraObj = extrasObj;
                                                                    // tempExtraObj.extraObj = {};
                                                                    EstimateExtras.saveData(tempExtraObj, function (err, savedSubAssExtra) {
                                                                        if (err) {
                                                                            console.log('**** error at subAssExtras of DraftEstimate.js ****', err);
                                                                        } else {
                                                                            subAssExtrasArray.push(savedSubAssExtra._id);
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
                                                    ], function (err, finalResults) {
                                                        if (err) {
                                                            console.log('********** error at final response of async.waterfall  DraftEstimate.js ************', err);
                                                            callback(err, null);
                                                        } else {

                                                            savedSubAss.processing = subAssprocessingArray;
                                                            savedSubAss.addons = subAssAddonsArray;
                                                            savedSubAss.extras = subAssExtrasArray;
                                                            savedSubAss.subAssemblyParts = partsArray;

                                                            EstimateSubAssembly.saveData(savedSubAss, function (err, updatedSubAss) {
                                                                if (err) {
                                                                    console.log('**** error at EstimateSubAssembly saveData of DraftEstimate.js ****', err);
                                                                } else {
                                                                    callback(null, updatedSubAss);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });

                                }, function (err) {
                                    if (err) {
                                        console.log('***** error at final response of 2nd async.eachSeries in function_name of DraftEstimate.js *****', err);
                                    } else {

                                        async.waterfall([
                                            function (callback) {
                                                async.eachSeries(found.processing, function (proObj, callback) {
                                                    var tempProObj = proObj;
                                                    tempProObj.processingLevel = "estimate";
                                                    tempProObj.estimateVersion = tempObj.estimateVersion,
                                                        tempProObj.processingLevelId = savedAssembly._id;
                                                    // tempProObj.processingObj = proObj;
                                                    // tempProObj.processingObj = {};
                                                    EstimateProcessing.saveData(tempProObj, function (err, savedSubAssProcess) {
                                                        if (err) {
                                                            console.log('**** error at assProcessing of DraftEstimate.js ****', err);
                                                        } else {
                                                            assprocessingArray.push(savedSubAssProcess._id);
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
                                            function (callback) {
                                                async.eachSeries(found.addons, function (addonsObj, callback) {
                                                    var tempAddonObj = addonsObj;
                                                    tempAddonObj.addonsLevel = "estimate";
                                                    tempAddonObj.estimateVersion = tempObj.estimateVersion,
                                                        tempAddonObj.addonsLevelId = savedAssembly._id;
                                                    // tempAddonObj.addonObj = addonObj;
                                                    // tempAddonObj.addonObj = {};
                                                    EstimateAddons.saveData(tempAddonObj, function (err, savedSubAssAddon) {
                                                        if (err) {
                                                            console.log('**** error at assAddons of DraftEstimate.js ****', err);
                                                        } else {
                                                            assAddonsArray.push(savedSubAssAddon._id);
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
                                            function (callback) {
                                                async.eachSeries(found.extras, function (extrasObj, callback) {
                                                    var tempExtraObj = extrasObj;
                                                    tempExtraObj.extraLevel = "estimate";
                                                    tempExtraObj.estimateVersion = tempObj.estimateVersion,
                                                        tempExtraObj.extraLevelId = savedAssembly._id;
                                                    // tempExtraObj.extraObj = extrasObj;
                                                    // tempExtraObj.extraObj = {};
                                                    EstimateExtras.saveData(tempExtraObj, function (err, savedSubAssExtra) {
                                                        if (err) {
                                                            console.log('**** error at assExtras of DraftEstimate.js ****', err);
                                                        } else {
                                                            assExtrasArray.push(savedSubAssExtra._id);
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
                                        ], function (err) {
                                            if (err) {
                                                console.log('********** error at final response of async.waterfall  DraftEstimate.js ************', err);
                                            } else {
                                                savedAssembly.processing = assprocessingArray;
                                                savedAssembly.addons = assAddonsArray;
                                                savedAssembly.extras = assExtrasArray;
                                                savedAssembly.subAssemblies = subAssembliesArray;
                                                savedAssembly.draftEstimateObject = found;
                                                Estimate.saveData(savedAssembly, function (err, updatedAss) {
                                                    if (err) {
                                                        console.log('**** error at function_name of DraftEstimate.js ****', err);
                                                    } else {
                                                        callback(null, updatedAss);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });

                            }
                        });
                    }
                });
            }
        });
    },

    //-save the document in draft estimate table
    createDraftEstimate: function (data, callback) {

        var draftEstimateObj = {
            enquiryId: data.enquiryId,
            assemblyName: data.assemblyName,
            keyValueCalculations: {
                perimeter: null,
                sheetMetalArea: null,
                surfaceArea: null,
                weight: null,
                numbers: null,
                hours: null
            },
            totalWeight: null,
            materialCost: null,
            processingCost: null,
            addonCost: null,
            extrasCost: null,
            totalCost: null,
            estimateCreatedUser: null,
            estimateUpdatedUser: null,
            estimateDetails: {},
            estimateBoq: {},
            estimateAttachment: {},
            subAssemblies: [],
            processing: [],
            addons: [],
            extras: []
        };


        var generatedAsssemplyNumber = "";
        if (data._id) {
            DraftEstimate.saveData(data, function (err, savedData) {
                if (err) {
                    console.log('**** error at function_name of DraftEstimate.js ****', err);
                    callback(err, null);
                } else if (_.isEmpty(savedData)) {
                    callback(null, 'noDataFound');
                } else {
                    callback(null, savedData);
                }
            });
        } else {
            DraftEstimate.count().exec(function (err, found) {
                if (err) {
                    console.log('**** error at function_name of DraftEstimate.js ****', err);
                    callback(err, null);
                } else if (found == 0) {
                    draftEstimateObj.assemblyNumber = 'AS1';
                    console.log('**** if 0 ****', draftEstimateObj.assemblyNumber);
                    DraftEstimate.saveData(draftEstimateObj, function (err, savedData) {
                        if (err) {
                            console.log('**** error at function_name of Enquiry.js ****', err);
                            callback(err, null);
                        } else if (_.isEmpty(savedData)) {
                            callback(null, 'noDataFound');
                        } else {
                            callback(null, savedData);
                        }
                    });
                } else {
                    DraftEstimate.findOne().sort({
                        createdAt: -1
                    }).exec(function (err, lastDraftEstimate) {
                        if (err) {
                            console.log('**** error at function_name of DraftEstimate.js ****', err);
                            callback(err, null);
                        } else {
                            var temp = _.split(lastDraftEstimate.assemblyNumber, 'S');
                            var tempNUmber = _.toNumber(temp[1]) + 1;
                            draftEstimateObj.assemblyNumber = 'AS' + tempNUmber;
                        }
                        DraftEstimate.saveData(draftEstimateObj, function (err, savedData) {
                            if (err) {
                                console.log('**** error at function_name of Enquiry.js ****', err);
                                callback(err, null);
                            } else if (_.isEmpty(savedData)) {
                                callback(null, 'noDataFound');
                            } else {
                                callback(null, savedData);
                            }
                        });
                    });
                }
            });
        }
    },

    //-retrieve all records from draft estimate table
    getDraftEstimateData: function (data, callback) {
        DraftEstimate.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getDraftEstimateData of DraftEstimate.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    getDraftEstimateCustomerName: function (data, callback) {
        DraftEstimate.find().deepPopulate('estimateCreatedUser estimateUpdatedUser enquiryId.customerId')
            .select('assemblyName assemblyNumber enquiryId estimateCreatedUser estimateUpdatedUser materialCost processingCost addonCost extrasCost totalCost')
            .lean().exec(function (err, found) {
                if (err) {
                    console.log('**** error at function_name of DraftEstimate.js ****', err);
                    callback(err, null);
                } else if (_.isEmpty(found)) {
                    callback(null, 'noDataFound');
                } else {
                    console.log('**** inside %%%%% of DraftEstimate.js ****', found);
                    async.eachSeries(found, function (f, callback) {
                        console.log('**** inside ####### of DraftEstimate.js ****');
                        f.enquiryNumber = f.enquiryId.enquiryId;
                        f.customerName = f.enquiryId.customerId.customerName;
                        delete f.enquiryId;

                        callback();

                    }, function (err) {
                        if (err) {
                            console.log('***** error at final response of async.eachSeries in function_name of DraftEstimate.js*****', err);
                        } else {
                            callback(null, found);
                        }
                    });
                }
            });
    },
    generateDraftEstExcel: function (data, callback) {
        DraftEstimate.findOne({
            _id: data._id
        }).lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of DraftEstimate.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                var workbook = new Excel.Workbook();
                var worksheet1 = workbook.addWorksheet('Assembly');
                var worksheet2 = workbook.addWorksheet('Sub Assembly');
                var worksheet3 = workbook.addWorksheet('Sub Assembly Parts');
                var worksheet4 = workbook.addWorksheet('Part Processing');
                var worksheet5 = workbook.addWorksheet('Part Addons');
                var worksheet6 = workbook.addWorksheet('Part Extras');
                var worksheet7 = workbook.addWorksheet('Sub Assembly Processing');
                var worksheet8 = workbook.addWorksheet('Sub Assembly Addons');
                var worksheet9 = workbook.addWorksheet('Sub Assembly Extras');
                var worksheet10 = workbook.addWorksheet('Assembly Processing');
                var worksheet11 = workbook.addWorksheet('Assembly Addons');
                var worksheet12 = workbook.addWorksheet('Assembly Extras');

                worksheet1.columns = [{
                        header: 'Assembly Name',
                        key: 'assemblyName',
                        width: 20
                    },
                    {
                        header: 'Assembly Number',
                        key: 'assemblyNumber',
                        width: 20
                    },
                    {
                        header: 'KVC Perimeter',
                        key: 'keyValueCalculations.perimeter',
                        width: 15
                    },
                    {
                        header: 'KVC SheetMetalArea',
                        key: 'keyValueCalculations.SheetMetalArea',
                        width: 18
                    },
                    {
                        header: 'KVC SurfaceArea',
                        key: 'keyValueCalculations.surfaceArea',
                        width: 15
                    },
                    {
                        header: 'KVC Weight',
                        key: 'keyValueCalculations.weight',
                        width: 15
                    },
                    {
                        header: 'KVC Numbers',
                        key: 'keyValueCalculations.numbers',
                        width: 15
                    },
                    {
                        header: 'KVC Hours',
                        key: 'keyValueCalculations.hours',
                        width: 10
                    },

                    {
                        header: 'Total Weight',
                        key: 'totalWeight',
                        width: 10
                    }, {
                        header: 'Material Cost',
                        key: 'materialCost',
                        width: 17
                    }, {
                        header: 'Processing Cost',
                        key: 'processingCost',
                        width: 15
                    }, {
                        header: 'Addon Cost',
                        key: 'addonCost',
                        width: 10
                    }, {
                        header: 'Extra Cost',
                        key: 'extrasCost',
                        width: 10
                    }, {
                        header: 'Total Cost',
                        key: 'totalCost',
                        width: 10
                    }, {
                        header: 'Estimate Details',
                        key: 'estimateDetails',
                        width: 16
                    }, {
                        header: 'Estimate Boq',
                        key: 'estimateBoq',
                        width: 17
                    }
                ];

                worksheet1.addRow({
                    assemblyName: found.assemblyName,
                    assemblyNumber: found.assemblyNumber,
                    'keyValueCalculations.perimeter': found.keyValueCalculations.perimeter,
                    'keyValueCalculations.sheetMetalArea': found.keyValueCalculations.sheetMetalArea,
                    'keyValueCalculations.surfaceArea': found.keyValueCalculations.surfaceArea,
                    'keyValueCalculations.weight': found.keyValueCalculations.weight,
                    'keyValueCalculations.numbers': found.keyValueCalculations.numbers,
                    'keyValueCalculations.hours': found.keyValueCalculations.hours,
                    totalWeight: found.totalWeight,
                    materialCost: found.materialCost,
                    processingCost: found.processingCost,
                    addonCost: found.addonCost,
                    extrasCost: found.extrasCost,
                    totalCost: found.totalCost,
                    estimateDetails: found.estimateDetails,
                    estimateBoq: found.estimateBoq,
                });

                workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
                    console.log('sheet 1 is written');
                });

                async.eachSeries(found.subAssemblies, function (subAss, callback) {

                    worksheet2.columns = [{
                            header: 'Sub Assembly Name',
                            key: 'subAssemblyName',
                            width: 25,
                        }, {
                            header: 'Sub Assembly Number',
                            key: 'subAssemblyNumber',
                            width: 20
                        },
                        {
                            header: 'Quantity',
                            key: 'quantity',
                            width: 20
                        },
                        {
                            header: 'Total Value',
                            key: 'totalValue',
                            width: 10
                        },
                        {
                            header: 'KVC Perimeter',
                            key: 'keyValueCalculations.perimeter',
                            width: 15
                        },
                        {
                            header: 'KVC SheetMetalArea',
                            key: 'keyValueCalculations.SheetMetalArea',
                            width: 18
                        },
                        {
                            header: 'KVC SurfaceArea',
                            key: 'keyValueCalculations.surfaceArea',
                            width: 15
                        },
                        {
                            header: 'KVC Weight',
                            key: 'keyValueCalculations.weight',
                            width: 15
                        },
                        {
                            header: 'KVC Numbers',
                            key: 'keyValueCalculations.numbers',
                            width: 15
                        },
                        {
                            header: 'KVC hours',
                            key: 'keyValueCalculations.hours',
                            width: 10
                        },


                    ];

                    worksheet2.addRow({
                        subAssemblyName: subAss.subAssemblyName,
                        subAssemblyNumber: subAss.subAssemblyNumber,
                        quantity: subAss.quantity,
                        totalValue: subAss.totalValue,
                        'keyValueCalculations.perimeter': subAss.keyValueCalculations.perimeter,
                        'keyValueCalculations.sheetMetalArea': subAss.keyValueCalculations.sheetMetalArea,
                        'keyValueCalculations.surfaceArea': subAss.keyValueCalculations.surfaceArea,
                        'keyValueCalculations.weight': subAss.keyValueCalculations.weight,
                        'keyValueCalculations.numbers': subAss.keyValueCalculations.numbers,
                        'keyValueCalculations.hours': subAss.keyValueCalculations.hours,
                    });

                    workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
                        console.log('sheet 2 is written');
                    });
                    async.eachSeries(subAss.subAssemblyParts, function (part, callback) {
                        worksheet3.columns = [{
                                header: 'PartName',
                                key: 'partName',
                                width: 25,
                            }, {
                                header: 'PartNumber',
                                key: 'partNumber',
                                width: 20
                            },
                            {
                                header: 'Size',
                                key: 'size',
                                width: 20
                            },
                            {
                                header: 'Quantity',
                                key: 'quantity',
                                width: 10
                            },
                            {
                                header: 'ScaleFactor',
                                key: 'scaleFactor',
                                width: 10
                            },
                            {
                                header: 'FC MaterialPrice',
                                key: 'finalCalculation.materialPrice',
                                width: 20
                            },
                            {
                                header: 'FC ItemUnitPrice',
                                key: 'finalCalculation.itemUnitPrice',
                                width: 20
                            },
                            {
                                header: 'FC TotalCostForQuantity',
                                key: 'finalCalculation.totalCostForQuantity',
                                width: 20
                            },
                            {
                                header: 'KVC Perimeter',
                                key: 'keyValueCalculations.perimeter',
                                width: 20
                            },
                            {
                                header: 'KVC SheetMetalArea',
                                key: 'keyValueCalculations.sheetMetalArea',
                                width: 20
                            },
                            {
                                header: 'KVC SurfaceArea',
                                key: 'keyValueCalculations.surfaceArea',
                                width: 20
                            },
                            {
                                header: 'KVC Weight',
                                key: 'keyValueCalculations.weight',
                                width: 20
                            }

                        ];

                        worksheet3.addRow({
                            partName: part.partName,
                            partNumber: part.partNumber,
                            size: part.size,
                            quantity: part.quantity,
                            scaleFactor: part.scaleFactor,
                            'finalCalculation.materialPrice': part.finalCalculation.materialPrice,
                            'finalCalculation.itemUnitPrice': part.finalCalculation.itemUnitPrice,
                            'finalCalculation.totalCostForQuantity': part.finalCalculation.totalCostForQuantity,
                            'keyValueCalculations.perimeter': part.keyValueCalculations.perimeter,
                            'keyValueCalculations.sheetMetalArea': part.keyValueCalculations.sheetMetalArea,
                            'keyValueCalculations.surfaceArea': part.keyValueCalculations.surfaceArea,
                            'keyValueCalculations.weight': part.keyValueCalculations.weight

                        });

                        workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
                            console.log('sheet 3 is written');
                        });

                        async.waterfall([
                            function (callback) {
                                async.eachSeries(part.processing, function (proObj, callback) {
                                    // tempProObj.processingObj = proObj;
                                    worksheet4.columns = [
                                        // {
                                        //     header: 'processingLevel',
                                        //     key: 'processingLevel',
                                        //     width: 25,
                                        // }, 
                                        {
                                            header: 'ProcessingLevelId',
                                            key: 'processingLevelId',
                                            width: 20
                                        },
                                        {
                                            header: 'ProcessingNumber',
                                            key: 'processingNumber',
                                            width: 20
                                        },
                                        {
                                            header: 'Rate',
                                            key: 'rate',
                                            width: 10
                                        },
                                        {
                                            header: 'Quantity.keyValue.keyVariable',
                                            key: 'quantity.keyValue.keyVariable',
                                            width: 30
                                        },
                                        {
                                            header: 'Quantity.KeyValue.keyValue',
                                            key: 'quantity.keyValue.keyValue',
                                            width: 30
                                        },
                                        {
                                            header: 'Quantity.Utilization',
                                            key: 'quantity.utilization',
                                            width: 15
                                        },
                                        {
                                            header: 'Quantity.ContengncyOrWastage',
                                            key: 'quantity.contengncyOrWastage',
                                            width: 30
                                        },
                                        {
                                            header: 'Quantity.total',
                                            key: 'quantity.total',
                                            width: 15
                                        },
                                        {
                                            header: 'TotalCost',
                                            key: 'totalCost',
                                            width: 10
                                        },
                                        {
                                            header: 'Remarks',
                                            key: 'remarks',
                                            width: 20
                                        }


                                    ];

                                    worksheet4.addRow({
                                        // processingLevel: proObj.processingLevel,
                                        processingLevelId: proObj.processingLevelId,
                                        processingNumber: proObj.processingNumber,
                                        rate: proObj.rate,
                                        'quantity.keyValue.keyVariable': proObj.quantity.keyValue.keyVariable,
                                        'quantity.keyValue.keyValue': proObj.quantity.keyValue.keyValue,
                                        'quantity.utilization': proObj.quantity.utilization,
                                        'quantity.contengncyOrWastage': proObj.quantity.contengncyOrWastage,
                                        'quantity.total': proObj.quantity.total,
                                        'totalCost': proObj.totalCost,
                                        'remarks': proObj.remarks,
                                    });

                                    workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
                                        console.log('sheet 4 is written');
                                        callback();
                                    });


                                }, function (err) {
                                    if (err) {
                                        console.log('***** error at final response of async.eachSeries in partProcessing of DraftEstimate.js*****', err);
                                    } else {
                                        callback();
                                    }
                                });
                            },
                            function (callback) {
                                async.eachSeries(part.addons, function (addonsObj, callback) {
                                    worksheet5.columns = [
                                        // {
                                        //     header: 'addonsLevel',
                                        //     key: 'addonsLevel',
                                        //     width: 25,
                                        // },
                                        {
                                            header: 'AddonsLevelId',
                                            key: 'addonsLevelId',
                                            width: 20
                                        },
                                        {
                                            header: 'AddonNumber',
                                            key: 'addonNumber',
                                            width: 20
                                        },
                                        {
                                            header: 'Rate',
                                            key: 'rate',
                                            width: 10
                                        },
                                        {
                                            header: 'Quantity.SupportingVariable.SupportingVariable',
                                            key: 'quantity.supportingVariable.supportingVariable',
                                            width: 35
                                        },
                                        {
                                            header: 'Quantity.SupportingVariable.Value',
                                            key: 'quantity.supportingVariable.value',
                                            width: 30
                                        },
                                        {
                                            header: 'Quantity.KeyValue.KeyVariable',
                                            key: 'quantity.keyValue.keyVariable',
                                            width: 25
                                        },
                                        {
                                            header: 'Quantity.KeyValue.KeyValue',
                                            key: 'quantity.keyValue.keyValue',
                                            width: 20
                                        },
                                        {
                                            header: 'Quantity.Utilization',
                                            key: 'quantity.utilization',
                                            width: 20
                                        },
                                        {
                                            header: 'Quantity.ContengncyOrWastage',
                                            key: 'quantity.contengncyOrWastage',
                                            width: 25
                                        },
                                        {
                                            header: 'Quantity.Total',
                                            key: 'quantity.total',
                                            width: 20
                                        },
                                        {
                                            header: 'TotalCost',
                                            key: 'totalCost',
                                            width: 20
                                        },
                                        {
                                            header: 'Remarks',
                                            key: 'remarks',
                                            width: 10
                                        }
                                    ];

                                    worksheet5.addRow({
                                        // addonsLevel: addonsObj.addonsLevel,
                                        addonsLevelId: addonsObj.addonsLevelId,
                                        addonNumber: addonsObj.addonNumber,
                                        rate: addonsObj.rate,
                                        'quantity.supportingVariable.supportingVariable': addonsObj.quantity.supportingVariable.supportingVariable,
                                        'quantity.supportingVariable.value': addonsObj.quantity.supportingVariable.value,
                                        'quantity.keyValue.keyVariable': addonsObj.quantity.keyValue.keyVariable,
                                        'quantity.keyValue.keyValue': addonsObj.quantity.keyValue.keyValue,
                                        'quantity.utilization': addonsObj.quantity.utilization,
                                        'quantity.contengncyOrWastage': addonsObj.quantity.contengncyOrWastage,
                                        'quantity.total': addonsObj.quantity.total,
                                        totalCost: addonsObj.totalCost,
                                        remarks: addonsObj.remarks,

                                    });

                                    workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
                                        console.log('sheet 5 is written');
                                        callback();
                                    });

                                }, function (err) {
                                    if (err) {
                                        console.log('***** error at final response of async.eachSeries in partAddons of DraftEstimate.js*****', err);
                                    } else {
                                        callback();
                                    }
                                });
                            },
                            function (callback) {
                                async.eachSeries(part.extras, function (extrasObj, callback) {
                                    worksheet6.columns = [
                                        // {
                                        //     header: 'extraLevel',
                                        //     key: 'extraLevel',
                                        //     width: 25,
                                        // },
                                        {
                                            header: 'ExtraLevelId',
                                            key: 'extraLevelId',
                                            width: 15
                                        },
                                        {
                                            header: 'ExtraNumber',
                                            key: 'extraNumber',
                                            width: 15
                                        },
                                        {
                                            header: 'Quantity',
                                            key: 'quantity',
                                            width: 10
                                        },
                                        {
                                            header: 'TotalCost',
                                            key: 'totalCost',
                                            width: 15
                                        },
                                        {
                                            header: 'Remarks',
                                            key: 'remarks',
                                            width: 20
                                        }

                                    ];

                                    worksheet6.addRow({
                                        // extraLevel: extrasObj.extraLevel,
                                        extraLevelId: extrasObj.extraLevelId,
                                        extraNumber: extrasObj.extraNumber,
                                        quantity: extrasObj.quantity,
                                        totalCost: extrasObj.totalCost,
                                        remarks: extrasObj.remarks
                                    });

                                    workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
                                        console.log('sheet 6 is written');
                                        callback();
                                    });
                                }, function (err) {
                                    if (err) {
                                        console.log('***** error at final response of async.eachSeries in partExtras of DraftEstimate.js*****', err);
                                    } else {
                                        callback();
                                    }
                                });
                            }
                        ], function (err, finalResults) {
                            if (err) {
                                console.log('********** error at final response of async.waterfall  DraftEstimate.js ************', err);
                            } else {
                                callback(null, finalResults);
                            }
                        });
                    }, function (err) {
                        if (err) {
                            console.log('***** error at final response of 1st async.eachSeries in function_name of DraftEstimate.js *****', err);
                        } else {
                            async.waterfall([
                                function (callback) {
                                    async.eachSeries(subAss.processing, function (proObj, callback) {
                                        worksheet7.columns = [
                                            // {
                                            //     header: 'processingLevel',
                                            //     key: 'processingLevel',
                                            //     width: 25,
                                            // },
                                            {
                                                header: 'ProcessingLevelId',
                                                key: 'processingLevelId',
                                                width: 15
                                            },
                                            {
                                                header: 'ProcessingNumber',
                                                key: 'processingNumber',
                                                width: 15
                                            },
                                            {
                                                header: 'Rate',
                                                key: 'rate',
                                                width: 10
                                            },
                                            {
                                                header: 'Quantity.KeyValue.KeyVariable',
                                                key: 'quantity.keyValue.keyVariable',
                                                width: 30
                                            },
                                            {
                                                header: 'Quantity.KeyValue.KeyValue',
                                                key: 'quantity.keyValue.keyValue',
                                                width: 25
                                            },
                                            {
                                                header: 'Quantity.Utilization',
                                                key: 'quantity.utilization',
                                                width: 15
                                            },
                                            {
                                                header: 'Quantity.ContengncyOrWastage',
                                                key: 'quantity.contengncyOrWastage',
                                                width: 30
                                            },
                                            {
                                                header: 'Quantity.Total',
                                                key: 'quantity.total',
                                                width: 15
                                            },
                                            {
                                                header: 'TotalCost',
                                                key: 'totalCost',
                                                width: 10
                                            },
                                            {
                                                header: 'Remarks',
                                                key: 'remarks',
                                                width: 10
                                            }


                                        ];


                                        worksheet7.addRow({
                                            // processingLevel: proObj.processingLevel,
                                            processingLevelId: proObj.processingLevelId,
                                            processingNumber: proObj.processingNumber,
                                            rate: proObj.rate,
                                            'quantity.keyValue.keyVariable': proObj.quantity.keyValue.keyVariable,
                                            'quantity.keyValue.keyValue': proObj.quantity.keyValue.keyValue,
                                            'quantity.utilization': proObj.quantity.utilization,
                                            'quantity.contengncyOrWastage': proObj.quantity.contengncyOrWastage,
                                            'quantity.total': proObj.quantity.total,
                                            'totalCost': proObj.totalCost,
                                            'remarks': proObj.remarks,
                                        });

                                        workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
                                            console.log('sheet 7 is written');
                                            callback();
                                        });
                                    }, function (err) {
                                        if (err) {
                                            console.log('***** error at final response of async.eachSeries in partProcessing of DraftEstimate.js*****', err);
                                        } else {
                                            callback();
                                        }
                                    });
                                },
                                function (callback) {
                                    async.eachSeries(subAss.addons, function (addonsObj, callback) {
                                        worksheet8.columns = [
                                            // {
                                            //     header: 'addonsLevel',
                                            //     key: 'addonsLevel',
                                            //     width: 25,
                                            // },
                                            {
                                                header: 'AdonsLevelId',
                                                key: 'addonsLevelId',
                                                width: 15
                                            },
                                            {
                                                header: 'AddonNumber',
                                                key: 'addonNumber',
                                                width: 15
                                            },
                                            {
                                                header: 'rate',
                                                key: 'rate',
                                                width: 10
                                            },
                                            {
                                                header: 'Quantity.SupportingVariable.SupportingVariable',
                                                key: 'quantity.supportingVariable.supportingVariable',
                                                width: 35
                                            },
                                            {
                                                header: 'Quantity.SupportingVariable.Value',
                                                key: 'quantity.supportingVariable.value',
                                                width: 30
                                            },
                                            {
                                                header: 'Quantity.KeyValue.KeyVariable',
                                                key: 'quantity.keyValue.keyVariable',
                                                width: 25
                                            },
                                            {
                                                header: 'Quantity.KeyValue.keyValue',
                                                key: 'quantity.keyValue.keyValue',
                                                width: 20
                                            },
                                            {
                                                header: 'Quantity.Utilization',
                                                key: 'quantity.utilization',
                                                width: 20
                                            },
                                            {
                                                header: 'Quantity.ContengncyOrWastage',
                                                key: 'quantity.contengncyOrWastage',
                                                width: 25
                                            },
                                            {
                                                header: 'Quantity.Total',
                                                key: 'quantity.total',
                                                width: 15
                                            },
                                            {
                                                header: 'TotalCost',
                                                key: 'totalCost',
                                                width: 10
                                            },
                                            {
                                                header: 'Remarks',
                                                key: 'remarks',
                                                width: 20
                                            }
                                        ];

                                        worksheet8.addRow({
                                            // addonsLevel: addonsObj.addonsLevel,
                                            addonsLevelId: addonsObj.addonsLevelId,
                                            addonNumber: addonsObj.addonNumber,
                                            rate: addonsObj.rate,
                                            'quantity.supportingVariable.supportingVariable': addonsObj.quantity.supportingVariable.supportingVariable,
                                            'quantity.supportingVariable.value': addonsObj.quantity.supportingVariable.value,
                                            'quantity.keyValue.keyVariable': addonsObj.quantity.keyValue.keyVariable,
                                            'quantity.keyValue.keyValue': addonsObj.quantity.keyValue.keyValue,
                                            'quantity.utilization': addonsObj.quantity.utilization,
                                            'quantity.contengncyOrWastage': addonsObj.quantity.contengncyOrWastage,
                                            'quantity.total': addonsObj.quantity.total,
                                            totalCost: addonsObj.totalCost,
                                            remarks: addonsObj.remarks,

                                        });


                                        workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
                                            console.log('sheet 8 is written');
                                            callback();
                                        });


                                    }, function (err) {
                                        if (err) {
                                            console.log('***** error at final response of async.eachSeries in partAddons of DraftEstimate.js*****', err);
                                        } else {
                                            callback();
                                        }
                                    });
                                },
                                function (callback) {
                                    async.eachSeries(subAss.extras, function (extrasObj, callback) {
                                        worksheet9.columns = [
                                            // {
                                            //     header: 'extraLevel',
                                            //     key: 'extraLevel',
                                            //     width: 25,
                                            // },
                                            {
                                                header: 'ExtraLevelId',
                                                key: 'extraLevelId',
                                                width: 15
                                            },
                                            {
                                                header: 'ExtraNumber',
                                                key: 'extraNumber',
                                                width: 15
                                            },
                                            {
                                                header: 'Quantity',
                                                key: 'quantity',
                                                width: 10
                                            },
                                            {
                                                header: 'TotalCost',
                                                key: 'totalCost',
                                                width: 10
                                            },
                                            {
                                                header: 'Remarks',
                                                key: 'remarks',
                                                width: 20
                                            }

                                        ];

                                        worksheet9.addRow({
                                            // extraLevel: extrasObj.extraLevel,
                                            extraLevelId: extrasObj.extraLevelId,
                                            extraNumber: extrasObj.extraNumber,
                                            quantity: extrasObj.quantity,
                                            totalCost: extrasObj.totalCost,
                                            remarks: extrasObj.remarks
                                        });

                                        workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
                                            console.log('sheet 9 is written');
                                            callback();
                                        });


                                    }, function (err) {
                                        if (err) {
                                            console.log('***** error at final response of async.eachSeries in partExtras of DraftEstimate.js*****', err);
                                        } else {
                                            callback();
                                        }
                                    });
                                }
                            ], function (err, finalResults) {
                                if (err) {
                                    console.log('********** error at final response of async.waterfall  DraftEstimate.js ************', err);
                                    callback(err, null);
                                } else {
                                    callback(null, finalResults);

                                }
                            });
                        }
                    });

                }, function (err) {
                    if (err) {
                        console.log('***** error at final response of 2nd async.eachSeries in function_name of DraftEstimate.js *****', err);
                    } else {
                        async.waterfall([
                            function (callback) {
                                async.eachSeries(found.processing, function (proObj, callback) {
                                    worksheet10.columns = [
                                        //     {
                                        //         header: 'processingLevel',
                                        //         key: 'processingLevel',
                                        //         width: 25,
                                        //     },
                                        {
                                            header: 'ProcessingLevelId',
                                            key: 'processingLevelId',
                                            width: 15
                                        },
                                        {
                                            header: 'ProcessingNumber',
                                            key: 'processingNumber',
                                            width: 15
                                        },
                                        {
                                            header: 'Rate',
                                            key: 'rate',
                                            width: 10
                                        },
                                        {
                                            header: 'Quantity.KeyValue.KeyVariable',
                                            key: 'quantity.keyValue.keyVariable',
                                            width: 20
                                        },
                                        {
                                            header: 'Quantity.KeyValue.keyValue',
                                            key: 'quantity.keyValue.keyValue',
                                            width: 20
                                        },
                                        {
                                            header: 'Quantity.Utilization',
                                            key: 'quantity.utilization',
                                            width: 20
                                        },
                                        {
                                            header: 'Quantity.ContengncyOrWastage',
                                            key: 'quantity.contengncyOrWastage',
                                            width: 25
                                        },
                                        {
                                            header: 'Quantity.Total',
                                            key: 'quantity.total',
                                            width: 15
                                        },
                                        {
                                            header: 'TotalCost',
                                            key: 'totalCost',
                                            width: 10
                                        },
                                        {
                                            header: 'Remarks',
                                            key: 'remarks',
                                            width: 10
                                        }


                                    ];

                                    worksheet10.addRow({
                                        // processingLevel: proObj.processingLevel,
                                        processingLevelId: proObj.processingLevelId,
                                        processingNumber: proObj.processingNumber,
                                        rate: proObj.rate,
                                        'quantity.keyValue.keyVariable': proObj.quantity.keyValue.keyVariable,
                                        'quantity.keyValue.keyValue': proObj.quantity.keyValue.keyValue,
                                        'quantity.utilization': proObj.quantity.utilization,
                                        'quantity.contengncyOrWastage': proObj.quantity.contengncyOrWastage,
                                        'quantity.total': proObj.quantity.total,
                                        'totalCost': proObj.totalCost,
                                        'remarks': proObj.remarks,
                                    });

                                    workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
                                        console.log('sheet 10 is written');
                                        callback();
                                    });

                                }, function (err) {
                                    if (err) {
                                        console.log('***** error at final response of async.eachSeries in partProcessing of DraftEstimate.js*****', err);
                                    } else {
                                        callback();
                                    }
                                });
                            },
                            function (callback) {
                                async.eachSeries(found.addons, function (addonsObj, callback) {
                                    worksheet11.columns = [
                                        // {
                                        //     header: 'addonsLevel',
                                        //     key: 'addonsLevel',
                                        //     width: 25,
                                        // },
                                        {
                                            header: 'AddonsLevelId',
                                            key: 'addonsLevelId',
                                            width: 15
                                        },
                                        {
                                            header: 'AddonNumber',
                                            key: 'addonNumber',
                                            width: 15
                                        },
                                        {
                                            header: 'Rate',
                                            key: 'rate',
                                            width: 10
                                        },
                                        {
                                            header: 'Quantity.SupportingVariable.SupportingVariable',
                                            key: 'quantity.supportingVariable.supportingVariable',
                                            width: 35
                                        },
                                        {
                                            header: 'Quantity.SupportingVariable.Value',
                                            key: 'quantity.supportingVariable.value',
                                            width:30
                                        },
                                        {
                                            header: 'Quantity.keyValue.keyVariable',
                                            key: 'quantity.keyValue.keyVariable',
                                            width: 25
                                        },
                                        {
                                            header: 'Quantity.KeyValue.KeyValue',
                                            key: 'quantity.keyValue.keyValue',
                                            width: 20
                                        },
                                        {
                                            header: 'Quantity.Utilization',
                                            key: 'quantity.utilization',
                                            width: 20
                                        },
                                        {
                                            header: 'Quantity.ContengncyOrWastage',
                                            key: 'quantity.contengncyOrWastage',
                                            width: 25
                                        },
                                        {
                                            header: 'Quantity.Total',
                                            key: 'quantity.total',
                                            width: 20
                                        },
                                        {
                                            header:'TotalCost',
                                            key: 'totalCost',
                                            width: 15
                                        },
                                        {
                                            header: 'Remarks',
                                            key: 'remarks',
                                            width: 20
                                        }
                                    ];

                                    worksheet11.addRow({
                                        // addonsLevel: addonsObj.addonsLevel,
                                        addonsLevelId: addonsObj.addonsLevelId,
                                        addonNumber: addonsObj.addonNumber,
                                        rate: addonsObj.rate,
                                        'quantity.supportingVariable.supportingVariable': addonsObj.quantity.supportingVariable.supportingVariable,
                                        'quantity.supportingVariable.value': addonsObj.quantity.supportingVariable.value,
                                        'quantity.keyValue.keyVariable': addonsObj.quantity.keyValue.keyVariable,
                                        'quantity.keyValue.keyValue': addonsObj.quantity.keyValue.keyValue,
                                        'quantity.utilization': addonsObj.quantity.utilization,
                                        'quantity.contengncyOrWastage': addonsObj.quantity.contengncyOrWastage,
                                        'quantity.total': addonsObj.quantity.total,
                                        totalCost: addonsObj.totalCost,
                                        remarks: addonsObj.remarks,

                                    });


                                    workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
                                        console.log('sheet 11 is written');
                                        callback();
                                    });

                                }, function (err) {
                                    if (err) {
                                        console.log('***** error at final response of async.eachSeries in partAddons of DraftEstimate.js*****', err);
                                    } else {
                                        callback();
                                    }
                                });
                            },
                            function (callback) {
                                async.eachSeries(found.extras, function (extrasObj, callback) {
                                    worksheet12.columns = [
                                        // {
                                        //     header: 'extraLevel',
                                        //     key: 'extraLevel',
                                        //     width: 25,
                                        // },
                                        {
                                            header: 'ExtraLevelId',
                                            key: 'extraLevelId',
                                            width: 15
                                        },
                                        {
                                            header: 'ExtraNumber',
                                            key: 'extraNumber',
                                            width: 15
                                        },
                                        {
                                            header: 'Quantity',
                                            key: 'quantity',
                                            width: 10
                                        },
                                        {
                                            header: 'TotalCost',
                                            key: 'totalCost',
                                            width: 15
                                        },
                                        {
                                            header: 'Remarks',
                                            key: 'remarks',
                                            width: 20
                                        }

                                    ];

                                    worksheet12.addRow({
                                        // extraLevel: extrasObj.extraLevel,
                                        extraLevelId: extrasObj.extraLevelId,
                                        extraNumber: extrasObj.extraNumber,
                                        quantity: extrasObj.quantity,
                                        totalCost: extrasObj.totalCost,
                                        remarks: extrasObj.remarks
                                    });

                                    workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
                                        console.log('sheet 12 is written');
                                        callback();
                                    });

                                }, function (err) {
                                    if (err) {
                                        console.log('***** error at final response of async.eachSeries in partExtras of DraftEstimate.js*****', err);
                                    } else {
                                        callback();
                                    }
                                });
                            }
                        ], function (err) {
                            if (err) {
                                console.log('********** error at final response of async.waterfall  DraftEstimate.js ************', err);
                            } else {
                                callback(null, "success");
                            }
                        });
                    }
                });
            }

        });
    },

};


module.exports = _.assign(module.exports, exports, model);