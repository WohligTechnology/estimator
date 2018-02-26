module.exports = {
    index: function (req, res) {
        res.metaView();
    },
    download: function (req, res) {
        Config.readUploaded(req.param("filename"), null, null, null, res);
    },
    backend: function (req, res) {
        var env = require("../../config/env/" + sails.config.environment + ".js");
        res.view("production/backend", {
            jsFiles: jsFilesBackend,
            title: "Backend",
            description: "Backend",
            keywords: "Backend",
            adminurl: env.realHost + "/api/",
        });
    },
    gitPull: function (req, res) {
        function gitPull() {
            exec('git pull', function (error, stdout, stderr) {
                if (error) {
                    return;
                }
                res.callback(error, {
                    stdout: stdout,
                    stderr: stderr
                });
            });
        }

        function decryptData(text) {
            if (text) {
                if (moment.unix(text).isBetween(moment().add(-1, "minute"), moment().add(1, "minute"))) {
                    gitPull();
                } else {
                    res.notFound();
                }
            } else {
                res.notFound();
            }
        }
        if (req.params && req.params.data) {
            decryptData(req.params.data);
        } else {
            res.notFound();
        }
    },
    demo: function (req, res) {
        sails.renderView('email/welcome', {
            name: "Tushar",
            lastname: "Sachde",
            hobbies: ["cricket", "name", "email", "phone"]
        }, function (err, view) {
            res.send(view);
        });
    },

    delRestrictions: function (req, res) {
        callback = res.callback;
        var modelName = req.url.split("/").pop();

        if (modelName == 'Customer') {
            var myModel = [{
                models: "Enquiry",
                fieldName: ["customerId"]
            }];
        }
        if (modelName == 'DraftEstimate') {
            var myModel = [{
                models: "Estimate",
                fieldName: ["draftEstimateId"]
            }];
        }
        if (modelName == 'Enquiry') {
            var myModel = [{
                    models: "DraftEstimate",
                    fieldName: ["enquiryId"]
                },
                {
                    models: "Estimate",
                    fieldName: ["enquiryId"]
                }
            ];
        }
        if (modelName == 'Estimate') {
            var myModel = [{
                    models: "EstimateSubAssembly",
                    fieldName: ["estimateId"]
                },
                {
                    models: "MMaterial",
                    fieldName: ["estimateId"]
                }
            ];
        }
        if (modelName == 'EstimateAddons') {
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
            ];
        }
        if (modelName == 'EstimateExtras') {
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

            ];
        }
        if (modelName == 'EstimatePart') {
            var myModel = [{
                models: "EstimateSubAssembly",
                fieldName: ["subAssemblyParts"]
            }];
        }
        if (modelName == 'EstimateProcessing') {
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
            ];
        }
        if (modelName == 'EstimateSubAssembly') {
            var myModel = [{
                    models: "Estimate",
                    fieldName: ["subAssemblies"]
                },
                {
                    models: "EstimatePart",
                    fieldName: ["subAssemblyId"]
                }
            ];
        }
        // if (data.modelName == 'MAddonsPresets') {
        //     var myModel = [{
        //         models: "EstimateAddons",
        //         fieldName: ["addonType"]
        //     }]
        // }

        if (modelName == 'MAddonType') {
            var myModel = [{
                    models: "EstimateAddons",
                    fieldName: ["addonType"]
                },
                {
                    models: "MPartType",
                    fieldName: ["addons"]
                }
            ];
        }
        if (modelName == 'MExtra') {
            var myModel = [{
                    models: "EstimateExtras",
                    fieldName: ["extraItem"]
                },
                {
                    models: "MPartType",
                    fieldName: ["extras"]
                }
            ];
        }
        // if (data.modelName == 'MExtrasPreset') {
        //     var myModel = [{
        //         models: "",
        //         fieldName: [""]
        //     }]
        // }

        if (modelName == 'MMaterial') {
            var myModel = [
                {
                //     models: "MMaterialSubCat",
                //     fieldName: ["materials"],
                //     base: true
                // },{
                    models: "EstimateAddons",
                    fieldName: ["addonItem"]
                },
                {
                    models: "EstimatePart",
                    fieldName: ["material", "customMaterial"]
                },
                
                {
                    models: "MPartType",
                    fieldName: ["material"]
                }
            ];
        }
        if (modelName == 'MMaterialCat') {
            var myModel = [{
                    models: "MAddonType",
                    fieldName: ["materialCat"]
                // },
                // {
                //     models: "MMaterialSubCat",
                //     fieldName: ["catId"]
                }
            ];
        }
        if (modelName == 'MMaterialSubCat') {
            var myModel = [
                {
                //     models: "MMaterialCat",
                //     fieldName: ["subCat"],
                //     base: true
                // },{
                    models: "MAddonType",
                    fieldName: ["materialSubCat"]
                // },
                // {
                //     models: "MMaterial",
                //     fieldName: ["materialSubCategory"]
                },
     

            ];
        }
        if (modelName == 'MPartPresets') {
            var myModel = [{
                models: "EstimatePart",
                fieldName: ["shortcut"]

            }]
        }
        if (modelName == 'MPartType') {
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
            ];
        }
        if (modelName == 'MPartTypeCat') {
            var myModel = [{
                models: "MPartType",
                fieldName: ["partTypeCat"]
            }];
        }
        if (modelName == 'MProcessCat') {
            var myModel = [{
            //     models: "MProcessItem",
            //     fieldName: ["processCat"]
            // },
            //  {
                models: "MProcessType",
                fieldName: ["processCat"]
            }];
        }
        // if (data.modelName == 'MProcessingPresets') {
        //     var myModel = [{
        //         models: "",
        //         fieldName: [""]
        //     }]
        // }
        if (modelName == 'MProcessItem') {
            var myModel = [{
                    models: "EstimateProcessing",
                    fieldName: ["processItem"]
                }
                // {
                //     models: "MProcessCat",
                //     fieldName: ["processItems"]
                // }
            ];
        }
        if (modelName == 'MProcessType') {
            var myModel = [{
                    models: "EstimateProcessing",
                    fieldName: ["processType"]
                },
                {
                    models: "MPartType",
                    fieldName: ["proccessing"]
                }
            ];
        }
        if (modelName == 'MShape') {
            var myModel = [{
                models: "MPartPresets",
                fieldName: ["shape"]
            }];
        }
        if (modelName == 'MUom') {
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
            ];
        }
        if (modelName == 'User') {
            var myModel = [{
                    models: "DraftEstimate",
                    fieldName: ["estimateCreatedUser", "estimateUpdatedUser"]
                },
                {
                    models: "Enquiry",
                    fieldName: ["enquiryDetails.estimator"]
                },
                {
                    models: "Estimate",
                    fieldName: ["estimateCreatedUser", "estimateUpdatedUser"]
                }
            ];
        }
        if (modelName == 'MDifficultyFactor') {
            var myModel = [{
                    models: "CustomMaterial",
                    fieldName: ["difficultyFactor"]
                },
                {
                    models: "Estimate",
                    fieldName: ["estimateId"]
                },
                {
                    models: "MMaterial",
                    fieldName: ["hardFacingAlloys.alloy"]
                },
                {
                    models: "MMaterial",
                    fieldName: ["basePlate.baseMetal"]
                }
            ];
        }
        var allDependency = [];
        async.eachSeries(req.body.idsArray, function (ids, callback) {
            async.eachSeries(myModel, function (m, callback) {
                async.eachSeries(m.fieldName, function (f, callback) {
                        this[m.models].findOne({
                            [f]: ids
                        }).select('_id').lean().exec(function (err, found) {
                            if (err) {
                                console.log('**** error at delRestrictions ****', err);
                                callback(err, null);
                            } else if (_.isEmpty(found)) {
                                console.log(' no dependency of the table ' + m.models + ' with attribute ' + [f]);
                                callback(null, []);
                            } else {
                                allDependency.push({
                                    model: m.models,
                                    fieldName: f,
                                    _id: found,
                                    for_id: ids
                                });
                                console.log('dependency of the table ' + m.models + ' with attribute ' + [f]);
                                callback();
                            }
                        });
                    },
                    function (err) {
                        if (err) {
                            console.log('***** error at final response of async.eachSeries in function_name of MMaterial.js*****', err);
                        } else {
                            callback();
                        }
                    });
            }, function (err) {                
                if (err) {
                    console.log('**** error at delRestrictions ****', err);
                } else if (_.isEmpty(allDependency)) {
                    this[modelName].remove({ //remove record
                        _id: ids
                    }).lean().exec(function (err, found1) {
                        if (err) {
                            console.log('**** error at function_name of MMaterial.js ****', err);
                            callback(err, null);
                        } else if (_.isEmpty(found1)) {
                            callback(null, []);
                        } else {
                            callback(null, found1);
                        }
                    });

                } else if (myModel[0].base == true && allDependency.length <2) {                    
                    // async.eachSeries(myModel[2], function (m, callback) {
                    var myId = _.map(allDependency, '_id._id');
                    this[myModel[0].models].findOneAndUpdate({
                        _id: {
                            $in: myId
                        }
                    }, {
                        $pull: {
                            [myModel[0].fieldName]: ids
                        },
                    }).exec(function (err, updatedData) {
                        if (err) {
                            console.log('**** error at function_name of WebController.js ****', err);
                            callback(err, null);
                        } else if (_.isEmpty(updatedData)) {
                            callback(null, []);
                        } else {
                            this[modelName].remove({ //remove record
                                _id: ids
                            }).lean().exec(function (err, found2) {
                                if (err) {
                                    console.log('**** error at function_name of MMaterial.js ****', err);
                                    callback(err, null);
                                } else if (_.isEmpty(found2)) {
                                    callback(null, []);
                                } else {
                                    callback(null, found2);
                                }
                            });
                        }
                    });
                    // }, function (err) {
                    //     if (err) {
                    //         console.log('***** error at final response of async.eachSeries in function_name of WebController.js*****', err);
                    //     } else {
                    //         callback();
                    //     }
                    // });
                } else {
                    callback(null, 'dependency of tables');
                }
            });
        }, function (err) {
            if (err) {
                console.log('***** error at final response of async.eachSeries in function_name of WebController.js*****', err);
            } else {
                callback(null, allDependency);
            }
        });
    },
    deleteMultipleModelRecords: function (req, res) {
        if (req.body) {
            var modelName = req.url.split("/").pop();
            console.log('****%%%%%%%%%%% ****', modelName);
            var myModel = modelName;
            global[modelName].find({
                _id: {
                    $in: req.body.idsArray
                }
            }).exec(function (err, found) {
                if (err) {
                    console.log('**** error at deleteMultipleMaterials of Material.js ****', err);
                    callback(err, null);
                } else if (_.isEmpty(found)) {
                    callback(null, 'no data found');
                } else {
                    callback(null, found);
                }
            });
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            });
        }
    },
};