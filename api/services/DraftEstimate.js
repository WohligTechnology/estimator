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

        DraftEstimate.findOne({
            _id: data._id
        }).lean().exec(function (err, found) {

            console.log(' &&&&&&&&&&&&&&&&&&&&&&&&&&&&& found &&&&&&&&&&&&&&&&&&&&&&&&&&&&&');

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
                    draftEstimateId: found.estimateId,
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
                                    // subAssembliesArray.push(savedSubAss._id);
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
                                                partsArray.push(savedPart._id);
                                                async.parallel({

                                                    partProcessing: function (callback) {
                                                        async.eachSeries(part.proccessing, function (proObj, callback) {
                                                            proObj.processingLevel = "part";
                                                            proObj.processingLevelId = savedPart._id;
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
                                                                // savedPart.proccessing.push();
                                                                // EstimatePart.saveData(savedPart, function (err, updatedPartProcess) {
                                                                //     if (err) {
                                                                //         console.log('**** error at function_name of DraftEstimate.js ****', err);
                                                                //     } else {
                                                                //         callback();
                                                                //     }
                                                                // });
                                                                callback();
                                                            }
                                                        });
                                                    },
                                                    partAddons: function (callback) {
                                                        async.eachSeries(part.addons, function (addonsObj, callback) {
                                                            addonsObj.addonsLevel = "part";
                                                            addonsObj.addonsLevelId = savedPart._id;
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
                                                                // savedPart.addons.push(partAddonsArray);
                                                                // EstimatePart.saveData(savedPart, function (err, updatedPartAddons) {
                                                                //     if (err) {
                                                                //         console.log('**** error at function_name of DraftEstimate.js ****', err);
                                                                //     } else {
                                                                //         callback();
                                                                //     }
                                                                // });
                                                                callback();
                                                            }
                                                        });
                                                    },
                                                    partExtras: function (callback) {
                                                        async.eachSeries(part.extras, function (extrasObj, callback) {
                                                            extrasObj.extraLevel = "part";
                                                            extrasObj.extraLevelId = savedPart._id;
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
                                                                // savedPart.extras.push(partExtrasArray);
                                                                // EstimatePart.saveData(savedPart, function (err, updatedPartExtras) {
                                                                //     if (err) {
                                                                //         console.log('**** error at function_name of DraftEstimate.js ****', err);
                                                                //     } else {
                                                                //         callback();
                                                                //     }
                                                                // });
                                                                callback();
                                                            }
                                                        });
                                                    }
                                                }, function (err, finalResults) {
                                                    if (err) {
                                                        console.log('********** error at final response of async.parallel  DraftEstimate.js ************', err);
                                                        callback(err, null);
                                                    } else {

                                                        savedPart.proccessing = partProccessingArray;
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

                                            async.parallel({
                                                subAssProcessing: function (callback) {

                                                    async.eachSeries(subAss.proccessing, function (proObj, callback) {
                                                        proObj.processingLevel = "part";
                                                        proObj.processingLevelId = savedPart._id;
                                                        EstimateProcessing.saveData(proObj, function (err, savedSubAssProcess) {
                                                            if (err) {
                                                                console.log('**** error at partProcessing of DraftEstimate.js ****', err);
                                                            } else {
                                                                subAssProccessingArray.push(savedSubAssProcess._id);
                                                                callback();
                                                            }
                                                        });
                                                    }, function (err) {
                                                        if (err) {
                                                            console.log('***** error at final response of async.eachSeries in partProcessing of DraftEstimate.js*****', err);
                                                        } else {
                                                            // savedPart.proccessing.push();
                                                            // EstimatePart.saveData(savedPart, function (err, updatedPartProcess) {
                                                            //     if (err) {
                                                            //         console.log('**** error at function_name of DraftEstimate.js ****', err);
                                                            //     } else {
                                                            //         callback();
                                                            //     }
                                                            // });
                                                            callback();
                                                        }
                                                    });
                                                },
                                                subAssAddons: function (callback) {
                                                    async.eachSeries(subAss.addons, function (addonsObj, callback) {
                                                        addonsObj.addonsLevel = "part";
                                                        addonsObj.addonsLevelId = savedPart._id;
                                                        EstimateAddons.saveData(addonsObj, function (err, savedSubAssAddon) {
                                                            if (err) {
                                                                console.log('**** error at partAddons of DraftEstimate.js ****', err);
                                                            } else {
                                                                subAssAddonsArray.push(savedSubAssAddon._id);
                                                                callback();
                                                            }
                                                        });
                                                    }, function (err) {
                                                        if (err) {
                                                            console.log('***** error at final response of async.eachSeries in partAddons of DraftEstimate.js*****', err);
                                                        } else {
                                                            // savedPart.addons.push(partAddonsArray);
                                                            // EstimatePart.saveData(savedPart, function (err, updatedPartAddons) {
                                                            //     if (err) {
                                                            //         console.log('**** error at function_name of DraftEstimate.js ****', err);
                                                            //     } else {
                                                            //         callback();
                                                            //     }
                                                            // });
                                                            callback();
                                                        }
                                                    });
                                                },
                                                subAssExtras: function (callback) {
                                                    async.eachSeries(subAss.extras, function (extrasObj, callback) {
                                                        extrasObj.extraLevel = "part";
                                                        extrasObj.extraLevelId = savedPart._id;
                                                        EstimateExtras.saveData(extrasObj, function (err, savedSubAssExtra) {
                                                            if (err) {
                                                                console.log('**** error at partExtras of DraftEstimate.js ****', err);
                                                            } else {
                                                                subAssExtrasArray.push(savedSubAssExtra._id);
                                                                callback();
                                                            }
                                                        });
                                                    }, function (err) {
                                                        if (err) {
                                                            console.log('***** error at final response of async.eachSeries in partExtras of DraftEstimate.js*****', err);
                                                        } else {
                                                            // savedPart.extras.push(partExtrasArray);
                                                            // EstimatePart.saveData(savedPart, function (err, updatedPartExtras) {
                                                            //     if (err) {
                                                            //         console.log('**** error at function_name of DraftEstimate.js ****', err);
                                                            //     } else {
                                                            //         callback();
                                                            //     }
                                                            // });
                                                            callback();
                                                        }
                                                    });
                                                }
                                            }, function (err, finalResults) {
                                                if (err) {
                                                    console.log('********** error at final response of async.parallel  DraftEstimate.js ************', err);
                                                    callback(err, null);
                                                } else {

                                                    savedSubAss.proccessing = subAssProccessingArray;
                                                    savedSubAss.addons = subAssAddonsArray;
                                                    savedSubAss.extras = subAssExtrasArray;

                                                    EstimateSubAssembly.saveData(savedSubAss, function (err, updatedSubAss) {
                                                        if (err) {
                                                            console.log('**** error at function_name of DraftEstimate.js ****', err);
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

                                async.parallel({
                                    assProcessing: function (callback) {
                                        async.eachSeries(found.proccessing, function (proObj, callback) {
                                            proObj.processingLevel = "estimate";
                                            proObj.processingLevelId = savedAssembly._id;
                                            EstimateProcessing.saveData(proObj, function (err, savedSubAssProcess) {
                                                if (err) {
                                                    console.log('**** error at partProcessing of DraftEstimate.js ****', err);
                                                } else {
                                                    assProccessingArray.push(savedSubAssProcess._id);
                                                    callback();
                                                }
                                            });
                                        }, function (err) {
                                            if (err) {
                                                console.log('***** error at final response of async.eachSeries in partProcessing of DraftEstimate.js*****', err);
                                            } else {
                                                // savedPart.proccessing.push();
                                                // EstimatePart.saveData(savedPart, function (err, updatedPartProcess) {
                                                //     if (err) {
                                                //         console.log('**** error at function_name of DraftEstimate.js ****', err);
                                                //     } else {
                                                //         callback();
                                                //     }
                                                // });
                                                callback();
                                            }
                                        });
                                    },
                                    assAddons: function (callback) {
                                        async.eachSeries(found.addons, function (addonsObj, callback) {
                                            addonsObj.addonsLevel = "estimate";
                                            addonsObj.addonsLevelId = savedAssembly._id;
                                            EstimateAddons.saveData(addonsObj, function (err, savedSubAssAddon) {
                                                if (err) {
                                                    console.log('**** error at partAddons of DraftEstimate.js ****', err);
                                                } else {
                                                    assAddonsArray.push(savedSubAssAddon._id);
                                                    callback();
                                                }
                                            });
                                        }, function (err) {
                                            if (err) {
                                                console.log('***** error at final response of async.eachSeries in partAddons of DraftEstimate.js*****', err);
                                            } else {
                                                // savedPart.addons.push(partAddonsArray);
                                                // EstimatePart.saveData(savedPart, function (err, updatedPartAddons) {
                                                //     if (err) {
                                                //         console.log('**** error at function_name of DraftEstimate.js ****', err);
                                                //     } else {
                                                //         callback();
                                                //     }
                                                // });
                                                callback();
                                            }
                                        });
                                    },
                                    assExtras: function (callback) {
                                        async.eachSeries(found.extras, function (extrasObj, callback) {
                                            extrasObj.extraLevel = "estimate";
                                            extrasObj.extraLevelId = savedAssembly._id;
                                            EstimateExtras.saveData(extrasObj, function (err, savedSubAssExtra) {
                                                if (err) {
                                                    console.log('**** error at partExtras of DraftEstimate.js ****', err);
                                                } else {
                                                    assExtrasArray.push(savedSubAssExtra._id);
                                                    callback();
                                                }
                                            });
                                        }, function (err) {
                                            if (err) {
                                                console.log('***** error at final response of async.eachSeries in partExtras of DraftEstimate.js*****', err);
                                            } else {
                                                // savedPart.extras.push(partExtrasArray);
                                                // EstimatePart.saveData(savedPart, function (err, updatedPartExtras) {
                                                //     if (err) {
                                                //         console.log('**** error at function_name of DraftEstimate.js ****', err);
                                                //     } else {
                                                //         callback();
                                                //     }
                                                // });
                                                callback();
                                            }
                                        });
                                    }
                                }, function (err) {
                                    if (err) {
                                        console.log('********** error at final response of async.parallel  DraftEstimate.js ************', err);
                                    } else {
                                        savedAssembly.proccessing = assProccessingArray;
                                        savedAssembly.addons = assAddonsArray;
                                        savedAssembly.extras = assExtrasArray;

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
            proccessing: [],
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
                    draftEstimateObj.assemplyNumber =   'AS1';
                    console.log('**** if 0 ****',draftEstimateObj.assemplyNumber);
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
                            var temp = _.split(lastDraftEstimate.assemplyNumber, 'S');
                            var tempNUmber = _.toNumber(temp[1]) + 1;
                            draftEstimateObj.assemplyNumber = 'AS'+tempNUmber;
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
};
module.exports = _.assign(module.exports, exports, model);