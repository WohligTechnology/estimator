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

schema.plugin(deepPopulate, {});
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

            if (err) {
                console.log('**** error at function_name of DraftEstimate.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                delete found._id;

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
                

                var assemblyObj = {
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
                    assemblyObj:found
                };
                console.log(' @@@@@@@@@@@@@@@@@ assemblyObj @@@@@@@@@@@@@@@@@@@', assemblyObj);

                Estimate.saveData(assemblyObj, function (err, savedAssembly) {
                    if (err) {
                        console.log('**** error at Estimate.saveData of DraftEstimate.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(savedAssembly)) {
                        callback(null, 'noDataFound');
                    } else {
                        console.log(' ******************************************* inside success of Estimate.saveData ******************************************* ');
                        async.eachSeries(found.subAssemblies, function (subAss, callback) {

                            var subAssObj = {
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
                                subAssemblyObj:subAss
                            };

                            EstimateSubAssembly.saveData(subAssObj, function (err, savedSubAss) {
                                if (err) {
                                    console.log(' **** error at EstimateSubAssembly.saveData of DraftEstimate.js **** ', err);
                                    callback(err, null);
                                } else if (_.isEmpty(savedSubAss)) {
                                    callback(null, 'noDataFound');
                                } else {
                                    console.log(' ******************************************* inside success of EstimateSubAssembly.saveData ******************************************* ');
                                    subAssembliesArray.push(savedSubAss._id);
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
                                            processing: [],
                                            addons: [],
                                            extras: [],
                                            partObj:part
                                        };

                                        EstimatePart.saveData(partObj, function (err, savedPart) {
                                            if (err) {
                                                console.log('**** error at EstimatePart.saveData of DraftEstimate.js ****', err);
                                                callback(err, null);
                                            } else if (_.isEmpty(savedPart)) {
                                                callback(null, 'noDataFound');
                                            } else {
                                                console.log(' ******************************************* inside success of EstimatePart.saveData ******************************************* ');
                                                partsArray.push(savedPart._id);
                                                async.waterfall([
                                                    function (callback) {
                                                        async.eachSeries(part.processing, function (proObj, callback) {
                                                            var tempProObj = proObj; 
                                                            tempProObj.processingLevel = "part";
                                                            tempProObj.processingLevelId = savedPart._id;
                                                            // tempProObj.processingObj = proObj;
                                                            console.log('**** inside part la processing of DraftEstimate.js & data is ****', proObj);
                                                            EstimateProcessing.saveData(tempProObj, function (err, savedPartProcess) {
                                                                console.log(' ******************************************* inside success of  EstimateProcessing.saveData at part level ******************************************* ');
                                                                if (err) {
                                                                    console.log('**** error at partProcessing@@@@ of DraftEstimate.js ****', err);
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

                                                            tempAddonObj.addonsLevel = "part";
                                                            tempAddonObj.addonsLevelId = savedPart._id;
                                                            // tempAddonObj.addonObj = addonsObj;
                                                            EstimateAddons.saveData(tempAddonObj, function (err, savedPartAddon) {
                                                                console.log(' ******************************************* inside success of  EstimateAddons.saveData at part level ******************************************* ');
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
                                                            tempExtraObj.extraLevelId = savedPart._id;
                                                            // tempExtraObj.extraObj = extrasObj;
                                                            EstimateExtras.saveData(tempExtraObj, function (err, savedPartExtra) {
                                                                console.log(' ******************************************* inside success of  EstimateExtras.saveData at part level ******************************************* ');
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
                                                        tempProObj.processingLevelId = savedSubAss._id;
                                                        // tempProObj.processingObj = proObj;
                                                        // tempProObj.processingObj = {};

                                                        EstimateProcessing.saveData(tempProObj, function (err, savedSubAssProcess) {
                                                            console.log(' ******************************************* inside success of  EstimateProcessing.saveData at subAssembly level ******************************************* ');
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
                                                        tempAddonObj.addonsLevelId = savedSubAss._id;
                                                        // tempAddonObj.addonObj = addonsObj;
                                                        // tempAddonObj.addonObj = {};
                                                        EstimateAddons.saveData(tempAddonObj, function (err, savedSubAssAddon) {
                                                            console.log(' ******************************************* inside success of  EstimateAddons.saveData at subAssembly level ******************************************* ');
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
                                                        // tempExtraObj.extraObj = extrasObj;
                                                        // tempExtraObj.extraObj = {};
                                                        EstimateExtras.saveData(tempExtraObj, function (err, savedSubAssExtra) {
                                                            console.log(' ******************************************* inside success of  EstimateExtra.saveData at subAssembly level ******************************************* ');
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
                                            tempProObj.processingLevelId = savedAssembly._id;
                                            // tempProObj.processingObj = proObj;
                                            // tempProObj.processingObj = {};
                                            EstimateProcessing.saveData(tempProObj, function (err, savedSubAssProcess) {
                                                console.log(' ******************************************* inside success of  EstimateProcessing.saveData at assembly level ******************************************* ');
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
                                            tempAddonObj.addonsLevelId = savedAssembly._id;
                                            // tempAddonObj.addonObj = addonObj;
                                            // tempAddonObj.addonObj = {};
                                            EstimateAddons.saveData(tempAddonObj, function (err, savedSubAssAddon) {
                                                console.log(' ******************************************* inside success of  EstimateAddon.saveData at assembly level ******************************************* ');
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
                                            tempExtraObj.extraLevelId = savedAssembly._id;
                                            // tempExtraObj.extraObj = extrasObj;
                                            // tempExtraObj.extraObj = {};
                                            EstimateExtras.saveData(tempExtraObj, function (err, savedSubAssExtra) {
                                                console.log(' ******************************************* inside success of  EstimateExtra.saveData at assembly level ******************************************* ');
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

    },

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


};
module.exports = _.assign(module.exports, exports, model);