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
                    fields: ['assemblyName', 'assemblyNumber'],
                    term: data.keyword
                }
            },
            sort: {
                desc: 'createdAt'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        DraftEstimate.find().sort({
                createdAt: -1
            }).deepPopulate('estimateCreatedUser estimateUpdatedUser enquiryId.customerId')
            .select('assemblyName assemblyNumber enquiryId estimateCreatedUser estimateUpdatedUser materialCost processingCost addonCost extrasCost totalCost')
            .lean()
            .order(options)
            .keyword(options)
            .page(options,
                function (err, found) {
                    console.log('**** $$$$$$4 ****', found.results);
                    if (err) {
                        console.log('**** error at search of Estimate.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(found)) {
                        callback(null, 'noDataFound');
                    } else {
                    async.eachSeries(found.results, function (f, callback) {
                        console.log('**** inside ####### of DraftEstimate.js ****');
                        f.enquiryNumber = f.enquiryId.enquiryId;
                        f.enquiry_Id = f.enquiryId._id;
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


    // getDraftEstimateCustomerName: function (data, callback) {
    //     DraftEstimate.find().deepPopulate('estimateCreatedUser estimateUpdatedUser enquiryId.customerId')
    //         .select('assemblyName assemblyNumber enquiryId estimateCreatedUser estimateUpdatedUser materialCost processingCost addonCost extrasCost totalCost')
    //         .lean().exec(function (err, found) {
    //             if (err) {
    //                 console.log('**** error at function_name of DraftEstimate.js ****', err);
    //                 callback(err, null);
    //             } else if (_.isEmpty(found)) {
    //                 callback(null, 'noDataFound');
    //             } else {
    //                 console.log('**** inside %%%%% of DraftEstimate.js ****', found);
    //                 async.eachSeries(found, function (f, callback) {
    //                     console.log('**** inside ####### of DraftEstimate.js ****');
    //                     f.enquiryNumber = f.enquiryId.enquiryId;
    //                     f.customerName = f.enquiryId.customerId.customerName;
    //                     delete f.enquiryId;

    //                     callback();

    //                 }, function (err) {
    //                     if (err) {
    //                         console.log('***** error at final response of async.eachSeries in function_name of DraftEstimate.js*****', err);
    //                     } else {
    //                         callback(null, found);
    //                     }
    //                 });
    //             }
    //         });
    // },

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
                var worksheet1 = workbook.addWorksheet(found.assemblyName);
                worksheet1.columns = [{
                        // header: 'Sub Assembly Number',
                        key: 'Sub Assembly No.',
                        width: 17
                    }, {
                        // header: 'SA Qty (Nos.)',
                        key: 'SA Qty (Nos.)',
                        width: 15
                    },
                    {
                        // header: 'SA name',
                        key: 'SA name',
                        width: 15
                    },
                    {
                        // header: 'Unit details',
                        key: 'Unit details.Part Total.Weight(kg)',
                        width: 15,
                    },
                    {
                        // header: '',
                        key: 'Unit details.Part Total.Cost(Rs)',
                        width: 10,
                    },

                    {
                        // header: '',
                        key: 'Unit details.Processing Cost(Rs.)',
                        width: 20,
                    },
                    {
                        // header: '',
                        key: 'Unit details.Addons.Weight(kg)',
                        width: 20,
                    },
                    {
                        // header: '',
                        key: 'Unit details.Addons.Cost(kg)',
                        width: 10,
                    },
                    {
                        // header: '',
                        key: 'Unit details.Extra Cost(Rs.)',
                        width: 15,
                    },
                    {
                        // header: '',
                        key: 'SA Unit Total.Weight(kg)',
                        width: 10,
                    },
                    {
                        // header: '',
                        key: 'SA Unit Total.Cost(Rs.)',
                        width: 10,
                    },
                    {
                        // header: '',
                        key: 'SA Quantity Total.Weight(kg)',
                        width: 15,
                    },
                    {
                        // header: '',
                        key: 'SA Quantity Total.Cost(Rs.',
                        width: 10,
                    }
                ];

                worksheet1.mergeCells('A4', 'A6');
                worksheet1.getCell('A5').value = 'Sub Assembly No.';

                worksheet1.getCell('A5').font = {
                    bold: true
                };


                worksheet1.mergeCells('B4', 'B6');
                worksheet1.getCell('B5').value = 'SA Qty (Nos.)';

                worksheet1.getCell('B5').font = {
                    bold: true
                };

                worksheet1.mergeCells('C4', 'C6');
                worksheet1.getCell('C5').value = 'SA name';
                worksheet1.getCell('C5').font = {
                    bold: true
                };

                worksheet1.mergeCells('D4', 'I4');
                worksheet1.getCell('D4').font = {
                    bold: true
                };

                // worksheet1.getCell('G1').value = 'Unit Details';

                worksheet1.mergeCells('D5', 'E5');
                worksheet1.getCell('D5').value = '                 Part Total';
                worksheet1.getCell('D5').font = {
                    bold: true
                };

                worksheet1.getCell('D6').value = 'Weight(kg)';
                worksheet1.getCell('D6').font = {
                    bold: true
                };

                worksheet1.getCell('E6').value = 'Cost(Rs)';
                worksheet1.getCell('E6').font = {
                    bold: true
                };

                worksheet1.mergeCells('F5', 'F6');
                worksheet1.getCell('F5').value = 'Processing Cost(Rs.)';
                worksheet1.getCell('F5').font = {
                    bold: true
                };

                worksheet1.mergeCells('G5', 'H5');
                worksheet1.getCell('G5').value = '                      Addons';
                worksheet1.getCell('G5').font = {
                    bold: true
                };

                worksheet1.getCell('G6').value = 'Weight(kg)';
                worksheet1.getCell('G6').font = {
                    bold: true
                };

                worksheet1.getCell('H6').value = 'Cost(Rs)';
                worksheet1.getCell('H6').font = {
                    bold: true
                };

                worksheet1.mergeCells('I5', 'I6');
                worksheet1.getCell('I5').value = 'Extra Cost(Rs.)';
                worksheet1.getCell('I5').font = {
                    bold: true
                };

                worksheet1.mergeCells('J4', 'K4');
                worksheet1.getCell('J4').value = '         SA Unit Total';
                worksheet1.getCell('J4').font = {
                    bold: true
                };

                worksheet1.mergeCells('J5', 'J6');
                worksheet1.getCell('J5').value = 'Weight(kg)';
                worksheet1.getCell('J5').font = {
                    bold: true
                };

                worksheet1.mergeCells('K5', 'K6');
                worksheet1.getCell('K5').value = 'Cost(Rs.)';
                worksheet1.getCell('K5').font = {
                    bold: true
                };

                worksheet1.mergeCells('L5', 'L6');
                worksheet1.getCell('L5').value = 'Weight(kg)';
                worksheet1.getCell('L5').font = {
                    bold: true
                };

                worksheet1.mergeCells('L4', 'M4');
                worksheet1.getCell('L4').value = '        SA Quantity Total';
                worksheet1.getCell('L4').font = {
                    bold: true
                };

                worksheet1.mergeCells('M5', 'M6');
                worksheet1.getCell('M5').value = 'Cost(Rs.)';
                worksheet1.getCell('M5').font = {
                    bold: true
                };

                worksheet1.getCell('D4').value = '                                                                       Unit details';
                worksheet1.getCell('D4').font = {
                    bold: true
                };
                var assObj = [];
                worksheet1.getCell('D5:E6').border = {
                    top: {
                        style: 'double',
                        color: {
                            argb: '#07040d'
                        }
                    },
                    left: {
                        style: 'double',
                        color: {
                            argb: '#07040d'
                        }
                    },
                    bottom: {
                        style: 'double',
                        color: {
                            argb: '#07040d'
                        }
                    },
                    right: {
                        style: 'double',
                        color: {
                            argb: '#07040d'
                        }
                    }
                };
                worksheet1.getCell('D4', 'I4').border = {
                    top: {
                        style: 'double',
                        color: {
                            argb: '#405e43'
                        }
                    },
                    left: {
                        style: 'double',
                        color: {
                            argb: '#405e43'
                        }
                    },
                    bottom: {
                        style: 'double',
                        color: {
                            argb: '#405e43'
                        }
                    },
                    right: {
                        style: 'double',
                        color: {
                            argb: '#405e43'
                        }
                    }
                };


                async.parallel([
                    function (callback) {
                        async.eachSeries(found.subAssemblies, function (subAss, callback) {
                            console.log('**** &&&&&& ****', subAss);
                            subAssObj = [];

                            subAssObj.push({
                                'Sub Assembly No.': 11,
                                'Unit details.Part Total.Weight(kg)': 10
                            })

                            console.log('****&&&&&&&& ****', subAssObj);

                            worksheet1.addRow({
                                'Sub Assembly No.': 11,
                                'Unit details.Part Total.Weight(kg)': 10
                            })

                            workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
                                console.log('sheet 1 is written');
                                callback();
                            });
                        }, function (err) {
                            if (err) {
                                console.log('***** error at final response of async.eachSeries in function_name of DraftEstimate.js*****', err);
                            } else {
                                callback();
                            }
                        });
                    },
                    // function (callback) {
                    //     callback(null, data);
                    // },
                    // function (callback) {
                    //     callback(null, data);
                    // }
                ], function (err, finalResults) {
                    if (err) {
                        console.log('********** error at final response of async.parallel  DraftEstimate.js ************', err);
                        callback(err, null);
                    } else if (_.isEmpty(finalResults)) {
                        callback(null, 'noDataFound');
                    } else {
                        callback(null, finalResults);
                    }
                });

            }
        });
    },

};

module.exports = _.assign(module.exports, exports, model);