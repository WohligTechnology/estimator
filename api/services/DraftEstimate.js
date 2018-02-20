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
        grossWeight: Number,
        netWeight: Number
    },
    totalWeight: Number,
    materialCost: Number,
    processingCost: Number,
    addonCost: Number,
    extrasCost: Number,
    totalCost: Number,
    negotiation: Number,
    commission: Number,
    other: Number,
    scaleFactors: {
        factor: String,
        low: Number,
        medium: Number,
        high: Number,
        budgetory: Number
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
    draftEstimateExcel:{
        type:String
    },
    subAssemblies: [],
    processing: [],
    addons: [],
    extras: []

});

schema.plugin(deepPopulate, {
    populate: {
        'enquiryId.customerId': {
            select: '',
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

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'enquiryId enquiryId.customerId', 'enquiryId enquiryId.customerId'));
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

                // console.log(' @@@@@@@@@@@@@@@@@ found @@@@@@@@@@@@@@@@@@@', found);

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
                            // console.log('**** !!!!!!!!!!!!!!!!!! ****', tempObj);
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

                                var partError = {
                                    status: true,
                                    partName: ""
                                };

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
                                                // console.log('**** ^^^^^^^^^^^^^ ****', part);
                                                var partObj = {
                                                    estimateVersion: tempObj.estimateVersion,
                                                    partName: part.partName,
                                                    partIcon: part.partIcon,
                                                    partNumber: part.partNumber,
                                                    subAssemblyId: savedSubAss._id,
                                                    shortcut: part.shortcut._id,
                                                    partType: part.partType._id,
                                                    material: part.material._id,
                                                    // shape:shape._id,
                                                    size: part.size,
                                                    customMaterial: part.customMaterial._id,
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
                                                        console.log('**** error attttttt $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ EstimatePart.saveData of DraftEstimate.js ****', err);
                                                        partError.partName = part.partName;
                                                        partError.status = false;
                                                        callback();
                                                    } else if (_.isEmpty(savedPart)) {
                                                        callback(null, 'noDataFound');
                                                    } else {

                                                        console.log('**** success at @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@SS level of DraftEstimate.js ****');

                                                        partsArray.push(savedPart._id);
                                                        async.waterfall([
                                                            function (callback) {
                                                                async.eachSeries(part.processing, function (proObj, callback) {
                                                                    var tempProObj = proObj;
                                                                    tempProObj.processingLevel = "part";
                                                                    tempProObj.estimateVersion = tempObj.estimateVersion;
                                                                    tempProObj.processingLevelId = savedPart._id;
                                                                    // tempProObj.processingObj = proObj;
                                                                    if (tempProObj.processItem == '' || 'undefined') {
                                                                        delete tempProObj.processItem;
                                                                    }

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
                                                                    tempAddonObj.estimateVersion = tempObj.estimateVersion;
                                                                    tempAddonObj.addonsLevel = "part";
                                                                    tempAddonObj.addonsLevelId = savedPart._id;
                                                                    // tempAddonObj.addonObj = addonsObj;

                                                                    if (tempAddonObj.addonItem == '' || 'undefined') {
                                                                        delete tempAddonObj.addonItem;
                                                                    }

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
                                                                    tempExtraObj.estimateVersion = tempObj.estimateVersion;
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
                                                                tempProObj.estimateVersion = tempObj.estimateVersion;
                                                                tempProObj.processingLevelId = savedSubAss._id;
                                                                // tempProObj.processingObj = proObj;
                                                                // tempProObj.processingObj = {};

                                                                if (tempProObj.processItem == '' || "undefined") {
                                                                    delete tempProObj.processItem;
                                                                }

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
                                                                tempAddonObj.estimateVersion = tempObj.estimateVersion;
                                                                tempAddonObj.addonsLevelId = savedSubAss._id;
                                                                // tempAddonObj.addonObj = addonsObj;
                                                                // tempAddonObj.addonObj = {};
                                                                if (tempAddonObj.addonItem == '' || 'undefined') {
                                                                    delete tempAddonObj.addonItem;
                                                                }

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
                                                    tempProObj.estimateVersion = tempObj.estimateVersion;
                                                    tempProObj.processingLevelId = savedAssembly._id;
                                                    // tempProObj.processingObj = proObj;
                                                    // tempProObj.processingObj = {};
                                                    if (tempProObj.processItem == '') {
                                                        delete tempProObj.processItem;
                                                    }
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
                                                    tempAddonObj.estimateVersion = tempObj.estimateVersion;
                                                    tempAddonObj.addonsLevelId = savedAssembly._id;
                                                    // tempAddonObj.addonObj = addonObj;
                                                    // tempAddonObj.addonObj = {};
                                                    if (tempAddonObj.addonItem == '' || "undefined") {
                                                        delete tempAddonObj.addonItem;
                                                    }

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
                                                    tempExtraObj.estimateVersion = tempObj.estimateVersion;
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
                                                        callback(null, partError);
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
                grossWeight: null,
                netWeight: null
            },
            totalWeight: null,
            materialCost: null,
            processingCost: null,
            addonCost: null,
            extrasCost: null,
            totalCost: null,
            estimateCreatedUser: data.estimateCreatedUser,
            estimateUpdatedUser: data.estimateCreatedUser,
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
                    } else if (_.isEmpty(found.results)) {
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
                            });

                            console.log('****&&&&&&&& ****', subAssObj);

                            worksheet1.addRow({
                                'Sub Assembly No.': 11,
                                'Unit details.Part Total.Weight(kg)': 10
                            });

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

    checkEnquiryEstimate: function (data, callback) {
        // console.log('**** inside function_name of DraftEstimate.js ****');
        DraftEstimate.findOne({
            enquiryId: data.enquiryId
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of DraftEstimate.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                console.log('**** inside empty of DraftEstimate.js ****');
                callback(null, "false");
            } else {
                callback(null, "true");
            }
        });
    },
    generateDraftEstimateExcel: function (data, callback) {
        DraftEstimate.findOne({
            _id: data._id
        }).lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of Estimate.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                var workbook = new Excel.Workbook();
                var finalExcelObj = {
                    assemblySheet: [],
                    enquirySheet: {},
                    subAssembliesSheets: [],
                    partSheet: []
                };
                var tempPartSheetArrays = [];
                async.auto({
                        //- Operation to generate excel sheet for Sub Assembly Part.
                        part: function (callback) {
                            var worksheet1 = workbook.addWorksheet('Part Records');
                            worksheet1.columns = [{
                                    // header: 'Sub Assembly Number',
                                    key: '',
                                    width: 2
                                }, {
                                    // header: 'Sub Assembly Number',
                                    key: 'Part Qty.(Nos.)',
                                    width: 10
                                }, {
                                    // header: 'SA Qty (Nos.)',
                                    key: 'Part Name',
                                    width: 15
                                },
                                {
                                    // header: 'SA name',
                                    key: 'PartNumber',
                                    width: 15
                                },
                                {
                                    // header: 'Unit details',
                                    key: 'Material',
                                    width: 15,
                                },
                                {
                                    // header: '',
                                    key: 'Type',
                                    width: 15,
                                },

                                {
                                    // header: '',
                                    key: 'Category/Sub-Cat',
                                    width: 25,
                                },
                                {
                                    // header: '',
                                    key: 'Item',
                                    width: 20,
                                },
                                {
                                    // header: '',
                                    key: 'PartUnitdetails.QuantityWithinPart.Value',
                                    width: 7,
                                },
                                {
                                    // header: '',
                                    key: 'PartUnitdetails.QuantityWithinPart.UOM',
                                    width: 12,
                                },
                                {
                                    // header: '',
                                    key: 'PartUnitdetails.Part.NetWeight(kg)',
                                    width: 15,
                                },

                                {
                                    // header: '',
                                    key: 'PartUnitdetails.Part.GrossWeight(kg)',
                                    width: 15,
                                },
                                {
                                    // header: '',
                                    key: 'PartUnitdetails.Part.Cost(Rs.)',
                                    width: 10,
                                },
                                {
                                    // header: '',
                                    key: 'PartUnitDetails.ProcessingCost(Rs.)',
                                    width: 10,
                                },
                                {
                                    // header: '',
                                    key: 'PartUnitDetails.Addons.Weight(Kg)',
                                    width: 10,
                                },
                                {
                                    // header: '',
                                    key: 'PartUnitDetails.Addons.Cost(Rs)',
                                    width: 10,
                                },
                                {
                                    // header: '',
                                    key: 'PartUnitDetails.ExtraCost(Rs)',
                                    width: 10,
                                },
                                {
                                    // header: '',
                                    key: 'PartUnitTotal.Weight(Kg)',
                                    width: 10,
                                },
                                {
                                    // header: '',
                                    key: 'PartUnitTotal.Cost(kg)',
                                    width: 10,
                                },
                                {
                                    // header: '',
                                    key: 'QuantityTotal.Weight(Kg.)',
                                    width: 10,
                                },
                                {
                                    // header: '',
                                    key: 'QuantityTotal.Cost(Rs)',
                                    width: 10,
                                }
                            ];
                            // worksheet1.getCell('A3').value = '';

                            worksheet1.mergeCells('B2', 'B4');
                            worksheet1.getCell('B3').value = 'Part Qty.(Nos.)';
                            worksheet1.getCell('B3').font = {
                                bold: true
                            };
                            worksheet1.mergeCells('C2', 'C4');
                            worksheet1.getCell('C3').value = 'Part Name';
                            worksheet1.getCell('C3').font = {
                                bold: true
                            };
                            worksheet1.mergeCells('D2', 'D4');
                            worksheet1.getCell('D3').value = 'PartNumber';
                            worksheet1.getCell('D3').font = {
                                bold: true
                            };
                            worksheet1.mergeCells('E2', 'E4');
                            worksheet1.getCell('E3').value = 'Material';
                            worksheet1.getCell('E3').font = {
                                bold: true
                            };
                            worksheet1.mergeCells('F2', 'F4');
                            worksheet1.getCell('F3').value = 'Type';
                            worksheet1.getCell('F3').font = {
                                bold: true
                            };
                            worksheet1.mergeCells('G2', 'G4');
                            worksheet1.getCell('G3').value = 'Category/Sub-Cat';
                            worksheet1.getCell('G3').font = {
                                bold: true
                            };
                            worksheet1.mergeCells('H2', 'H4');
                            worksheet1.getCell('H3').value = 'Item';
                            worksheet1.getCell('H3').font = {
                                bold: true
                            };
                            worksheet1.mergeCells('I2', 'Q2');
                            worksheet1.getCell('I2').value = '                                         Part Unit Details';
                            worksheet1.getCell('I2').font = {
                                bold: true
                            };
                            worksheet1.mergeCells('I3', 'J3');
                            worksheet1.getCell('I3').value = ' Quantity Within Part';
                            worksheet1.getCell('I3').font = {
                                bold: true
                            };
                            worksheet1.getCell('I4').value = 'Value';
                            worksheet1.getCell('I4').font = {
                                bold: true
                            };
                            worksheet1.getCell('J4').value = 'UOM';
                            worksheet1.getCell('J4').font = {
                                bold: true
                            };
                            worksheet1.mergeCells('K3', 'M3');
                            worksheet1.getCell('K3').value = '                       Part';
                            worksheet1.getCell('K3').font = {
                                bold: true
                            };
                            worksheet1.getCell('K4').value = 'Net Weight(kg)';
                            worksheet1.getCell('K4').font = {
                                bold: true
                            };
                            worksheet1.getCell('L4').value = 'Gross Weight(kg)';
                            worksheet1.getCell('L4').font = {
                                bold: true
                            };
                            worksheet1.getCell('M4').value = 'Cost(Rs.)';
                            worksheet1.getCell('M4').font = {
                                bold: true
                            };
                            worksheet1.mergeCells('N3', 'N4');
                            worksheet1.getCell('N4').value = 'Processing Cost(Rs.)';
                            worksheet1.getCell('N4').font = {
                                bold: true
                            };
                            worksheet1.mergeCells('O3', 'P3');
                            worksheet1.getCell('O3').value = '             Addons';
                            worksheet1.getCell('O3').font = {
                                bold: true
                            };
                            worksheet1.getCell('O4').value = 'Weight(kg)';
                            worksheet1.getCell('O4').font = {
                                bold: true
                            };
                            worksheet1.getCell('P4').value = 'Cost(Rs.)';
                            worksheet1.getCell('P4').font = {
                                bold: true
                            };
                            worksheet1.mergeCells('Q3', 'Q4');
                            worksheet1.getCell('Q3').value = 'Extra Cost(Rs.)';
                            worksheet1.getCell('Q3').font = {
                                bold: true
                            };
                            worksheet1.mergeCells('R2', 'S2');
                            worksheet1.getCell('S2').value = '            Part Unit Total';
                            worksheet1.getCell('S2').font = {
                                bold: true
                            };
                            worksheet1.mergeCells('R3', 'R4');
                            worksheet1.getCell('R3').value = 'Weight(Kg)';
                            worksheet1.getCell('R3').font = {
                                bold: true
                            };
                            worksheet1.mergeCells('S3', 'S4');
                            worksheet1.getCell('S3').value = 'Cost(Rs.)';
                            worksheet1.getCell('S3').font = {
                                bold: true
                            };
                            worksheet1.mergeCells('T2', 'U2');
                            worksheet1.getCell('T2').value = '     Quantity Total';
                            worksheet1.getCell('T2').font = {
                                bold: true
                            };
                            worksheet1.mergeCells('T3', 'T4');
                            worksheet1.getCell('T3').value = 'Weight(kg)';
                            worksheet1.getCell('T3').font = {
                                bold: true
                            };
                            worksheet1.mergeCells('U3', 'U4');
                            worksheet1.getCell('U3').value = 'Cost(Rs.)';
                            worksheet1.getCell('U3').font = {
                                bold: true
                            };

                            // worksheet1.views = [{
                            //     state: 'split',
                            //     ySplit: 600,
                            //     topLeftCell: 'A4',
                            //     activeCell: 'A4'
                            // }];

                            //-Giving boarder to part header

                            worksheet1.getCell('B2').border = {
                                top: {
                                    style: 'thin'
                                },
                                left: {
                                    style: 'thin'
                                },
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };


                            worksheet1.getCell('C2').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };


                            worksheet1.getCell('D2').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet1.getCell('E2').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet1.getCell('F2').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet1.getCell('G2').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };
                            worksheet1.getCell('H2').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet1.getCell('I2').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet1.getCell('I3').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet1.getCell('I4').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };
                            worksheet1.getCell('J4').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet1.getCell('K3').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet1.getCell('K4').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };


                            worksheet1.getCell('L4').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };
                            worksheet1.getCell('M4').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet1.getCell('N3').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };
                            worksheet1.getCell('O3').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };
                            worksheet1.getCell('O4').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet1.getCell('P4').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };
                            worksheet1.getCell('Q3').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet1.getCell('R2').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet1.getCell('R3').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet1.getCell('S3').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };
                            worksheet1.getCell('T2').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet1.getCell('T3').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet1.getCell('U3  ').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };
                            partTotalData = [];
                            // finalExcelObj.count = 0;
                            var partTotalDetailTempRow = {
                                partQty: 0,
                                partName: "",
                                partNum: "",
                                material: "",
                                type: "Part Total",
                                catSubCat: "",

                                item: "",
                                value: 0,
                                uom: "",
                                netWeight: 0,
                                grossWeight: 0,
                                partCost: 0,
                                processingCost: 0,

                                addonWeight: 0,
                                addonCost: 0,
                                extraCost: 0,
                                partUnitWeight: 0,
                                partUnitCost: 0,
                                partQtyWeight: 0,
                                partQtyCost: 0

                            };
                            async.eachSeries(found.subAssemblies, function (subAss, callback) {

                                subAssName = subAss.subAssemblyName;
                                async.eachSeries(subAss.subAssemblyParts, function (subAssPart, callback) {
                                    partTotalDetailTempRow.partName = subAssPart.partName;
                                    partTotalDetailTempRow.partQty = subAssPart.quantity;
                                    partTotalDetailTempRow.partNum = subAssPart.partNumber;

                                    var partExcelArray = [];
                                    MMaterial.findOne({
                                        _id: subAssPart.material
                                    }).populate('materialSubCategory').lean().exec(function (err, materialSubCatName) {
                                        if (err) {
                                            console.log('**** error at function_name of Estimate.js ****', err);
                                            callback(err, null);
                                        } else if (_.isEmpty(materialSubCatName)) {
                                            callback(null, []);
                                        } else {
                                            partExcelObj = {
                                                "Part Qty.(Nos.)": "",
                                                "Part Name": "",
                                                "PartNumber": "",
                                                "Material": "",
                                                "Type": "Part",
                                                "Category/Sub-Cat": materialSubCatName.materialSubCategory.materialSubCatName,
                                                "Item": materialSubCatName.materialName,
                                                "PartUnitdetails.QuantityWithinPart.Value": subAssPart.quantity,
                                                "PartUnitdetails.QuantityWithinPart.UOM": "",
                                                "PartUnitdetails.Part.NetWeight(kg)": subAssPart.keyValueCalculations.netWeight,
                                                "PartUnitdetails.Part.GrossWeight(kg)": subAssPart.keyValueCalculations.grossWeight,
                                                "PartUnitdetails.Part.Cost(Rs.)": subAssPart.finalCalculation.itemUnitPrice,
                                                "PartUnitDetails.ProcessingCost(Rs.)": "",
                                                "PartUnitDetails.Addons.Weight(Kg)": "",
                                                "PartUnitDetails.Addons.Cost(Rs)": "",
                                                "PartUnitDetails.ExtraCost(Rs)": "",
                                                "PartUnitTotal.Weight(Kg)": "",
                                                "PartUnitTotal.Cost(kg)": "",
                                                "QuantityTotal.Weight(Kg.)": "",
                                                "QuantityTotal.Cost(Rs)": ""
                                            };


                                            partExcelArray.push(partExcelObj);

                                            async.waterfall([
                                                    //- part processing operation
                                                    function (callback) {
                                                        partTotalDetailTempRow.processingCost = 0;
                                                        async.eachSeries(subAssPart.processing, function (partProc, callback) {
                                                            MProcessItem.findOne({
                                                                _id: partProc.processItem
                                                            }).select('processItemName').lean().exec(function (err, proItemName) {
                                                                if (err) {
                                                                    console.log('**** error at function_name of Estimate.js ****', err);
                                                                    callback(err, null);
                                                                } else if (_.isEmpty(proItemName)) {
                                                                    callback(null, []);
                                                                } else {
                                                                    MProcessType.findOne({
                                                                        _id: partProc.processType
                                                                    }).deepPopulate('processCat quantity.finalUom').lean().exec(function (err, partProcessTypeData) {
                                                                        console.log('**** inside partProcessTypeData of Estimate.js & data is ****', partProcessTypeData);
                                                                        if (err) {
                                                                            console.log('**** error at function_name of Estimate.js ****', err);
                                                                            callback(err, null);
                                                                        } else if (_.isEmpty(partProcessTypeData)) {
                                                                            callback(null, []);
                                                                        } else {
                                                                            var partProUomId = partProcessTypeData.quantity.finalUom._id;
                                                                            MUom.findOne({
                                                                                _id: partProUomId
                                                                            }).select('uomName').lean().exec(function (err, proUom) {
                                                                                // console.log('**** inside partProcessTypeData ****', proUom);

                                                                                if (err) {
                                                                                    console.log('**** error at function_name of Estimate.js ****', err);
                                                                                    callback(err, null);
                                                                                } else if (_.isEmpty(proUom)) {
                                                                                    callback(null, 'noDataFound');
                                                                                } else {
                                                                                    processingTotalCost = partProc.totalCost * partProc.quantity.totalQuantity;
                                                                                    partTotalDetailTempRow.processingCost = partTotalDetailTempRow.processingCost + processingTotalCost;

                                                                                    // proCatName = partProcessTypeData.processCat.processCatName;
                                                                                    partProExcelObj = {
                                                                                        "Part Qty.(Nos.)": "",
                                                                                        "Part Name": "",
                                                                                        "PartNumber": "",
                                                                                        "Material": "",
                                                                                        "Type": "Processing",
                                                                                        "Category/Sub-Cat": partProcessTypeData.processCat.processCatName,
                                                                                        "Item": proItemName.processItemName,
                                                                                        "PartUnitdetails.QuantityWithinPart.Value": partProc.quantity.totalQuantity,
                                                                                        "PartUnitdetails.QuantityWithinPart.UOM": proUom.uomName,
                                                                                        "PartUnitdetails.Part.NetWeight(kg)": "",
                                                                                        "PartUnitdetails.Part.GrossWeight(kg)": "",
                                                                                        "PartUnitdetails.Part.Cost(Rs.)": "",
                                                                                        "PartUnitDetails.ProcessingCost(Rs.)": processingTotalCost,
                                                                                        "PartUnitDetails.Addons.Weight(Kg)": "",
                                                                                        "PartUnitDetails.Addons.Cost(Rs)": "",
                                                                                        "PartUnitDetails.ExtraCost(Rs)": "",
                                                                                        "PartUnitTotal.Weight(Kg)": "",
                                                                                        "PartUnitTotal.Cost(kg)": "",
                                                                                        "QuantityTotal.Weight(Kg.)": "",
                                                                                        "QuantityTotal.Cost(Rs)": ""
                                                                                    };
                                                                                    partExcelArray.push(partProExcelObj);
                                                                                    callback();
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }, function (err) {
                                                            if (err) {
                                                                console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                                            } else {
                                                                callback(null, "done");
                                                            }
                                                        });
                                                    },
                                                    //- part addons operation
                                                    function (dsds, callback) {
                                                        partTotalDetailTempRow.addonCost = 0;
                                                        partTotalDetailTempRow.addonWeight = 0;
                                                        async.eachSeries(subAssPart.addons, function (partAddons, callback) {
                                                            MAddonType.findOne({
                                                                _id: partAddons.addonType._id
                                                            }).deepPopulate('materialSubCat').lean().exec(function (err, addMatSubCatName) {
                                                                var addonMaterialSubCatName = addMatSubCatName.materialSubCat.materialSubCatName;
                                                                if (err) {
                                                                    console.log('**** error at function_name of Estimate.js ****', err);
                                                                    callback(err, null);
                                                                } else if (_.isEmpty(addMatSubCatName)) {
                                                                    callback(null, 'noDataFound');
                                                                } else {
                                                                    // console.log('addMatSubCatName addMatSubCatName 88888', addMatSubCatName.rate.uom);
                                                                    MUom.findOne({
                                                                        _id: addMatSubCatName.rate.uom
                                                                    }).lean().exec(function (err, addUom) {
                                                                        if (err) {
                                                                            console.log('**** error at function_name of Estimate.js ****', err);
                                                                            callback(err, null);
                                                                        } else if (_.isEmpty(addUom)) {
                                                                            callback(null, []);
                                                                        } else {
                                                                            MMaterial.findOne({
                                                                                _id: partAddons.addonItem
                                                                            }).select('materialName weightPerUnit').lean().exec(function (err, addonsMatName) {
                                                                                if (err) {
                                                                                    console.log('**** error at function_name of Estimate.js ****', err);
                                                                                    callback(err, null);
                                                                                } else if (_.isEmpty(found)) {
                                                                                    callback(null, 'noDataFound');
                                                                                } else {
                                                                                    //- calculation of part addon unit cost
                                                                                    partTotalCost = partAddons.quantity.total * partAddons.totalCost;

                                                                                    partTotalDetailTempRow.addonCost = partTotalDetailTempRow.addonCost + partTotalCost;

                                                                                    partTotalDetailTempRow.addonWeight = partTotalDetailTempRow.addonWeight + addonsMatName.weightPerUnit;

                                                                                    partAddonsExcelObj = {
                                                                                        "Part Qty.(Nos.)": "",
                                                                                        "Part Name": "",
                                                                                        "PartNumber": "",
                                                                                        "Material": "",
                                                                                        "Type": "Addon",
                                                                                        "Category/Sub-Cat": addonMaterialSubCatName,
                                                                                        "Item": addonsMatName.materialName,
                                                                                        "PartUnitdetails.QuantityWithinPart.Value": partAddons.quantity.total,
                                                                                        "PartUnitdetails.QuantityWithinPart.UOM": addUom.uomName,
                                                                                        "PartUnitdetails.Part.NetWeight(kg)": "",
                                                                                        "PartUnitdetails.Part.GrossWeight(kg)": "",
                                                                                        "PartUnitdetails.Part.Cost(Rs.)": "",
                                                                                        "PartUnitDetails.ProcessingCost(Rs.)": "",
                                                                                        "PartUnitDetails.Addons.Weight(Kg)": addonsMatName.weightPerUnit,
                                                                                        "PartUnitDetails.Addons.Cost(Rs)": partTotalCost,
                                                                                        "PartUnitDetails.ExtraCost(Rs)": "",
                                                                                        "PartUnitTotal.Weight(Kg)": "",
                                                                                        "PartUnitTotal.Cost(kg)": "",
                                                                                        "QuantityTotal.Weight(Kg.)": "",
                                                                                        "QuantityTotal.Cost(Rs)": ""
                                                                                    };
                                                                                    partExcelArray.push(partAddonsExcelObj);
                                                                                    callback();
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });

                                                        }, function (err) {
                                                            if (err) {
                                                                console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                                            } else {
                                                                callback(null, "done");
                                                            }
                                                        });
                                                    },
                                                    //-part extras operation
                                                    function (sdsd, callback) {
                                                        partTotalDetailTempRow.extraCost = 0;
                                                        async.eachSeries(subAssPart.extras, function (partExtras, callback) {
                                                            MExtra.findOne({
                                                                _id: partExtras.extraItem
                                                            }).deepPopulate('extraItem').lean().exec(function (err, extrasItem) {
                                                                if (err) {
                                                                    console.log('**** error at function_name of Estimate.js ****', err);
                                                                    callback(err, null);
                                                                } else if (_.isEmpty(extrasItem)) {
                                                                    callback(null, 'noDataFound');
                                                                } else {
                                                                    MUom.findOne({
                                                                        _id: extrasItem.rate.uom
                                                                    }).lean().exec(function (err, extraUom) {
                                                                        if (err) {
                                                                            console.log('**** error at function_name of Estimate.js ****', err);
                                                                            callback(err, null);
                                                                        } else if (_.isEmpty(extraUom)) {
                                                                            callback(null, 'noDataFound');
                                                                        } else {
                                                                            var extraTotalCost = partExtras.totalCost * partExtras.quantity;
                                                                            partTotalDetailTempRow.extraCost = partTotalDetailTempRow.extraCost + extraTotalCost;
                                                                            partExtrasExcelObj = {
                                                                                "Part Qty.(Nos.)": "",
                                                                                "Part Name": "",
                                                                                "PartNumber": "",
                                                                                "Material": "",
                                                                                "Type": "Extra",
                                                                                "Category/Sub-Cat": "",
                                                                                "Item": extrasItem.extraName,
                                                                                "PartUnitdetails.QuantityWithinPart.Value": partExtras.quantity,
                                                                                "PartUnitdetails.QuantityWithinPart.UOM": extraUom.uomName,
                                                                                "PartUnitdetails.Part.NetWeight(kg)": "",
                                                                                "PartUnitdetails.Part.GrossWeight(kg)": "",
                                                                                "PartUnitdetails.Part.Cost(Rs.)": "",
                                                                                "PartUnitDetails.ProcessingCost(Rs.)": "",
                                                                                "PartUnitDetails.Addons.Weight(Kg)": "",
                                                                                "PartUnitDetails.Addons.Cost(Rs)": "",
                                                                                "PartUnitDetails.ExtraCost(Rs)": extraTotalCost,
                                                                                "PartUnitTotal.Weight(Kg)": "",
                                                                                "PartUnitTotal.Cost(kg)": "",
                                                                                "QuantityTotal.Weight(Kg.)": "",
                                                                                "QuantityTotal.Cost(Rs)": ""
                                                                            };
                                                                            partExcelArray.push(partExtrasExcelObj);
                                                                            callback();
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }, function (err) {
                                                            if (err) {
                                                                console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                                            } else {
                                                                callback(null, "done");
                                                            }
                                                        });
                                                    }
                                                ],
                                                function (err, finalResults) {
                                                    if (err) {
                                                        console.log('********** error at final response of async.parallel  Estimate.js ************', err);
                                                        callback(err, null);
                                                    } else if (_.isEmpty(finalResults)) {
                                                        callback();
                                                    } else {

                                                        //-part unit total weight calculation
                                                        partTotalDetailTempRow.partUnitWeight = 0;
                                                        partTotalDetailTempRow.partUnitWeight = (subAssPart.keyValueCalculations.grossWeight + subAssPart.keyValueCalculations.netWeight + partTotalDetailTempRow.addonWeight);

                                                        //-part unit total cost calculation
                                                        partTotalDetailTempRow.partUnitCost = 0;
                                                        partTotalDetailTempRow.partUnitCost = subAssPart.finalCalculation.itemUnitPrice + partTotalDetailTempRow.processingCost +
                                                            partTotalDetailTempRow.addonCost + partTotalDetailTempRow.extraCost;

                                                        //- part qunaityty total cost calculation
                                                        partTotalDetailTempRow.partQtyCost = 0;
                                                        partTotalDetailTempRow.partQtyCost = partTotalDetailTempRow.partUnitCost * partTotalDetailTempRow.partQty;

                                                        //-part qunaityty total weight calculation
                                                        partTotalDetailTempRow.partQtyWeight = 0;
                                                        partTotalDetailTempRow.partQtyWeight = partTotalDetailTempRow.partUnitWeight * partTotalDetailTempRow.partQty;

                                                        // //--------------------------------

                                                        partTotalDetailFinalRow = {
                                                            "Part Qty.(Nos.)": partTotalDetailTempRow.partQty,
                                                            "Part Name": partTotalDetailTempRow.partName,
                                                            "PartNumber": partTotalDetailTempRow.partNum,
                                                            "Material": materialSubCatName.materialName,
                                                            "Type": "Part Total",
                                                            "Category/Sub-Cat": "",
                                                            "Item": "",
                                                            "PartUnitdetails.QuantityWithinPart.Value": "",
                                                            "PartUnitdetails.QuantityWithinPart.UOM": "",
                                                            "PartUnitdetails.Part.NetWeight(kg)": subAssPart.keyValueCalculations.netWeight,
                                                            "PartUnitdetails.Part.GrossWeight(kg)": subAssPart.keyValueCalculations.grossWeight,
                                                            "PartUnitdetails.Part.Cost(Rs.)": subAssPart.finalCalculation.itemUnitPrice,
                                                            "PartUnitDetails.ProcessingCost(Rs.)": partTotalDetailTempRow.processingCost,
                                                            "PartUnitDetails.Addons.Weight(Kg)": partTotalDetailTempRow.addonWeight,
                                                            "PartUnitDetails.Addons.Cost(Rs)": partTotalDetailTempRow.addonCost,
                                                            "PartUnitDetails.ExtraCost(Rs)": partTotalDetailTempRow.extraCost,
                                                            "PartUnitTotal.Weight(Kg)": partTotalDetailTempRow.partUnitWeight,
                                                            "PartUnitTotal.Cost(kg)": partTotalDetailTempRow.partUnitCost,
                                                            "QuantityTotal.Weight(Kg.)": partTotalDetailTempRow.partQtyWeight,
                                                            "QuantityTotal.Cost(Rs)": partTotalDetailTempRow.partQtyCost,
                                                            "SubAssName": subAssName
                                                        };

                                                        //-========================================================================================================

                                                        //-Push the part total rows in part sheets having blod rows.

                                                        var row = worksheet1.lastRow;
                                                        var rowsNum = 0;
                                                        rowsNum = row._number;

                                                        rowNumMoreOne = row._number + 1;
                                                        worksheet1.getCell('B' + rowNumMoreOne).value = partTotalDetailTempRow.partQty;
                                                        worksheet1.getCell('B' + rowNumMoreOne).font = {
                                                            bold: true
                                                        };

                                                        worksheet1.getCell('C' + rowNumMoreOne).value = partTotalDetailTempRow.partName;
                                                        worksheet1.getCell('C' + rowNumMoreOne).font = {
                                                            bold: true
                                                        };

                                                        worksheet1.getCell('D' + rowNumMoreOne).value = partTotalDetailTempRow.partNum;
                                                        worksheet1.getCell('D' + rowNumMoreOne).font = {
                                                            bold: true
                                                        };

                                                        worksheet1.getCell('E' + rowNumMoreOne).value = materialSubCatName.materialName;
                                                        worksheet1.getCell('E' + rowNumMoreOne).font = {
                                                            bold: true
                                                        };

                                                        worksheet1.getCell('F' + rowNumMoreOne).value = "Part Total";
                                                        worksheet1.getCell('F' + rowNumMoreOne).font = {
                                                            bold: true
                                                        };

                                                        worksheet1.getCell('K' + rowNumMoreOne).value = subAssPart.keyValueCalculations.netWeight;
                                                        worksheet1.getCell('K' + rowNumMoreOne).font = {
                                                            bold: true
                                                        };

                                                        worksheet1.getCell('L' + rowNumMoreOne).value = subAssPart.keyValueCalculations.grossWeight;
                                                        worksheet1.getCell('L' + rowNumMoreOne).font = {
                                                            bold: true
                                                        };

                                                        worksheet1.getCell('M' + rowNumMoreOne).value = subAssPart.finalCalculation.itemUnitPrice;
                                                        worksheet1.getCell('M' + rowNumMoreOne).font = {
                                                            bold: true
                                                        };

                                                        worksheet1.getCell('N' + rowNumMoreOne).value = partTotalDetailTempRow.processingCost;
                                                        worksheet1.getCell('N' + rowNumMoreOne).font = {
                                                            bold: true
                                                        };

                                                        worksheet1.getCell('O' + rowNumMoreOne).value = partTotalDetailTempRow.addonWeight;
                                                        worksheet1.getCell('O' + rowNumMoreOne).font = {
                                                            bold: true
                                                        };

                                                        worksheet1.getCell('P' + rowNumMoreOne).value = partTotalDetailTempRow.addonCost;
                                                        worksheet1.getCell('P' + rowNumMoreOne).font = {
                                                            bold: true
                                                        };

                                                        worksheet1.getCell('Q' + rowNumMoreOne).value = partTotalDetailTempRow.extraCost;
                                                        worksheet1.getCell('Q' + rowNumMoreOne).font = {
                                                            bold: true
                                                        };

                                                        worksheet1.getCell('R' + rowNumMoreOne).value = partTotalDetailTempRow.partUnitWeight;
                                                        worksheet1.getCell('R' + rowNumMoreOne).font = {
                                                            bold: true
                                                        };

                                                        worksheet1.getCell('S' + rowNumMoreOne).value = partTotalDetailTempRow.partUnitCost;
                                                        worksheet1.getCell('S' + rowNumMoreOne).font = {
                                                            bold: true
                                                        };

                                                        worksheet1.getCell('T' + rowNumMoreOne).value = partTotalDetailTempRow.partQtyWeight;
                                                        worksheet1.getCell('T' + rowNumMoreOne).font = {
                                                            bold: true
                                                        };
                                                        worksheet1.getCell('U' + rowNumMoreOne).value = partTotalDetailTempRow.partQtyCost;
                                                        worksheet1.getCell('U' + rowNumMoreOne).font = {
                                                            bold: true
                                                        };
                                                        //-==================================================================================================================================================================

                                                        var partTotalMyData = {
                                                            "PartQty": partTotalDetailTempRow.partQty,
                                                            "PartName": partTotalDetailTempRow.partName,
                                                            "PartNumber": partTotalDetailTempRow.partNum,
                                                            "Material": materialSubCatName.materialName,
                                                            "Type": "Part Total",
                                                            "CategorySub-Cat": "",
                                                            "Item": "",
                                                            "PartUnitdetailsQuantityWithinPartValue": "",
                                                            "PartUnitdetailsQuantityWithinPartUOM": "",
                                                            "PartUnitdetailsPartNetWeight": subAssPart.keyValueCalculations.netWeight,
                                                            "PartUnitdetailsPartGrossWeight": subAssPart.keyValueCalculations.grossWeight,
                                                            "PartUnitdetailsPartCost": subAssPart.finalCalculation.itemUnitPrice,
                                                            "PartUnitDetailsProcessingCost": partTotalDetailTempRow.processingCost,
                                                            "PartUnitDetailsAddonsWeight": partTotalDetailTempRow.addonWeight,
                                                            "PartUnitDetailsAddonsCost": partTotalDetailTempRow.addonCost,
                                                            "PartUnitDetailsExtraCost": partTotalDetailTempRow.extraCost,
                                                            "PartUnitTotalWeight": partTotalDetailTempRow.partUnitWeight,
                                                            "PartUnitTotalCost": partTotalDetailTempRow.partUnitCost,
                                                            "QuantityTotalWeight": partTotalDetailTempRow.partQtyWeight,
                                                            "QuantityTotalCost": partTotalDetailTempRow.partQtyCost,
                                                        };


                                                        //-Bold part total Data

                                                        partTotalData.push(partTotalMyData);
                                                        // partTotalDetailFinalRow.partName.push(partTotalDetailTempRow.partName);

                                                        //  var partTotalDetailFinalRowArray = [];
                                                        //- pushing partTotalDetailFinalRow
                                                        // tempPartSheetArrays.push(partTotalDetailFinalRow);

                                                        // worksheet1.addRow(partTotalDetailFinalRow);

                                                        //- pushing part Detail Array, processing Array, addon array, extra array
                                                        //  tempPartSheetArrays.push(partExcelArray);

                                                        _.map(partExcelArray, function (p) {
                                                            worksheet1.addRow(p);
                                                            tempPartSheetArrays.push(p);
                                                        });


                                                        worksheet1.addRow({
                                                            "": ""
                                                        });

                                                        finalExcelObj.partSheet.push(tempPartSheetArrays);
                                                        tempPartSheetArrays = [];



                                                        var row = worksheet1.lastRow;
                                                        var rowsNum = 0;
                                                        rowsNum = row._number;


                                                        //- Boardering at left side of part sheet

                                                        worksheet1.getCell('B' + rowsNum).border = {
                                                            left: {
                                                                style: 'thin'
                                                            }
                                                        };


                                                        //-Boardering of completetion of one array of object of part

                                                        worksheet1.getCell('B' + rowsNum).border = {
                                                            bottom: {
                                                                style: 'thin'
                                                            }
                                                        };
                                                        worksheet1.getCell('C' + rowsNum).border = {
                                                            bottom: {
                                                                style: 'thin'
                                                            }
                                                        };
                                                        worksheet1.getCell('D' + rowsNum).border = {
                                                            bottom: {
                                                                style: 'thin'
                                                            }
                                                        };
                                                        worksheet1.getCell('E' + rowsNum).border = {
                                                            bottom: {
                                                                style: 'thin'
                                                            }
                                                        };
                                                        worksheet1.getCell('F' + rowsNum).border = {
                                                            bottom: {
                                                                style: 'thin'
                                                            }
                                                        };
                                                        worksheet1.getCell('G' + rowsNum).border = {
                                                            bottom: {
                                                                style: 'thin'
                                                            }
                                                        };
                                                        worksheet1.getCell('H' + rowsNum).border = {
                                                            bottom: {
                                                                style: 'thin'
                                                            }
                                                        };
                                                        worksheet1.getCell('I' + rowsNum).border = {
                                                            bottom: {
                                                                style: 'thin'
                                                            }
                                                        };
                                                        worksheet1.getCell('J' + rowsNum).border = {
                                                            bottom: {
                                                                style: 'thin'
                                                            }
                                                        };

                                                        worksheet1.getCell('K' + rowsNum).border = {
                                                            bottom: {
                                                                style: 'thin'
                                                            }
                                                        };

                                                        worksheet1.getCell('L' + rowsNum).border = {
                                                            bottom: {
                                                                style: 'thin'
                                                            }
                                                        };
                                                        worksheet1.getCell('M' + rowsNum).border = {
                                                            bottom: {
                                                                style: 'thin'
                                                            }
                                                        };
                                                        worksheet1.getCell('N' + rowsNum).border = {
                                                            bottom: {
                                                                style: 'thin'
                                                            }
                                                        };
                                                        worksheet1.getCell('O' + rowsNum).border = {
                                                            bottom: {
                                                                style: 'thin'
                                                            }
                                                        };
                                                        worksheet1.getCell('P' + rowsNum).border = {
                                                            bottom: {
                                                                style: 'thin'
                                                            }
                                                        };
                                                        worksheet1.getCell('Q' + rowsNum).border = {
                                                            bottom: {
                                                                style: 'thin'
                                                            }
                                                        };
                                                        worksheet1.getCell('R' + rowsNum).border = {
                                                            bottom: {
                                                                style: 'thin'
                                                            }
                                                        };
                                                        worksheet1.getCell('S' + rowsNum).border = {
                                                            bottom: {
                                                                style: 'thin'
                                                            }
                                                        };
                                                        worksheet1.getCell('T' + rowsNum).border = {
                                                            bottom: {
                                                                style: 'thin'
                                                            }
                                                        };
                                                        worksheet1.getCell('U' + rowsNum).border = {
                                                            bottom: {
                                                                style: 'thin'
                                                            }
                                                        };

                                                        workbook.xlsx.writeFile('./assets/importFormat/DraftEstimateSheet.xlsx').then(function () {
                                                            console.log('Part sheet is written');
                                                            callback();
                                                        });
                                                    }
                                                });
                                        }
                                    });
                                }, function (err) {
                                    if (err) {
                                        console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                    } else {
                                        callback();
                                    }
                                });
                            }, function (err) {
                                if (err) {
                                    console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                } else {
                                    callback(null, partTotalData);
                                }
                            });
                        },

                        //- Operation to generate excel sheets for Sub Assembly.
                        subAss: ['part', function (partData, callback) {
                            subAssTotalData = [];
                            async.eachSeries(found.subAssemblies, function (subAssObj, callback) {
                                subAssQty = subAssObj.quantity;
                                subSheetName = subAssObj.subAssemblyName;
                                var subAssemblyNumber = subAssObj.subAssemblyNumber;

                                //- creating subAssembly sheet dynamically
                                var worksheet = workbook.addWorksheet(subSheetName);

                                worksheet.mergeCells('A2', 'B2');
                                worksheet.getCell('A2').value = 'Sub-Assembly Number : ' + subAssemblyNumber;
                                worksheet.getCell('A2').font = {
                                    bold: true
                                };

                                //- header for corresponsing subssembly sheet
                                worksheet.columns = [{
                                        // header: 'SA Qty.',
                                        key: 'PartQty',
                                        width: 12
                                    }, {
                                        // header: 'Sub Assembly Name',
                                        key: 'PartName',
                                        width: 18
                                    },
                                    {
                                        // header: '',
                                        key: 'Unitdetails.PartTotal.NetWeight(kg)',
                                        width: 15,
                                    },
                                    {
                                        // header: '',
                                        key: 'Unitdetails.PartTotal.GrossWeight(kg)',
                                        width: 15,
                                    },
                                    {
                                        // header: '',
                                        key: 'Unitdetails.PartTotal.Cost(Rs.)',
                                        width: 15,
                                    },
                                    {
                                        // header: '',
                                        key: 'UnitDetails.ProcessingCost(Rs.)',
                                        width: 15,
                                    },
                                    {
                                        // header: '',
                                        key: 'UnitDetails.Addons.Weight(Kg)',
                                        width: 15,
                                    },
                                    {
                                        // header: '',
                                        key: 'UnitDetails.Addons.Cost(Rs)',
                                        width: 15,
                                    },
                                    {
                                        // header: '',
                                        key: 'UnitDetails.ExtraCost(Rs)',
                                        width: 15,
                                    },
                                    {
                                        // header: '',
                                        key: 'PartUnitTotal.Weight(Kg)',
                                        width: 15,
                                    },
                                    {
                                        // header: '',
                                        key: 'PartUnitTotal.Cost(kg)',
                                        width: 15,
                                    },
                                    {
                                        // header: '',
                                        key: 'PartQuantityTotal.Weight(Kg.)',
                                        width: 15,
                                    },
                                    {
                                        // header: '',
                                        key: 'PartQuantityTotal.Cost(Rs)',
                                        width: 15,
                                    }
                                ];


                                // worksheet1.getCell('A3').value = '';

                                worksheet.mergeCells('A4', 'A6');
                                worksheet.getCell('A5').value = 'Part Qty.(Nos.)';
                                worksheet.getCell('A5').font = {
                                    bold: true
                                };

                                worksheet.mergeCells('B4', 'B6');
                                worksheet.getCell('B5').value = 'Part Name';
                                worksheet.getCell('B5').font = {
                                    bold: true
                                };
                                worksheet.mergeCells('C4', 'I4');
                                worksheet.getCell('E4').value = '                                                                                     Unit details';
                                worksheet.getCell('E4').font = {
                                    bold: true
                                };
                                worksheet.mergeCells('C5', 'E5');
                                worksheet.getCell('D5').value = '                                     Part Total';
                                worksheet.getCell('D5').font = {
                                    bold: true
                                };
                                worksheet.getCell('C6').value = 'Net Weight (kg)';
                                worksheet.getCell('C6').font = {
                                    bold: true
                                };


                                worksheet.getCell('D6').value = 'Gross Weight (kg)';
                                worksheet.getCell('D6').font = {
                                    bold: true
                                };

                                worksheet.getCell('E6').value = 'Cost (Rs.)';
                                worksheet.getCell('E6').font = {
                                    bold: true
                                };

                                worksheet.mergeCells('F5', 'F6');
                                worksheet.getCell('F5').value = 'Processing Cost (Rs.)';
                                worksheet.getCell('F5').font = {
                                    bold: true
                                };
                                worksheet.mergeCells('G5', 'H5');
                                worksheet.getCell('G5').value = '                                  Addons';
                                worksheet.getCell('G5').font = {
                                    bold: true
                                };
                                worksheet.getCell('G6').value = 'Weight(kg)';
                                worksheet.getCell('G6').font = {
                                    bold: true
                                };
                                worksheet.getCell('H6').value = 'Cost(Rs.)';
                                worksheet.getCell('H6').font = {
                                    bold: true
                                };
                                worksheet.mergeCells('I5', 'I6');
                                worksheet.getCell('I5').value = 'Extra Cost(Rs.)';
                                worksheet.getCell('I5').font = {
                                    bold: true
                                };

                                worksheet.mergeCells('J4', 'K4');
                                worksheet.getCell('J4').value = '                   Part Unit Total';
                                worksheet.getCell('J4').font = {
                                    bold: true
                                };


                                worksheet.mergeCells('J5', 'J6');
                                worksheet.getCell('J5').value = 'Weight(kg)';
                                worksheet.getCell('J5').font = {
                                    bold: true
                                };
                                worksheet.mergeCells('K5', 'K6');
                                worksheet.getCell('K5').value = 'Cost(Rs.)';
                                worksheet.getCell('K5').font = {
                                    bold: true
                                };

                                worksheet.mergeCells('L4', 'M4');
                                worksheet.getCell('L4').value = '                     Part Quantity Total';
                                worksheet.getCell('L4').font = {
                                    bold: true
                                };
                                worksheet.mergeCells('L5', 'L6');
                                worksheet.getCell('L5').value = 'Weight(kg)';
                                worksheet.getCell('L5').font = {
                                    bold: true
                                };
                                worksheet.mergeCells('M5', 'M6');
                                worksheet.getCell('M5').value = 'Cost(Rs.)';
                                worksheet.getCell('M5').font = {
                                    bold: true
                                };

                                //-Giving boarder to sub assembly header

                                worksheet.getCell('A4').border = {
                                    top: {
                                        style: 'thin'
                                    },
                                    left: {
                                        style: 'thin'
                                    },
                                    bottom: {
                                        style: 'thin'
                                    },
                                    right: {
                                        style: 'thin'
                                    }
                                };


                                worksheet.getCell('B4').border = {
                                    top: {
                                        style: 'thin'
                                    },
                                    // left: {style:'thin'},
                                    bottom: {
                                        style: 'thin'
                                    },
                                    right: {
                                        style: 'thin'
                                    }
                                };


                                worksheet.getCell('C4').border = {
                                    top: {
                                        style: 'thin'
                                    },
                                    // left: {style:'thin'},
                                    bottom: {
                                        style: 'thin'
                                    },
                                    right: {
                                        style: 'thin'
                                    }
                                };

                                worksheet.getCell('C6').border = {
                                    top: {
                                        style: 'thin'
                                    },
                                    // left: {style:'thin'},
                                    bottom: {
                                        style: 'thin'
                                    },
                                    right: {
                                        style: 'thin'
                                    }
                                };

                                worksheet.getCell('D4').border = {
                                    top: {
                                        style: 'thin'
                                    },
                                    // left: {style:'thin'},
                                    bottom: {
                                        style: 'thin'
                                    },
                                    right: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('D5').border = {
                                    top: {
                                        style: 'thin'
                                    },
                                    // left: {style:'thin'},
                                    bottom: {
                                        style: 'thin'
                                    },
                                    right: {
                                        style: 'thin'
                                    }
                                };

                                worksheet.getCell('D6').border = {
                                    top: {
                                        style: 'thin'
                                    },
                                    // left: {style:'thin'},
                                    bottom: {
                                        style: 'thin'
                                    },
                                    right: {
                                        style: 'thin'
                                    }
                                };

                                worksheet.getCell('E6').border = {
                                    top: {
                                        style: 'thin'
                                    },
                                    // left: {style:'thin'},
                                    bottom: {
                                        style: 'thin'
                                    },
                                    right: {
                                        style: 'thin'
                                    }
                                };

                                worksheet.getCell('F5').border = {
                                    top: {
                                        style: 'thin'
                                    },
                                    // left: {style:'thin'},
                                    bottom: {
                                        style: 'thin'
                                    },
                                    right: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('G5').border = {
                                    top: {
                                        style: 'thin'
                                    },
                                    // left: {style:'thin'},
                                    bottom: {
                                        style: 'thin'
                                    },
                                    right: {
                                        style: 'thin'
                                    }
                                };

                                worksheet.getCell('G6').border = {
                                    top: {
                                        style: 'thin'
                                    },
                                    // left: {style:'thin'},
                                    bottom: {
                                        style: 'thin'
                                    },
                                    right: {
                                        style: 'thin'
                                    }
                                };

                                worksheet.getCell('H6').border = {
                                    top: {
                                        style: 'thin'
                                    },
                                    // left: {style:'thin'},
                                    bottom: {
                                        style: 'thin'
                                    },
                                    right: {
                                        style: 'thin'
                                    }
                                };

                                worksheet.getCell('I5').border = {
                                    top: {
                                        style: 'thin'
                                    },
                                    // left: {style:'thin'},
                                    bottom: {
                                        style: 'thin'
                                    },
                                    right: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('J4').border = {
                                    top: {
                                        style: 'thin'
                                    },
                                    // left: {style:'thin'},
                                    bottom: {
                                        style: 'thin'
                                    },
                                    right: {
                                        style: 'thin'
                                    }
                                };

                                worksheet.getCell('J5').border = {
                                    top: {
                                        style: 'thin'
                                    },
                                    // left: {style:'thin'},
                                    bottom: {
                                        style: 'thin'
                                    },
                                    right: {
                                        style: 'thin'
                                    }
                                };

                                worksheet.getCell('K5').border = {
                                    top: {
                                        style: 'thin'
                                    },
                                    // left: {style:'thin'},
                                    bottom: {
                                        style: 'thin'
                                    },
                                    right: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('L4').border = {
                                    top: {
                                        style: 'thin'
                                    },
                                    // left: {style:'thin'},
                                    bottom: {
                                        style: 'thin'
                                    },
                                    right: {
                                        style: 'thin'
                                    }
                                };

                                worksheet.getCell('L5').border = {
                                    top: {
                                        style: 'thin'
                                    },
                                    // left: {style:'thin'},
                                    bottom: {
                                        style: 'thin'
                                    },
                                    right: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('L6').border = {
                                    top: {
                                        style: 'thin'
                                    },
                                    // left: {style:'thin'},
                                    bottom: {
                                        style: 'thin'
                                    },
                                    right: {
                                        style: 'thin'
                                    }
                                };

                                worksheet.getCell('M6').border = {
                                    top: {
                                        style: 'thin'
                                    },
                                    // left: {style:'thin'},
                                    bottom: {
                                        style: 'thin'
                                    },
                                    right: {
                                        style: 'thin'
                                    }
                                };


                                var getSubAssPartArray = [];

                                _.find(partData.part, function (o) {
                                    var subAssFinalData = {
                                        "PartQty": o.PartQty,
                                        "PartName": o.PartName,
                                        "PartNumber": o.PartNumber,
                                        "Unitdetails.PartTotal.NetWeight(kg)": o.PartUnitdetailsPartNetWeight,
                                        "Unitdetails.PartTotal.GrossWeight(kg)": o.PartUnitdetailsPartGrossWeight,
                                        "Unitdetails.PartTotal.Cost(Rs.)": o.PartUnitdetailsPartCost,
                                        "UnitDetails.ProcessingCost(Rs.)": o.PartUnitDetailsProcessingCost,
                                        "UnitDetails.Addons.Weight(Kg)": o.PartUnitDetailsAddonsWeight,
                                        "UnitDetails.Addons.Cost(Rs)": o.PartUnitDetailsAddonsCost,
                                        "UnitDetails.ExtraCost(Rs)": o.PartUnitDetailsExtraCost,
                                        "PartUnitTotal.Weight(Kg)": o.PartUnitTotalWeight,
                                        "PartUnitTotal.Cost(kg)": o.PartUnitTotalCost,
                                        "PartQuantityTotal.Weight(Kg.)": o.QuantityTotalWeight,
                                        "PartQuantityTotal.Cost(Rs)": o.QuantityTotalCost
                                    };


                                    if (o.PartNumber.includes(subAssemblyNumber)) {

                                        getSubAssPartArray.push(subAssFinalData);

                                        worksheet.addRow(subAssFinalData);
                                    }
                                });



                                var partTotalCalArray = [];
                                _.find(partData.part, function (o) {
                                    if (o.PartNumber.includes(subAssemblyNumber)) {
                                        partTotalCalArray.push(o);
                                    }
                                });

                                var partTotalTotalNetWeight = 0;
                                var partTotalTotalWeight = 0;
                                var partTotalTotalCost = 0;
                                var UnitDetailsTotalProcessingCost = 0;
                                var UnitDetailsTotalAddonsWeight = 0;
                                var UnitDetailsTotalAddonsCost = 0;
                                var UnitDatailsTotalExtraCost = 0;
                                var PartUnitTotalWeight = 0;
                                var PartUnitTotalCost = 0;
                                var PartTotalQuantityWeight = 0;
                                var PartTotalQuantityCost = 0;

                                //-add one more row for total calculation

                                _.map(partTotalCalArray, function (g) {

                                    //-Calculation of Unit details part net total total weight

                                    partTotalTotalNetWeight = partTotalTotalNetWeight + g.PartUnitdetailsPartNetWeight;
                                    g.PartUnitdetailsPartNetWeight = 0;

                                    //-Calculation of Unit details part gross total total weight

                                    partTotalTotalWeight = (partTotalTotalWeight + g.PartUnitdetailsPartGrossWeight);
                                    g.PartUnitdetailsPartGrossWeight = 0;

                                    //-Calculation of Unit details part total total cost

                                    partTotalTotalCost = partTotalTotalCost + g.PartUnitdetailsPartCost;
                                    g.PartUnitdetailsPartCost = 0;

                                    //-Calculation of Unit details processing total cost

                                    UnitDetailsTotalProcessingCost = UnitDetailsTotalProcessingCost + g.PartUnitDetailsProcessingCost;
                                    g.PartUnitDetailsProcessingCost = 0;

                                    //-Calculation of Unit details Addons total Weight

                                    UnitDetailsTotalAddonsWeight = UnitDetailsTotalAddonsWeight + g.PartUnitDetailsAddonsWeight;
                                    g.PartUnitDetailsAddonsWeight = 0;

                                    //-Calculation of Unit details Addons Total Cost

                                    UnitDetailsTotalAddonsCost = UnitDetailsTotalAddonsCost + g.PartUnitDetailsAddonsCost;
                                    g.PartUnitDetailsAddonsCost = 0;

                                    //-Calculation of Unit Details  Extra Total Cost

                                    UnitDatailsTotalExtraCost = UnitDatailsTotalExtraCost + g.PartUnitDetailsExtraCost;
                                    g.PartUnitDetailsExtraCost = 0;

                                    //-Calculation of Part Unit Total Total Weight

                                    PartUnitTotalWeight = PartUnitTotalWeight + g.PartUnitTotalWeight;
                                    g.PartUnitTotalWeight = 0;

                                    //-Calculation of  Part Unit Total Total Cost

                                    PartUnitTotalCost = PartUnitTotalCost + g.PartUnitTotalCost;
                                    g.PartUnitTotalCost = 0;
                                    //-Calculation of Part Qunaitity Total Total Weight

                                    PartTotalQuantityWeight = PartTotalQuantityWeight + g.QuantityTotalWeight;
                                    g.QuantityTotalWeight = 0;
                                    //-Calculation of Part Quantity  Total Toal Cost

                                    PartTotalQuantityCost = PartTotalQuantityCost + g.QuantityTotalCost;
                                    g.QuantityTotalCost = 0;
                                    // console.log('**** %%%%%%%%%s ****', subAssPartTotalTotal);
                                });

                                var subAssPartTotalTotal = {
                                    "PartQty": "",
                                    "PartName": "Total",
                                    "PartNumber": "",
                                    "Unitdetails.PartTotal.NetWeight(kg)": partTotalTotalNetWeight,
                                    "Unitdetails.PartTotal.GrossWeight(kg)": partTotalTotalWeight,
                                    "Unitdetails.PartTotal.Cost(Rs.)": partTotalTotalCost,
                                    "UnitDetails.ProcessingCost(Rs.)": UnitDetailsTotalProcessingCost,
                                    "UnitDetails.Addons.Weight(Kg)": UnitDetailsTotalAddonsWeight,
                                    "UnitDetails.Addons.Cost(Rs)": UnitDetailsTotalAddonsCost,
                                    "UnitDetails.ExtraCost(Rs)": UnitDatailsTotalExtraCost,
                                    "PartUnitTotal.Weight(Kg)": PartUnitTotalWeight,
                                    "PartUnitTotal.Cost(kg)": PartUnitTotalCost,
                                    "PartQuantityTotal.Weight(Kg.)": PartTotalQuantityWeight,
                                    "PartQuantityTotal.Cost(Rs)": PartTotalQuantityCost
                                };

                                var subAssPartTotalFinal = {
                                    "SAQty": subAssQty,
                                    "SAName": subSheetName,
                                    "UnitdetailsPartTotalNetWeight": partTotalTotalNetWeight,
                                    "UnitdetailsPartTotalGrossWeight": partTotalTotalWeight,
                                    "UnitdetailsPartTotalCost": partTotalTotalCost,
                                    "UnitDetailsProcessingCost": UnitDetailsTotalProcessingCost,
                                    "UnitDetailsAddonsWeight": UnitDetailsTotalAddonsWeight,
                                    "UnitDetailsAddonsCost": UnitDetailsTotalAddonsCost,
                                    "UnitDetailsExtraCost": UnitDatailsTotalExtraCost,
                                    "SAUnitTotalWeight": PartUnitTotalWeight,
                                    "SAUnitTotalCost": PartUnitTotalCost,
                                    "SAQuantityTotalWeight": PartTotalQuantityWeight,
                                    "SAQuantityTotalCost": PartTotalQuantityCost
                                };


                                worksheet.addRow(subAssPartTotalTotal);

                                subAssTotalData.push(subAssPartTotalFinal);

                                var row = worksheet.lastRow;
                                var rowsNum = 0;
                                rowsNum = row._number;

                                rowNumLessOne = row._number - 1;
                                //-Boardering to sub Asembly

                                worksheet.getCell('A' + rowNumLessOne).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('B' + rowNumLessOne).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('C' + rowNumLessOne).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('D' + rowNumLessOne).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('E' + rowNumLessOne).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('F' + rowNumLessOne).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('G' + rowNumLessOne).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('H' + rowNumLessOne).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('I' + rowNumLessOne).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('J' + rowNumLessOne).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };

                                worksheet.getCell('K' + rowNumLessOne).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };

                                worksheet.getCell('L' + rowNumLessOne).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('M' + rowNumLessOne).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };


                                worksheet.getCell('A' + rowsNum).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('B' + rowsNum).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('C' + rowsNum).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('D' + rowsNum).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('E' + rowsNum).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('F' + rowsNum).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('G' + rowsNum).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('H' + rowsNum).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('I' + rowsNum).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('J' + rowsNum).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };

                                worksheet.getCell('K' + rowsNum).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('L' + rowsNum).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };
                                worksheet.getCell('M' + rowsNum).border = {
                                    bottom: {
                                        style: 'thin'
                                    }
                                };


                                var tempSubAssSheetArrays = [];
                                async.waterfall([
                                    function (callback) {
                                        var index = 0;
                                        var subAssProcessingTotalTotalCost = 0;
                                        subAssExcelArray = [];
                                        async.eachSeries(subAssObj.processing, function (subAssProc, callback) {
                                            MProcessItem.findOne({
                                                _id: subAssProc.processItem
                                            }).select('processItemName').lean().exec(function (err, subAssProItemName) {
                                                if (err) {
                                                    console.log('**** error at function_name of Estimate.js ****', err);
                                                    callback(err, null);
                                                } else if (_.isEmpty(subAssProItemName)) {
                                                    callback(null, []);
                                                } else {
                                                    MProcessType.findOne({
                                                        _id: subAssProc.processType
                                                    }).deepPopulate('processCat quantity.finalUom').lean().exec(function (err, subAssProcessTypeData) {
                                                        if (err) {
                                                            console.log('**** error at function_name of Estimate.js ****', err);
                                                            callback(err, null);
                                                        } else if (_.isEmpty(subAssProcessTypeData)) {
                                                            callback(null, []);
                                                        } else {
                                                            var subAssProUomId = subAssProcessTypeData.quantity.finalUom._id;
                                                            MUom.findOne({
                                                                _id: subAssProUomId
                                                            }).select('uomName').lean().exec(function (err, subAssProUom) {
                                                                if (err) {
                                                                    console.log('**** error at function_name of Estimate.js ****', err);
                                                                    callback(err, null);
                                                                } else if (_.isEmpty(subAssProUom)) {
                                                                    callback(null, 'noDataFound');
                                                                } else {
                                                                    var subAssProcessingTotalCost = 0;
                                                                    subAssProcessingTotalCost = subAssProc.totalCost * subAssProc.quantity.totalQuantity;
                                                                    subAssProcessingTotalTotalCost = subAssProcessingTotalCost + subAssProcessingTotalTotalCost;
                                                                    // proCatName = partProcessTypeData.processCat.processCatName;
                                                                    var subAssProExcelObj = {
                                                                        "PartQty": "",
                                                                        "PartName": "Processing",
                                                                        // "PartNumber": subAssProcessTypeData.processCat.processCatName,
                                                                        "Unitdetails.PartTotal.NetWeight(kg)": subAssProcessTypeData.processCat.processCatName,
                                                                        "Unitdetails.PartTotal.Weight(kg)": subAssProItemName.processItemName,
                                                                        "Unitdetails.PartTotal.Cost(Rs.)": subAssProc.quantity.totalQuantity,
                                                                        "UnitDetails.ProcessingCost(Rs.)": subAssProUom.uomName,
                                                                        "UnitDetails.Addons.Weight(Kg)": subAssProcessingTotalCost,
                                                                        "UnitDetails.Addons.Cost(Rs)": "",
                                                                        "UnitDetails.ExtraCost(Rs)": "",
                                                                        "PartUnitTotal.Weight(Kg)": "",
                                                                        "PartUnitTotal.Cost(kg)": "",
                                                                        "PartQuantityTotal.Weight(Kg.)": "",
                                                                        "PartQuantityTotal.Cost(Rs)": ""
                                                                    };

                                                                    //- processing header
                                                                    if (index == 0) {
                                                                        //- blank row above processing
                                                                        worksheet.addRow({
                                                                            "": ""
                                                                        });

                                                                        var row = worksheet.lastRow;
                                                                        var rowsNum = 0;
                                                                        rowsNum = row._number;

                                                                        rowNumMoreOne = row._number + 1;

                                                                        worksheet.getCell('B' + rowNumMoreOne).value = "Proessing Name";
                                                                        worksheet.getCell('B' + rowNumMoreOne).font = {
                                                                            bold: true
                                                                        };

                                                                        worksheet.getCell('C' + rowNumMoreOne).value = "Category";
                                                                        worksheet.getCell('C' + rowNumMoreOne).font = {
                                                                            bold: true
                                                                        };

                                                                        worksheet.getCell('D' + rowNumMoreOne).value = "Item";
                                                                        worksheet.getCell('D' + rowNumMoreOne).font = {
                                                                            bold: true
                                                                        };

                                                                        worksheet.getCell('E' + rowNumMoreOne).value = "Quantity";
                                                                        worksheet.getCell('E' + rowNumMoreOne).font = {
                                                                            bold: true
                                                                        };

                                                                        worksheet.getCell('F' + rowNumMoreOne).value = "UOM";
                                                                        worksheet.getCell('F' + rowNumMoreOne).font = {
                                                                            bold: true
                                                                        };
                                                                        worksheet.getCell('G' + rowNumMoreOne).value = "Total Cost";
                                                                        worksheet.getCell('G' + rowNumMoreOne).font = {
                                                                            bold: true
                                                                        };
                                                                    }

                                                                    worksheet.addRow(subAssProExcelObj);
                                                                    var lastIndex = subAssObj.processing.length - 1;
                                                                    if (lastIndex == index) {
                                                                        worksheet.addRow({
                                                                            "PartQty": "",
                                                                            "PartName": "",
                                                                            // "PartNumber": "",
                                                                            "Unitdetails.PartTotal.NetWeight(kg)": "",
                                                                            "Unitdetails.PartTotal.Weight(kg)": "",
                                                                            "Unitdetails.PartTotal.Cost(Rs.)": "",
                                                                            "UnitDetails.ProcessingCost(Rs.)": "",
                                                                            "UnitDetails.Addons.Weight(Kg)": subAssProcessingTotalTotalCost,
                                                                            "UnitDetails.Addons.Cost(Rs)": "",
                                                                            "UnitDetails.ExtraCost(Rs)": '',
                                                                            "PartUnitTotal.Weight(Kg)": "",
                                                                            "PartUnitTotal.Cost(kg)": "",
                                                                            "PartQuantityTotal.Weight(Kg.)": "",
                                                                            "PartQuantityTotal.Cost(Rs)": "",
                                                                        });

                                                                        var row = worksheet.lastRow;
                                                                        var rowsNum = 0;
                                                                        rowsNum = row._number;

                                                                        rowNumLessOne = row._number - 1;
                                                                        worksheet.getCell('A' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('B' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('C' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('D' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('E' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('F' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('G' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('H' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('I' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('J' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };

                                                                        worksheet.getCell('K' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };

                                                                        worksheet.getCell('L' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };

                                                                        worksheet.getCell('M' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };


                                                                        worksheet.getCell('A' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('B' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('C' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('D' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('E' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('F' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('G' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('H' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('I' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('J' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };

                                                                        worksheet.getCell('K' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };

                                                                        worksheet.getCell('L' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('M' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };


                                                                    }

                                                                    subAssExcelArray.push(subAssProExcelObj);
                                                                    index++;
                                                                    callback();
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }, function (err) {
                                            if (err) {
                                                console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                            } else {
                                                callback(null, "done");
                                            }
                                        });
                                    },
                                    function (aqw, callback) {
                                        var subAssAddonsTotalTotalCost = 0;
                                        var index = 0;
                                        async.eachSeries(subAssObj.addons, function (subAssAddons, callback) {
                                            MAddonType.findOne({
                                                _id: subAssAddons.addonType
                                            }).deepPopulate('materialSubCat').lean().exec(function (err, addMatSubCatName) {
                                                var addonMaterialSubCatName = addMatSubCatName.materialSubCat.materialSubCatName;
                                                if (err) {
                                                    console.log('**** error at function_name of Estimate.js ****', err);
                                                    callback(err, null);
                                                } else if (_.isEmpty(addMatSubCatName)) {
                                                    callback(null, 'noDataFound');
                                                } else {
                                                    MUom.findOne({
                                                        _id: addMatSubCatName.rate.uom
                                                    }).lean().exec(function (err, addUom) {
                                                        if (err) {
                                                            console.log('**** error at function_name of Estimate.js ****', err);
                                                            callback(err, null);
                                                        } else if (_.isEmpty(addUom)) {
                                                            callback(null, []);
                                                        } else {
                                                            MMaterial.findOne({
                                                                _id: subAssAddons.addonItem
                                                            }).select('materialName weightPerUnit').lean().exec(function (err, addonsMatName) {
                                                                if (err) {
                                                                    console.log('**** error at function_name of Estimate.js ****', err);
                                                                    callback(err, null);
                                                                } else if (_.isEmpty(found)) {
                                                                    callback(null, 'noDataFound');
                                                                } else {
                                                                    var addonsTotalCost = 0;
                                                                    //- calculation of sub assembly addons unit cost
                                                                    addonsTotalCost = subAssAddons.quantity.total * subAssAddons.totalCost;
                                                                    subAssAddonsTotalTotalCost = addonsTotalCost + subAssAddonsTotalTotalCost;
                                                                    subAssAddonsExcelObj = {
                                                                        "PartQty": "",
                                                                        "PartName": "Addon",
                                                                        // "PartNumber":,
                                                                        "Unitdetails.PartTotal.NetWeight(kg)": addonMaterialSubCatName,
                                                                        "Unitdetails.PartTotal.Cost(Rs.)": addonsMatName.materialName,
                                                                        "Unitdetails.PartTotal.Weight(kg)": subAssAddons.quantity.total,
                                                                        "UnitDetails.ProcessingCost(Rs.)": addUom.uomName,
                                                                        "UnitDetails.Addons.Weight(Kg)": addonsTotalCost,
                                                                        "UnitDetails.Addons.Cost(Rs)": "",
                                                                        "UnitDetails.ExtraCost(Rs)": "",
                                                                        "PartUnitTotal.Weight(Kg)": "",
                                                                        "PartUnitTotal.Cost(kg)": "",
                                                                        "PartQuantityTotal.Weight(Kg.)": "",
                                                                        "PartQuantityTotal.Cost(Rs)": "",
                                                                    };
                                                                    if (index == 0) {
                                                                        //- blank row above processing
                                                                        worksheet.addRow({
                                                                            "": ""
                                                                        });
                                                                        // worksheet.addRow({
                                                                        //     "PartQty": "",
                                                                        //     "PartName": "Addon Name",
                                                                        //     // "PartNumber": "Category",
                                                                        //     "Unitdetails.PartTotal.Weight(kg)": "Category",
                                                                        //     "Unitdetails.PartTotal.Cost(Rs.)": "Item",
                                                                        //     "UnitDetails.ProcessingCost(Rs.)": "Quantity",
                                                                        //     "UnitDetails.Addons.Weight(Kg)": "UOM",
                                                                        //     "UnitDetails.Addons.Cost(Rs)": 'Total Cost',
                                                                        //     "UnitDetails.ExtraCost(Rs)": '',
                                                                        //     "PartUnitTotal.Weight(Kg)": "",
                                                                        //     "PartUnitTotal.Cost(kg)": "",
                                                                        //     "PartQuantityTotal.Weighth(Kg.)": "",
                                                                        //     "PartQuantityTotal.Cost(Rs)": "",
                                                                        // });
                                                                        var row = worksheet.lastRow;
                                                                        var rowsNum = 0
                                                                        rowsNum = row._number;

                                                                        rowNumMoreOne = row._number + 1;

                                                                        worksheet.getCell('B' + rowNumMoreOne).value = "Addon Name";
                                                                        worksheet.getCell('B' + rowNumMoreOne).font = {
                                                                            bold: true
                                                                        };

                                                                        worksheet.getCell('C' + rowNumMoreOne).value = "Category";
                                                                        worksheet.getCell('C' + rowNumMoreOne).font = {
                                                                            bold: true
                                                                        };

                                                                        worksheet.getCell('D' + rowNumMoreOne).value = "Item";
                                                                        worksheet.getCell('D' + rowNumMoreOne).font = {
                                                                            bold: true
                                                                        };

                                                                        worksheet.getCell('E' + rowNumMoreOne).value = "Quantity";
                                                                        worksheet.getCell('E' + rowNumMoreOne).font = {
                                                                            bold: true
                                                                        };

                                                                        worksheet.getCell('F' + rowNumMoreOne).value = "UOM";
                                                                        worksheet.getCell('F' + rowNumMoreOne).font = {
                                                                            bold: true
                                                                        };
                                                                        worksheet.getCell('G' + rowNumMoreOne).value = "Total Cost";
                                                                        worksheet.getCell('G' + rowNumMoreOne).font = {
                                                                            bold: true
                                                                        };

                                                                    }

                                                                    worksheet.addRow(subAssAddonsExcelObj);
                                                                    var lastIndex = subAssObj.addons.length - 1;
                                                                    if (lastIndex == index) {
                                                                        worksheet.addRow({
                                                                            "PartQty": "",
                                                                            "PartName": "",
                                                                            // "PartNumber": "",
                                                                            "Unitdetails.PartTotal.NetWeight(kg)": "",
                                                                            "Unitdetails.PartTotal.Weight(kg)": "",
                                                                            "Unitdetails.PartTotal.Cost(Rs.)": "",
                                                                            "UnitDetails.ProcessingCost(Rs.)": "",
                                                                            "UnitDetails.Addons.Weight(Kg)": subAssAddonsTotalTotalCost,
                                                                            "UnitDetails.Addons.Cost(Rs)": "",
                                                                            "UnitDetails.ExtraCost(Rs)": "",
                                                                            "PartUnitTotal.Weight(Kg)": "",
                                                                            "PartUnitTotal.Cost(kg)": "",
                                                                            "PartQuantityTotal.Weight(Kg.)": "",
                                                                            "PartQuantityTotal.Cost(Rs)": "",
                                                                        });
                                                                        var row = worksheet.lastRow;
                                                                        var rowsNum = 0;
                                                                        rowsNum = row._number;

                                                                        rowNumLessOne = row._number - 1;
                                                                        worksheet.getCell('A' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('B' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('C' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('D' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('E' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('F' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('G' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('H' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('I' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('J' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };

                                                                        worksheet.getCell('K' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };

                                                                        worksheet.getCell('L' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('M' + rowNumLessOne).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };


                                                                        worksheet.getCell('A' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('B' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('C' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('D' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('E' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('F' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('G' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('H' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('I' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('J' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };

                                                                        worksheet.getCell('K' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };

                                                                        worksheet.getCell('L' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };
                                                                        worksheet.getCell('M' + rowsNum).border = {
                                                                            bottom: {
                                                                                style: 'thin'
                                                                            }
                                                                        };

                                                                    }

                                                                    subAssExcelArray.push(subAssAddonsExcelObj);
                                                                    index++;
                                                                    callback();
                                                                }

                                                            });
                                                        }
                                                    });
                                                }
                                            });

                                        }, function (err) {
                                            if (err) {
                                                console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                            } else {
                                                callback(null, "done");
                                            }
                                        });
                                    },
                                    function (awee, callback) {
                                        console.log('**** inside sub ass ****');

                                        var index = 0;
                                        var extraTotalTotalCost = 0;

                                        async.eachSeries(subAssObj.extras, function (subAssExtras, callback) {
                                            MExtra.findOne({
                                                _id: subAssExtras.extraItem
                                            }).deepPopulate('extraItem').lean().exec(function (err, extrasItem) {
                                                if (err) {
                                                    console.log('**** error at function_name of Estimate.js ****', err);
                                                    callback(err, null);
                                                } else if (_.isEmpty(extrasItem)) {
                                                    callback(null, 'noDataFound');
                                                } else {
                                                    MUom.findOne({
                                                        _id: extrasItem.rate.uom
                                                    }).lean().exec(function (err, extraUom) {
                                                        if (err) {
                                                            console.log('**** error at function_name of Estimate.js ****', err);
                                                            callback(err, null);
                                                        } else if (_.isEmpty(extraUom)) {
                                                            callback(null, 'noDataFound');
                                                        } else {

                                                            var extraTotalCost = 0;
                                                            extraTotalCost = (subAssExtras.totalCost * subAssExtras.quantity);

                                                            extraTotalTotalCost = (extraTotalCost + extraTotalTotalCost);

                                                            //- extra header
                                                            if (index == 0) {
                                                                //- blank row above extra
                                                                worksheet.addRow({
                                                                    "": ""
                                                                });
                                                                // worksheet.addRow({
                                                                //     "PartQty": "",
                                                                //     "PartName": "Extra Name",
                                                                //     // "PartNumber": "Category",
                                                                //     "Unitdetails.PartTotal.Weight(kg)": "",
                                                                //     "Unitdetails.PartTotal.Cost(Rs.)": "",
                                                                //     "UnitDetails.ProcessingCost(Rs.)": "Quantity",
                                                                //     "UnitDetails.Addons.Weight(Kg)": "UOM",
                                                                //     "UnitDetails.Addons.Cost(Rs)": 'Total Cost',
                                                                //     "UnitDetails.ExtraCost(Rs)": '',
                                                                //     "PartUnitTotal.Weight(Kg)": "",
                                                                //     "PartUnitTotal.Cost(kg)": "",
                                                                //     "PartQuantityTotal.Weighth(Kg.)": "",
                                                                //     "PartQuantityTotal.Cost(Rs)": "",
                                                                // });
                                                                var row = worksheet.lastRow;
                                                                var rowsNum = 0;
                                                                rowsNum = row._number;

                                                                rowNumMoreOne = row._number + 1;

                                                                worksheet.getCell('B' + rowNumMoreOne).value = "Extra Name";
                                                                worksheet.getCell('B' + rowNumMoreOne).font = {
                                                                    bold: true
                                                                };
                                                                worksheet.getCell('E' + rowNumMoreOne).value = "Quantity";
                                                                worksheet.getCell('E' + rowNumMoreOne).font = {
                                                                    bold: true
                                                                };
                                                                worksheet.getCell('F' + rowNumMoreOne).value = "UOM";
                                                                worksheet.getCell('F' + rowNumMoreOne).font = {
                                                                    bold: true
                                                                };
                                                                worksheet.getCell('G' + rowNumMoreOne).value = "Total Cost";
                                                                worksheet.getCell('G' + rowNumMoreOne).font = {
                                                                    bold: true
                                                                };
                                                            }
                                                            subAssExtrasExcelObj = {
                                                                "PartQty": "",
                                                                "PartName": "Extra",
                                                                // "PartNumber": "",
                                                                "Unitdetails.PartTotal.NetWeight(kg)": "",
                                                                "Unitdetails.PartTotal.Weight(kg)": "",
                                                                "Unitdetails.PartTotal.Cost(Rs.)": subAssExtras.quantity,
                                                                "UnitDetails.ProcessingCost(Rs.)": extraUom.uomName,
                                                                "UnitDetails.Addons.Weight(Kg)": extraTotalCost,
                                                                "UnitDetails.Addons.Cost(Rs)": "",
                                                                "UnitDetails.ExtraCost(Rs)": "",
                                                                "PartUnitTotal.Weight(Kg)": "",
                                                                "PartUnitTotal.Cost(kg)": "",
                                                                "PartQuantityTotal.Weight(Kg.)": "",
                                                                "PartQuantityTotal.Cost(Rs)": ""
                                                            };
                                                            worksheet.addRow(subAssExtrasExcelObj);
                                                            var lastIndex = subAssObj.extras.length - 1;
                                                            if (lastIndex == index) {
                                                                worksheet.addRow({
                                                                    "PartQty": "",
                                                                    "PartName": "",
                                                                    // "PartNumber": "",
                                                                    "Unitdetails.PartTotal.NetWeight(kg)": "",
                                                                    "Unitdetails.PartTotal.Weight(kg)": "",
                                                                    "Unitdetails.PartTotal.Cost(Rs.)": "",
                                                                    "UnitDetails.ProcessingCost(Rs.)": "",
                                                                    "UnitDetails.Addons.Weight(Kg)": extraTotalTotalCost,
                                                                    "UnitDetails.Addons.Cost(Rs)": "",
                                                                    "UnitDetails.ExtraCost(Rs)": '',
                                                                    "PartUnitTotal.Weight(Kg)": "",
                                                                    "PartUnitTotal.Cost(kg)": "",
                                                                    "PartQuantityTotal.Weight(Kg.)": "",
                                                                    "PartQuantityTotal.Cost(Rs)": ""
                                                                });
                                                                var row = worksheet.lastRow;
                                                                var rowsNum = 0;
                                                                rowsNum = row._number;

                                                                rowNumLessOne = row._number - 1;
                                                                worksheet.getCell('A' + rowNumLessOne).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                                worksheet.getCell('B' + rowNumLessOne).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                                worksheet.getCell('C' + rowNumLessOne).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                                worksheet.getCell('D' + rowNumLessOne).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                                worksheet.getCell('E' + rowNumLessOne).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                                worksheet.getCell('F' + rowNumLessOne).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                                worksheet.getCell('G' + rowNumLessOne).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                                worksheet.getCell('H' + rowNumLessOne).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                                worksheet.getCell('I' + rowNumLessOne).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                                worksheet.getCell('J' + rowNumLessOne).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };

                                                                worksheet.getCell('K' + rowNumLessOne).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };

                                                                worksheet.getCell('L' + rowNumLessOne).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                                worksheet.getCell('M' + rowNumLessOne).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };


                                                                worksheet.getCell('A' + rowsNum).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                                worksheet.getCell('B' + rowsNum).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                                worksheet.getCell('C' + rowsNum).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                                worksheet.getCell('D' + rowsNum).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                                worksheet.getCell('E' + rowsNum).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                                worksheet.getCell('F' + rowsNum).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                                worksheet.getCell('G' + rowsNum).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                                worksheet.getCell('H' + rowsNum).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                                worksheet.getCell('I' + rowsNum).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                                worksheet.getCell('J' + rowsNum).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };

                                                                worksheet.getCell('K' + rowsNum).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };

                                                                worksheet.getCell('L' + rowsNum).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                                worksheet.getCell('M' + rowsNum).border = {
                                                                    bottom: {
                                                                        style: 'thin'
                                                                    }
                                                                };
                                                            }

                                                            // tempSubAssSheetArrays.push(sa);

                                                            subAssExcelArray.push(subAssExtrasExcelObj);
                                                            index++;
                                                            callback();
                                                        }

                                                    });

                                                }
                                            });
                                        }, function (err) {
                                            if (err) {
                                                console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                            } else {
                                                callback(null, "done");
                                            }
                                        });
                                    }
                                ], function () {
                                    if (err) {
                                        console.log('***** error at final response of async.waterfall in function_name of Components.js *****', err);
                                    } else {
                                        workbook.xlsx.writeFile('./assets/importFormat/DraftEstimateSheet.xlsx').then(function () {
                                            console.log('SA sheet is written');
                                            callback();
                                        });
                                    }
                                });
                            }, function (err) {
                                if (err) {
                                    console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                } else {
                                    callback(null, subAssTotalData);
                                }
                            });
                        }],

                        //-Operation to generate excel sheet for Assembly.
                        assembly: ['subAss', function (subAssData, callback) {
                            assSheetName = found.assemblyName;
                            var assemblyNumber = found.assemblyNumber;
                            // var estVersion = found.assemblyObj.estimateVersion;


                            //- creating Assembly sheet dynamically
                            var worksheet2 = workbook.addWorksheet(assSheetName);
                            worksheet2.mergeCells('A2', 'B2');
                            worksheet2.getCell('A2').value = 'Assembly Number : ' + assemblyNumber;
                            worksheet2.getCell('A2').font = {
                                bold: true
                            };

                            //- header for corresponsing Assembly sheet
                            worksheet2.columns = [{
                                    // header: 'SA Qty.',
                                    key: 'SAQty',
                                    width: 10
                                }, {
                                    // header: 'Sub Assembly Name',
                                    key: 'SubAssemblyName',
                                    width: 18
                                },
                                {
                                    // header: '',
                                    key: 'Unitdetails.PartTotal.NetWeight(kg)',
                                    width: 15,
                                },

                                {
                                    // header: '',
                                    key: 'Unitdetails.PartTotal.GrossWeight(kg)',
                                    width: 15,
                                },
                                {
                                    // header: '',
                                    key: 'Unitdetails.PartTotal.Cost(Rs.)',
                                    width: 15,
                                },
                                {
                                    // header: '',
                                    key: 'UnitDetails.ProcessingCost(Rs.)',
                                    width: 15,
                                },
                                {
                                    // header: '',
                                    key: 'UnitDetails.Addons.Weight(Kg)',
                                    width: 15,
                                },
                                {
                                    // header: '',
                                    key: 'UnitDetails.Addons.Cost(Rs)',
                                    width: 15,
                                },
                                {
                                    // header: '',
                                    key: 'UnitDetails.ExtraCost(Rs)',
                                    width: 15,
                                },
                                {
                                    // header: '',
                                    key: 'SAUnitTotal.Weight(Kg)',
                                    width: 15,
                                },
                                {
                                    // header: '',
                                    key: 'SAUnitTotal.Cost(kg)',
                                    width: 15,
                                },
                                {
                                    // header: '',
                                    key: 'SAQuantityTotal.Weight(Kg.)',
                                    width: 15,
                                },
                                {
                                    // header: '',
                                    key: 'SAQuantityTotal.Cost(Rs)',
                                    width: 15,
                                }
                            ];


                            // worksheet1.getCell('A3').value = '';

                            worksheet2.mergeCells('A4', 'A6');
                            worksheet2.getCell('A5').value = 'SA Qty.(Nos.)';
                            worksheet2.getCell('A5').font = {
                                bold: true
                            };

                            worksheet2.mergeCells('B4', 'B6');
                            worksheet2.getCell('B5').value = 'SA Name';
                            worksheet2.getCell('B5').font = {
                                bold: true
                            };
                            worksheet2.mergeCells('C4', 'I4');
                            worksheet2.getCell('E4').value = '                                                                               Unit details';
                            worksheet2.getCell('E4').font = {
                                bold: true
                            };
                            worksheet2.mergeCells('C5', 'E5');
                            worksheet2.getCell('D5').value = '                          Part Total';
                            worksheet2.getCell('D5').font = {
                                bold: true
                            };

                            worksheet2.getCell('C6').value = 'Net Weight (kg)';
                            worksheet2.getCell('C6').font = {
                                bold: true
                            };

                            worksheet2.getCell('D6').value = 'Gross Weight (kg)';
                            worksheet2.getCell('D6').font = {
                                bold: true
                            };


                            worksheet2.getCell('E6').value = 'Cost (Rs.)';
                            worksheet2.getCell('E6').font = {
                                bold: true
                            };

                            worksheet2.mergeCells('F5', 'F6');
                            worksheet2.getCell('F5').value = 'Processing Cost (Rs.)';
                            worksheet2.getCell('F5').font = {
                                bold: true
                            };
                            worksheet2.mergeCells('G5', 'H5');
                            worksheet2.getCell('G5').value = '                                  Addons';
                            worksheet2.getCell('G5').font = {
                                bold: true
                            };
                            worksheet2.getCell('G6').value = 'Weight(kg)';
                            worksheet2.getCell('G6').font = {
                                bold: true
                            };
                            worksheet2.getCell('H6').value = 'Cost(Rs.)';
                            worksheet2.getCell('H6').font = {
                                bold: true
                            };
                            worksheet2.mergeCells('I5', 'I6');
                            worksheet2.getCell('I5').value = 'Extra Cost(Rs.)';
                            worksheet2.getCell('I5').font = {
                                bold: true
                            };

                            worksheet2.mergeCells('J4', 'K4');
                            worksheet2.getCell('J4').value = '                 SA Unit Total';
                            worksheet2.getCell('J4').font = {
                                bold: true
                            };


                            worksheet2.mergeCells('J5', 'J6');
                            worksheet2.getCell('J5').value = 'Weight(kg)';
                            worksheet2.getCell('J5').font = {
                                bold: true
                            };
                            worksheet2.mergeCells('K5', 'K6');
                            worksheet2.getCell('K5').value = 'Cost(Rs.)';
                            worksheet2.getCell('K5').font = {
                                bold: true
                            };

                            worksheet2.mergeCells('L4', 'M4');
                            worksheet2.getCell('L4').value = '             SA Quantity Total';
                            worksheet2.getCell('L4').font = {
                                bold: true
                            };
                            worksheet2.mergeCells('L5', 'L6');
                            worksheet2.getCell('L5').value = 'Weight(kg)';
                            worksheet2.getCell('L5').font = {
                                bold: true
                            };
                            worksheet2.mergeCells('M5', 'M6');
                            worksheet2.getCell('M5').value = 'Cost(Rs.)';
                            worksheet2.getCell('M5').font = {
                                bold: true
                            };

                            //-Giving boarder to assembly header

                            worksheet2.getCell('A4').border = {
                                top: {
                                    style: 'thin'
                                },
                                left: {
                                    style: 'thin'
                                },
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };


                            worksheet2.getCell('B4').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };


                            worksheet2.getCell('C4').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('C5').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('C6').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('D5').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('D6').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('E5').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('E6').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('F5').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('F6').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('G6').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('H5').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('H6').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('I4').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('I5').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('J5').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('K4').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('K5').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('K6').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('L6').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('M4').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('M6').border = {
                                top: {
                                    style: 'thin'
                                },
                                // left: {style:'thin'},
                                bottom: {
                                    style: 'thin'
                                },
                                right: {
                                    style: 'thin'
                                }
                            };

                            assFinalPartTotalNetWeight = 0;
                            assFinalPartTotalWeight = 0;
                            assFinalPartTotalCost = 0;
                            assFinalProcessingCost = 0;
                            assFinalAddonsWeight = 0;
                            assFinalAddonsCost = 0;
                            AssFinalExtraCost = 0;
                            AssSaUnitTotalWeight = 0;
                            AssSaUnitTotalCost = 0;
                            AssSaQuantityTotalWeight = 0;
                            AssSaQuantityTotalCost = 0;
                            // var getSubAssPartArray = [];


                            _.find(subAssData.subAss, function (o) {
                                SubAssQuantityTotalWeight = 0;
                                SubAssQuantityTotalWeight = o.SAUnitTotalWeight * o.SAQty;

                                SubAssQuantityTotalCost = 0;
                                SubAssQuantityTotalCost = o.SAUnitTotalCost * o.SAQty;

                                // o.SAUnitTotalWeight = 0;
                                var finalAssemblyTotalData = {
                                    "SAQty": o.SAQty,
                                    "SubAssemblyName": o.SAName,
                                    "Unitdetails.PartTotal.NetWeight(kg)": o.UnitdetailsPartTotalNetWeight,
                                    "Unitdetails.PartTotal.GrossWeight(kg)": o.UnitdetailsPartTotalGrossWeight,
                                    "Unitdetails.PartTotal.Cost(Rs.)": o.UnitdetailsPartTotalCost,
                                    "UnitDetails.ProcessingCost(Rs.)": o.UnitDetailsProcessingCost,
                                    "UnitDetails.Addons.Weight(Kg)": o.UnitDetailsAddonsWeight,
                                    "UnitDetails.Addons.Cost(Rs)": o.UnitDetailsAddonsCost,
                                    "UnitDetails.ExtraCost(Rs)": o.UnitDetailsExtraCost,
                                    "SAUnitTotal.Weight(Kg)": o.SAUnitTotalWeight,
                                    "SAUnitTotal.Cost(kg)": o.SAUnitTotalCost,
                                    "SAQuantityTotal.Weight(Kg.)": SubAssQuantityTotalWeight,
                                    "SAQuantityTotal.Cost(Rs)": SubAssQuantityTotalCost,
                                };
                                worksheet2.addRow(finalAssemblyTotalData);

                                assFinalPartTotalNetWeight = o.UnitdetailsPartTotalNetWeight + assFinalPartTotalNetWeight;
                                o.UnitdetailsPartTotalNetWeight = 0;

                                assFinalPartTotalWeight = o.UnitdetailsPartTotalGrossWeight + assFinalPartTotalWeight;
                                o.UnitdetailsPartTotalGrossWeight = 0;

                                assFinalPartTotalCost = o.UnitdetailsPartTotalCost + assFinalPartTotalCost;
                                o.UnitdetailsPartTotalCost = 0;

                                assFinalProcessingCost = o.UnitDetailsProcessingCost + assFinalProcessingCost;
                                o.UnitDetailsProcessingCost = 0;

                                assFinalAddonsWeight = o.UnitDetailsAddonsWeight + assFinalAddonsWeight;
                                o.UnitDetailsAddonsWeight = 0;

                                assFinalAddonsCost = o.UnitDetailsAddonsCost + assFinalAddonsCost;
                                o.UnitDetailsAddonsCost = 0;

                                AssFinalExtraCost = o.UnitDetailsExtraCost + AssFinalExtraCost;
                                o.UnitDetailsExtraCost = 0;

                                AssSaUnitTotalWeight = o.SAUnitTotalWeight + AssSaUnitTotalWeight;
                                o.SAUnitTotalWeight = 0;

                                AssSaUnitTotalCost = o.SAUnitTotalCost + AssSaUnitTotalCost;
                                o.SAUnitTotalCost = 0;

                                AssSaQuantityTotalWeight = SubAssQuantityTotalWeight + AssSaQuantityTotalWeight;
                                SubAssQuantityTotalWeight = 0;

                                AssSaQuantityTotalCost = SubAssQuantityTotalCost + AssSaQuantityTotalCost;
                                SubAssQuantityTotalCost = 0;
                            });

                            var assTotalCalculatedData = {
                                "SAQty": "",
                                "SubAssemblyName": "Total",
                                "Unitdetails.PartTotal.NetWeight(kg)": assFinalPartTotalNetWeight,
                                "Unitdetails.PartTotal.GrossWeight(kg)": assFinalPartTotalWeight,
                                "Unitdetails.PartTotal.Cost(Rs.)": assFinalPartTotalCost,
                                "UnitDetails.ProcessingCost(Rs.)": assFinalProcessingCost,
                                "UnitDetails.Addons.Weight(Kg)": assFinalAddonsWeight,
                                "UnitDetails.Addons.Cost(Rs)": assFinalAddonsCost,
                                "UnitDetails.ExtraCost(Rs)": AssFinalExtraCost,
                                "SAUnitTotal.Weight(Kg)": AssSaUnitTotalWeight,
                                "SAUnitTotal.Cost(kg)": AssSaUnitTotalCost,
                                "SAQuantityTotal.Weight(Kg.)": AssSaQuantityTotalWeight,
                                "SAQuantityTotal.Cost(Rs)": AssSaQuantityTotalCost,
                            };

                            worksheet2.addRow(assTotalCalculatedData);

                            var row = worksheet2.lastRow;
                            var rowsNum = 0;
                            rowsNum = row._number;

                            rowNumLessOne = row._number - 1;
                            worksheet2.getCell('A' + rowNumLessOne).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('B' + rowNumLessOne).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('C' + rowNumLessOne).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('D' + rowNumLessOne).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('E' + rowNumLessOne).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('F' + rowNumLessOne).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('G' + rowNumLessOne).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('H' + rowNumLessOne).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('I' + rowNumLessOne).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('J' + rowNumLessOne).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('K' + rowNumLessOne).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('L' + rowNumLessOne).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('M' + rowNumLessOne).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('A' + rowsNum).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('B' + rowsNum).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('C' + rowsNum).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('D' + rowsNum).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('E' + rowsNum).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('F' + rowsNum).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('G' + rowsNum).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('H' + rowsNum).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('I' + rowsNum).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };
                            worksheet2.getCell('J' + rowsNum).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('K' + rowsNum).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('L' + rowsNum).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };

                            worksheet2.getCell('M' + rowsNum).border = {
                                bottom: {
                                    style: 'thin'
                                }
                            };

                            //-add one more row for total calculation
                            var tempAssSheetArrays = [];
                            async.waterfall([
                                function (callback) {
                                    var index = 0;
                                    var assProcessingTotalTotalCost = 0;
                                    assExcelArray = [];
                                    async.eachSeries(found.processing, function (assProc, callback) {
                                        MProcessItem.findOne({
                                            _id: assProc.processItem
                                        }).select('processItemName').lean().exec(function (err, assProItemName) {
                                            if (err) {
                                                console.log('**** error at function_name of Estimate.js ****', err);
                                                callback(err, null);
                                            } else if (_.isEmpty(assProItemName)) {
                                                callback(null, []);
                                            } else {
                                                MProcessType.findOne({
                                                    _id: assProc.processType
                                                }).deepPopulate('processCat quantity.finalUom').lean().exec(function (err, assProcessTypeData) {
                                                    if (err) {
                                                        console.log('**** error at function_name of Estimate.js ****', err);
                                                        callback(err, null);
                                                    } else if (_.isEmpty(assProcessTypeData)) {
                                                        callback(null, []);
                                                    } else {
                                                        var assProUomId = assProcessTypeData.quantity.finalUom._id;
                                                        MUom.findOne({
                                                            _id: assProUomId
                                                        }).select('uomName').lean().exec(function (err, assProUom) {
                                                            if (err) {
                                                                console.log('**** error at function_name of Estimate.js ****', err);
                                                                callback(err, null);
                                                            } else if (_.isEmpty(assProUom)) {
                                                                callback(null, 'noDataFound');
                                                            } else {
                                                                var assProcessingTotalCost = 0;
                                                                assProcessingTotalCost = assProc.totalCost * assProc.quantity.totalQuantity;
                                                                assProcessingTotalTotalCost = assProcessingTotalCost + assProcessingTotalTotalCost;
                                                                // proCatName = partProcessTypeData.processCat.processCatName;
                                                                var assProExcelObj = {
                                                                    "SAQty": "",
                                                                    "SubAssemblyName": "Processing",
                                                                    "Unitdetails.PartTotal.NetWeight(kg)": assProcessTypeData.processCat.processCatName,
                                                                    "Unitdetails.PartTotal.GrossWeight(kg)": assProItemName.processItemName,
                                                                    "Unitdetails.PartTotal.Cost(Rs.)": assProc.quantity.totalQuantity,
                                                                    "UnitDetails.ProcessingCost(Rs.)": assProUom.uomName,
                                                                    "UnitDetails.Addons.Weight(Kg)": assProcessingTotalCost,
                                                                    "UnitDetails.Addons.Cost(Rs)": "",
                                                                    "UnitDetails.ExtraCost(Rs)": "",
                                                                    "SAUnitTotal.Weight(Kg)": "",
                                                                    "SAUnitTotal.Cost(kg)": " ",
                                                                    "SAQuantityTotal.Weight(Kg.)": "",
                                                                    "SAQuantityTotal.Cost(Rs)": "",

                                                                };

                                                                //- processing header
                                                                if (index == 0) {
                                                                    //- blank row above processing
                                                                    worksheet2.addRow({
                                                                        "": ""
                                                                    });

                                                                    // worksheet2.addRow({
                                                                    //     "SAQty": "",
                                                                    //     "SubAssemblyName": "Processing Name",
                                                                    //     "Unitdetails.PartTotal.Weight(kg)": "Category",
                                                                    //     "Unitdetails.PartTotal.Cost(Rs.)": "Item",
                                                                    //     "UnitDetails.ProcessingCost(Rs.)": "Quantity",
                                                                    //     "UnitDetails.Addons.Weight(Kg)": "UOM",
                                                                    //     "UnitDetails.Addons.Cost(Rs)": "Total Cost",
                                                                    //     "UnitDetails.ExtraCost(Rs)": "",
                                                                    //     "SAUnitTotal.Weight(Kg)": '',
                                                                    //     "SAUnitTotal.Weight(Kg)": '',
                                                                    //     "SAUnitTotal.Cost(kg)": "",
                                                                    //     "SAQuantityTotal.Weighth(Kg.)": "",
                                                                    //     "SAQuantityTotal.Cost(Rs)": "",
                                                                    // });
                                                                    var row = worksheet2.lastRow;
                                                                    var rowsNum = 0;
                                                                    rowsNum = row._number;

                                                                    rowNumMoreOne = row._number + 1;

                                                                    worksheet2.getCell('B' + rowNumMoreOne).value = "Processing Name";
                                                                    worksheet2.getCell('B' + rowNumMoreOne).font = {
                                                                        bold: true
                                                                    };

                                                                    worksheet2.getCell('C' + rowNumMoreOne).value = "Category";
                                                                    worksheet2.getCell('C' + rowNumMoreOne).font = {
                                                                        bold: true
                                                                    };

                                                                    worksheet2.getCell('D' + rowNumMoreOne).value = "Item";
                                                                    worksheet2.getCell('D' + rowNumMoreOne).font = {
                                                                        bold: true
                                                                    };

                                                                    worksheet2.getCell('E' + rowNumMoreOne).value = "Quantity";
                                                                    worksheet2.getCell('E' + rowNumMoreOne).font = {
                                                                        bold: true
                                                                    };

                                                                    worksheet2.getCell('F' + rowNumMoreOne).value = "UOM";
                                                                    worksheet2.getCell('F' + rowNumMoreOne).font = {
                                                                        bold: true
                                                                    };
                                                                    worksheet2.getCell('G' + rowNumMoreOne).value = "Total Cost";
                                                                    worksheet2.getCell('G' + rowNumMoreOne).font = {
                                                                        bold: true
                                                                    };

                                                                }

                                                                worksheet2.addRow(assProExcelObj);
                                                                var lastIndex = found.processing.length - 1;
                                                                if (lastIndex == index) {
                                                                    worksheet2.addRow({
                                                                        "SAQty": "",
                                                                        "SubAssemblyName": " ",
                                                                        "Unitdetails.PartTotal.NetWeight(kg)": "",
                                                                        "Unitdetails.PartTotal.GrossWeight(kg)": "",
                                                                        "Unitdetails.PartTotal.Cost(Rs.)": "",
                                                                        "UnitDetails.ProcessingCost(Rs.)": "",
                                                                        "UnitDetails.Addons.Weight(Kg)": assProcessingTotalTotalCost,
                                                                        "UnitDetails.Addons.Cost(Rs)": "",
                                                                        "UnitDetails.ExtraCost(Rs)": "",
                                                                        "SAUnitTotal.Weight(Kg)": '',
                                                                        "SAUnitTotal.Cost(kg)": "",
                                                                        "SAQuantityTotal.Weight(Kg.)": "",
                                                                        "SAQuantityTotal.Cost(Rs)": "",
                                                                    });
                                                                    var row = worksheet2.lastRow;
                                                                    var rowsNum = 0;
                                                                    rowsNum = row._number;

                                                                    rowNumLessOne = row._number - 1;
                                                                    worksheet2.getCell('A' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('B' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('C' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('D' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('E' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('F' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('G' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('H' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('I' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('J' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };

                                                                    worksheet2.getCell('K' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };

                                                                    worksheet2.getCell('L' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('M' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };


                                                                    worksheet2.getCell('A' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('B' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('C' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('D' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('E' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('F' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('G' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('H' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('I' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('J' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };

                                                                    worksheet2.getCell('K' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };

                                                                    worksheet2.getCell('L' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('M' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };

                                                                }
                                                                assExcelArray.push(assProExcelObj);
                                                                index++;
                                                                callback();
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }, function (err) {
                                        if (err) {
                                            console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                        } else {
                                            callback(null, "done");
                                        }
                                    });
                                },
                                function (aa, callback) {
                                    var assAddonsTotalTotalCost = 0;
                                    var index = 0;
                                    async.eachSeries(found.addons, function (assAddons, callback) {
                                        MAddonType.findOne({
                                            _id: assAddons.addonType
                                        }).deepPopulate('materialSubCat').lean().exec(function (err, addMatSubCatName) {
                                            var addonMaterialSubCatName = addMatSubCatName.materialSubCat.materialSubCatName;
                                            if (err) {
                                                console.log('**** error at function_name of Estimate.js ****', err);
                                                callback(err, null);
                                            } else if (_.isEmpty(addMatSubCatName)) {
                                                callback(null, 'noDataFound');
                                            } else {
                                                MUom.findOne({
                                                    _id: addMatSubCatName.rate.uom
                                                }).lean().exec(function (err, addUom) {
                                                    if (err) {
                                                        console.log('**** error at function_name of Estimate.js ****', err);
                                                        callback(err, null);
                                                    } else if (_.isEmpty(addUom)) {
                                                        callback(null, []);
                                                    } else {
                                                        MMaterial.findOne({
                                                            _id: assAddons.addonItem
                                                        }).select('materialName weightPerUnit').lean().exec(function (err, addonsMatName) {
                                                            if (err) {
                                                                console.log('**** error at function_name of Estimate.js ****', err);
                                                                callback(err, null);
                                                            } else if (_.isEmpty(addonsMatName)) {
                                                                // console.log('****here ****');
                                                                callback(null, 'noDataFound');
                                                            } else {
                                                                var addonsTotalCost = 0;
                                                                //- calculation of sub assembly addons unit cost
                                                                addonsTotalCost = assAddons.quantity.total * assAddons.totalCost;
                                                                assAddonsTotalTotalCost = addonsTotalCost + assAddonsTotalTotalCost;
                                                                assAddonsExcelObj = {
                                                                    "SAQty": "",
                                                                    "SubAssemblyName": "Addon",
                                                                    "Unitdetails.PartTotal.NetWeight(kg)": addonMaterialSubCatName,
                                                                    "Unitdetails.PartTotal.GrossWeight(kg)": addonsMatName.materialName,
                                                                    "Unitdetails.PartTotal.Cost(Rs.)": assAddons.quantity.total,
                                                                    "UnitDetails.ProcessingCost(Rs.)": addUom.uomName,
                                                                    "UnitDetails.Addons.Weight(Kg)": addonsTotalCost,
                                                                    "UnitDetails.Addons.Cost(Rs)": "",
                                                                    "UnitDetails.ExtraCost(Rs)": "",
                                                                    "SAUnitTotal.Weight(Kg)": '',
                                                                    "SAUnitTotal.Cost(kg)": "",
                                                                    "SAQuantityTotal.Weight(Kg.)": "",
                                                                    "SAQuantityTotal.Cost(Rs)": "",
                                                                };

                                                                if (index == 0) {
                                                                    //- blank row above processing
                                                                    worksheet2.addRow({
                                                                        "": ""
                                                                    });
                                                                    // worksheet2.addRow({
                                                                    //     "SAQty": "",
                                                                    //     "SubAssemblyName": "Addons Name ",
                                                                    //     "Unitdetails.PartTotal.Weight(kg)": "Category",
                                                                    //     "Unitdetails.PartTotal.Cost(Rs.)": "Item",
                                                                    //     "UnitDetails.ProcessingCost(Rs.)": "Quantity",
                                                                    //     "UnitDetails.Addons.Weight(Kg)": "UOM",
                                                                    //     "UnitDetails.Addons.Cost(Rs)": "Total Cost",
                                                                    //     "UnitDetails.ExtraCost(Rs)": "",
                                                                    //     "SAUnitTotal.Weight(Kg)": '',
                                                                    //     "SAUnitTotal.Weight(Kg)": '',
                                                                    //     "SAUnitTotal.Cost(kg)": "",
                                                                    //     "SAQuantityTotal.Weighth(Kg.)": "",
                                                                    //     "SAQuantityTotal.Cost(Rs)": "",
                                                                    // });

                                                                    var row = worksheet2.lastRow;
                                                                    var rowsNum = 0;
                                                                    rowsNum = row._number;

                                                                    rowNumMoreOne = row._number + 1;

                                                                    worksheet2.getCell('B' + rowNumMoreOne).value = "Addon Name";
                                                                    worksheet2.getCell('B' + rowNumMoreOne).font = {
                                                                        bold: true
                                                                    };

                                                                    worksheet2.getCell('C' + rowNumMoreOne).value = "Category";
                                                                    worksheet2.getCell('C' + rowNumMoreOne).font = {
                                                                        bold: true
                                                                    };

                                                                    worksheet2.getCell('D' + rowNumMoreOne).value = "Item";
                                                                    worksheet2.getCell('D' + rowNumMoreOne).font = {
                                                                        bold: true
                                                                    };

                                                                    worksheet2.getCell('E' + rowNumMoreOne).value = "Quantity";
                                                                    worksheet2.getCell('E' + rowNumMoreOne).font = {
                                                                        bold: true
                                                                    };

                                                                    worksheet2.getCell('F' + rowNumMoreOne).value = "UOM";
                                                                    worksheet2.getCell('F' + rowNumMoreOne).font = {
                                                                        bold: true
                                                                    };
                                                                    worksheet2.getCell('G' + rowNumMoreOne).value = "Total Cost";
                                                                    worksheet2.getCell('G' + rowNumMoreOne).font = {
                                                                        bold: true
                                                                    };

                                                                }

                                                                worksheet2.addRow(assAddonsExcelObj);
                                                                var lastIndex = found.addons.length - 1;
                                                                if (lastIndex == index) {
                                                                    worksheet2.addRow({
                                                                        "SAQty": "",
                                                                        "SubAssemblyName": "",
                                                                        "Unitdetails.PartTotal.NetWeight(kg)": "",
                                                                        "Unitdetails.PartTotal.GrossWeight(kg)": "",
                                                                        "Unitdetails.PartTotal.Cost(Rs.)": "",
                                                                        "UnitDetails.ProcessingCost(Rs.)": "",
                                                                        "UnitDetails.Addons.Weight(Kg)": assAddonsTotalTotalCost,
                                                                        "UnitDetails.Addons.Cost(Rs)": "",
                                                                        "UnitDetails.ExtraCost(Rs)": "",
                                                                        "SAUnitTotal.Weight(Kg)": '',
                                                                        "SAUnitTotal.Cost(kg)": "",
                                                                        "SAQuantityTotal.Weight(Kg.)": "",
                                                                        "SAQuantityTotal.Cost(Rs)": "",
                                                                    });
                                                                    var row = worksheet2.lastRow;
                                                                    var rowsNum = 0;
                                                                    rowsNum = row._number;

                                                                    rowNumLessOne = row._number - 1;
                                                                    worksheet2.getCell('A' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('B' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('C' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('D' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('E' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('F' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('G' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('H' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('I' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('J' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };

                                                                    worksheet2.getCell('K' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };

                                                                    worksheet2.getCell('L' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };

                                                                    worksheet2.getCell('M' + rowNumLessOne).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('A' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('B' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };

                                                                    worksheet2.getCell('C' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('D' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('E' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('F' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('G' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('H' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('I' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('J' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };

                                                                    worksheet2.getCell('K' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };

                                                                    worksheet2.getCell('L' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                    worksheet2.getCell('M' + rowsNum).border = {
                                                                        bottom: {
                                                                            style: 'thin'
                                                                        }
                                                                    };
                                                                }
                                                                assExcelArray.push(assAddonsExcelObj);
                                                                index++;
                                                                callback();
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });

                                    }, function (err) {
                                        if (err) {
                                            console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                        } else {
                                            callback(null, "done");
                                        }
                                    });
                                },
                                function (bbb, callback) {
                                    var index = 0;
                                    var extraTotalTotalCost = 0;

                                    async.eachSeries(found.extras, function (assExtras, callback) {
                                        MExtra.findOne({
                                            _id: assExtras.extraItem
                                        }).deepPopulate('extraItem').lean().exec(function (err, extrasItem) {
                                            if (err) {
                                                console.log('**** error at function_name of Estimate.js ****', err);
                                                callback(err, null);
                                            } else if (_.isEmpty(extrasItem)) {
                                                callback(null, 'noDataFound');
                                            } else {
                                                MUom.findOne({
                                                    _id: extrasItem.rate.uom
                                                }).lean().exec(function (err, extraUom) {
                                                    if (err) {
                                                        console.log('**** error at function_name of Estimate.js ****', err);
                                                        callback(err, null);
                                                    } else if (_.isEmpty(extraUom)) {
                                                        callback(null, 'noDataFound');
                                                    } else {
                                                        var extraTotalCost = 0;
                                                        extraTotalCost = (assExtras.totalCost * assExtras.quantity);
                                                        extraTotalTotalCost = (extraTotalCost + extraTotalTotalCost);

                                                        //- extra header
                                                        if (index == 0) {
                                                            //- blank row above extra
                                                            worksheet2.addRow({
                                                                "": ""
                                                            });


                                                            // worksheet2.addRow({
                                                            //     "SAQty": "",
                                                            //     "SubAssemblyName": "Extra Name",
                                                            //     "Unitdetails.PartTotal.Weight(kg)": "",
                                                            //     "Unitdetails.PartTotal.Cost(Rs.)": "",
                                                            //     "UnitDetails.ProcessingCost(Rs.)": "Quantity",
                                                            //     "UnitDetails.Addons.Weight(Kg)": "UOM",
                                                            //     "UnitDetails.Addons.Cost(Rs)": "Total Cost",
                                                            //     "UnitDetails.ExtraCost(Rs)": "",
                                                            //     "SAUnitTotal.Weight(Kg)": '',
                                                            //     "SAUnitTotal.Weight(Kg)": '',
                                                            //     "SAUnitTotal.Cost(kg)": "",
                                                            //     "SAQuantityTotal.Weighth(Kg.)": "",
                                                            //     "SAQuantityTotal.Cost(Rs)": "",
                                                            // });
                                                            var row = worksheet2.lastRow;
                                                            var rowsNum = 0;
                                                            rowsNum = row._number;

                                                            rowNumMoreOne = row._number + 1;

                                                            worksheet2.getCell('B' + rowNumMoreOne).value = "Extra Name";
                                                            worksheet2.getCell('B' + rowNumMoreOne).font = {
                                                                bold: true
                                                            };

                                                            worksheet2.getCell('E' + rowNumMoreOne).value = "Quantity";
                                                            worksheet2.getCell('E' + rowNumMoreOne).font = {
                                                                bold: true
                                                            };

                                                            worksheet2.getCell('F' + rowNumMoreOne).value = "UOM";
                                                            worksheet2.getCell('F' + rowNumMoreOne).font = {
                                                                bold: true
                                                            };
                                                            worksheet2.getCell('G' + rowNumMoreOne).value = "Total Cost";
                                                            worksheet2.getCell('G' + rowNumMoreOne).font = {
                                                                bold: true
                                                            };

                                                        }

                                                        assExtrasExcelObj = {
                                                            "SAQty": "",
                                                            "SubAssemblyName": "Extra",
                                                            "Unitdetails.PartTotal.NetWeight(kg)": "",
                                                            "Unitdetails.PartTotal.GrossWeight(kg)": "",
                                                            "Unitdetails.PartTotal.Cost(Rs.)": assExtras.quantity,
                                                            "UnitDetails.ProcessingCost(Rs.)": extraUom.uomName,
                                                            "UnitDetails.Addons.Weight(Kg)": extraTotalCost,
                                                            "UnitDetails.Addons.Cost(Rs)": "",
                                                            "UnitDetails.ExtraCost(Rs)": "",
                                                            "SAUnitTotal.Weight(Kg)": '',
                                                            "SAUnitTotal.Cost(kg)": "",
                                                            "SAQuantityTotal.Weight(Kg.)": "",
                                                            "SAQuantityTotal.Cost(Rs)": "",
                                                        };

                                                        worksheet2.addRow(assExtrasExcelObj);
                                                        var lastIndex = found.extras.length - 1;
                                                        if (lastIndex == index) {
                                                            worksheet2.addRow({
                                                                "SAQty": "",
                                                                "SubAssemblyName": "",
                                                                "Unitdetails.PartTotal.NetWeight(kg)": "",
                                                                "Unitdetails.PartTotal.GrossWeight(kg)": "",
                                                                "Unitdetails.PartTotal.Cost(Rs.)": "",
                                                                "UnitDetails.ProcessingCost(Rs.)": "",
                                                                "UnitDetails.Addons.Weight(Kg)": extraTotalTotalCost,
                                                                "UnitDetails.Addons.Cost(Rs)": "",
                                                                "UnitDetails.ExtraCost(Rs)": "",
                                                                "SAUnitTotal.Weight(Kg)": '',
                                                                "SAUnitTotal.Cost(kg)": "",
                                                                "SAQuantityTotal.Weight(Kg.)": "",
                                                                "SAQuantityTotal.Cost(Rs)": "",
                                                            });
                                                            var row = worksheet2.lastRow;
                                                            var rowsNum = 0;
                                                            rowsNum = row._number;

                                                            rowNumLessOne = row._number - 1;
                                                            worksheet2.getCell('A' + rowNumLessOne).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };
                                                            worksheet2.getCell('B' + rowNumLessOne).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };
                                                            worksheet2.getCell('C' + rowNumLessOne).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };
                                                            worksheet2.getCell('D' + rowNumLessOne).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };
                                                            worksheet2.getCell('E' + rowNumLessOne).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };
                                                            worksheet2.getCell('F' + rowNumLessOne).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };
                                                            worksheet2.getCell('G' + rowNumLessOne).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };
                                                            worksheet2.getCell('H' + rowNumLessOne).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };
                                                            worksheet2.getCell('I' + rowNumLessOne).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };
                                                            worksheet2.getCell('J' + rowNumLessOne).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };

                                                            worksheet2.getCell('K' + rowNumLessOne).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };

                                                            worksheet2.getCell('L' + rowNumLessOne).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };
                                                            worksheet2.getCell('M' + rowNumLessOne).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };


                                                            worksheet2.getCell('A' + rowsNum).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };
                                                            worksheet2.getCell('B' + rowsNum).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };
                                                            worksheet2.getCell('C' + rowsNum).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };
                                                            worksheet2.getCell('D' + rowsNum).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };
                                                            worksheet2.getCell('E' + rowsNum).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };
                                                            worksheet2.getCell('F' + rowsNum).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };
                                                            worksheet2.getCell('G' + rowsNum).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };
                                                            worksheet2.getCell('H' + rowsNum).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };
                                                            worksheet2.getCell('I' + rowsNum).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };
                                                            worksheet2.getCell('J' + rowsNum).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };

                                                            worksheet2.getCell('K' + rowsNum).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };

                                                            worksheet2.getCell('L' + rowsNum).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };
                                                            worksheet2.getCell('M' + rowsNum).border = {
                                                                bottom: {
                                                                    style: 'thin'
                                                                }
                                                            };

                                                        }
                                                        // tempSubAssSheetArrays.push(sa);
                                                        assExcelArray.push(assExtrasExcelObj);
                                                        index++;
                                                        callback();
                                                    }

                                                });

                                            }
                                        });
                                    }, function (err) {
                                        if (err) {
                                            console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                        } else {
                                            callback(null, "done");
                                        }
                                    });
                                }
                            ], function () {
                                if (err) {
                                    console.log('***** error at final response of async.waterfall in function_name of Components.js *****', err);
                                } else {
                                    workbook.xlsx.writeFile('./assets/importFormat/' + assSheetName +'.xlsx').then(function () {
                                        var excelFileName = './assets/importFormat/' + assSheetName +'.xlsx';
                                        // console.log('**** excel file nameeeeee ****', excelFileName);
                                        file = excelFileName.split('/').pop();
                                        DraftEstimate.findOneAndUpdate({
                                            _id: data._id,
                                        }, {
                                            draftEstimateExcel: file
                                        }).exec(function (err, updatedData) {
                                            if (err) {
                                                console.log('**** error at function_name of Estimate.js ****', err);
                                                callback(err, null);
                                            } else if (_.isEmpty(updatedData)) {
                                                callback(null, 'noDataFound');
                                            } else {
                                                console.log('Assembly sheet is written');
                                                callback();
                                            }

                                        });
                                    });
                                }
                            });
                        }],
                    },
                    function (err, results) {
                        // console.log('**** inside final success/response of User.js ****', results);
                        callback(null, file);
                    });

            }
        });

    },

};

module.exports = _.assign(module.exports, exports, model);