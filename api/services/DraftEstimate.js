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
        //     DraftEstimate.findOne({
        //         _id: data._id
        //     }).lean().exec(function (err, found) {
        //         if (err) {
        //             console.log('**** error at function_name of DraftEstimate.js ****', err);
        //             callback(err, null);
        //         } else if (_.isEmpty(found)) {
        //             callback(null, []);
        //         } else {
        var workbook = new Excel.Workbook();
        var worksheet1 = workbook.addWorksheet('Assembly');
        //                 properties: {
        //                     tabColor: {
        //                         argb: 'FFC0000'
        //                     }
        //                 }
        //             });

        //             worksheet1.columns = [{
        //                 header: 'Assembly details: BLT Chute',
        //                 key: 'Assembly details: BLT Chute',
        //                 width: 20
        //             }]


        //             worksheet1.columns = [{
        //                     header: 'SA Qty.',
        //                     key: 'assemblyName',
        //                     width: 20
        //                 },
        //                 {
        //                     header: 'SA name',
        //                     key: 'subAssemblyName',
        //                     width: 20
        //                 },
        //                 {
        //                     header: 'Material',
        //                     key: 'Material',
        //                     width: 15
        //                 },
        //                 {
        //                     header: 'Type',
        //                     key: 'Type',
        //                     width: 18
        //                 },
        //                 {
        //                     header: 'Category / Sub-Cat',
        //                     key: 'Category / Sub-Cat',
        //                     width: 15
        //                 },
        //                 {
        //                     header: 'Item',
        //                     key: 'Item',
        //                     width: 15
        //                 },
        //                 {
        //                     header: 'KVC Numbers',
        //                     key: 'keyValueCalculations.numbers',
        //                     width: 15
        //                 },
        //                 {
        //                     header: 'KVC Hours',
        //                     key: 'keyValueCalculations.hours',
        //                     width: 10
        //                 },

        //                 {
        //                     header: 'Total Weight',
        //                     key: 'totalWeight',
        //                     width: 10
        //                 }, {
        //                     header: 'Material Cost',
        //                     key: 'materialCost',
        //                     width: 17
        //                 }, {
        //                     header: 'Processing Cost',
        //                     key: 'processingCost',
        //                     width: 15
        //                 }, {
        //                     header: 'Addon Cost',
        //                     key: 'addonCost',
        //                     width: 10
        //                 }, {
        //                     header: 'Extra Cost',
        //                     key: 'extrasCost',
        //                     width: 10
        //                 }, {
        //                     header: 'Total Cost',
        //                     key: 'totalCost',
        //                     width: 10
        //                 }, {
        //                     header: 'Estimate Details',
        //                     key: 'estimateDetails',
        //                     width: 16
        //                 }, {
        //                     header: 'Estimate Boq',
        //                     key: 'estimateBoq',
        //                     width: 17
        //                 }
        //             ];

        //             workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
        //                 console.log('sheet 1 is written');
        //                 callback();
        //             });

        //         }
        //     });
        worksheet1.columns = [
            {
                header: 'SA Number',
                key: 'subAssemblyNumber',
                width: 10
            },
            {
                header: 'SA Qty.',
                key: 'id',
                width: 10
            },
            {
                header: 'SA name',
                key: 'subAssemblyName',
                width: 32
            },
            {
                header: 'Material',
                key: 'Material',
                width: 10,
                outlineLevel: 1
            },
            {
                header: 'Type',
                key: 'Type',
                width: 10,
                outlineLevel: 1
            },
            {
                header: 'Category / Sub-Cat',
                key: 'Category / Sub-Cat',
                width: 10,
                outlineLevel: 1
            },
            {
                header: 'Item',
                key: 'Item',
                width: 10,
                outlineLevel: 1
            },
            {
                header: 'Weight (kg)',
                key: 'Weight',
                width: 10,
                outlineLevel: 1
            },
            {
                header: 'Cost (Rs.)',
                key: 'Cost',
                width: 10,
                outlineLevel: 1
            },
            {
                header: 'Processing Cost',
                key: 'Processing Cost',
                width: 10,
                outlineLevel: 1
            },
            {
                header: 'Weight',
                key: 'Weight',
                width: 10,
                outlineLevel: 1
            },
            {
                header: 'Cost',
                key: 'Cost',
                width: 10,
                outlineLevel: 1
            },
            // {
            //     header: 'Type',
            //     key: 'DOB',
            //     width: 10,
            //     outlineLevel: 1
            // },

        ];

        var Col7 = worksheet1.getColumn(7);
        var Col8 = worksheet1.getColumn(8);
        var Col9 = worksheet1.getColumn(9);
        var Col10 = worksheet1.getColumn(10);
        var Col11 = worksheet1.getColumn(11);
        var Col12 = worksheet1.getColumn(12);
        var Col13 = worksheet1.getColumn(13);
        var Col14 = worksheet1.getColumn(14);
        var Col15 = worksheet1.getColumn(15);
        var Col16 = worksheet1.getColumn(16);

        
        Col7.header = ['Unit details','Part Total', 'Weight'];
        Col8.header = ['Unit details','Part Total', 'Cost'];
        Col9.header = ['Unit details','Processing Cost'];
        Col10.header = ['Unit details','Addons', 'Weight'];
        Col11.header = ['Unit details','Addons', 'Cost'];
        Col12.header = ['Unit details','Extra Cost'];
        Col13.header = ['SA Unit Total','Weight'];
        Col14.header = ['SA Unit Total', 'Cost'];
        Col15.header = ['SA Quantity Total','Weight'];
        Col16.header = ['SA Quantity Total', 'Cost'];

        worksheet1.mergeCells('G1:H1');
        worksheet1.mergeCells('I1:J1');
        worksheet1.mergeCells('K1:L1');

        // worksheet1.getCell('G1:H1:I1:J1:K1:L1').value = '        Unit details';

        workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
            console.log('sheet 1 is written');
            callback();
        });

    },
};

module.exports = _.assign(module.exports, exports, model);