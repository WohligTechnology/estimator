// estimate collection schema
var schema = new Schema({
    enquiryId: {
        type: Schema.Types.ObjectId,
        ref: "Enquiry",
        index: true
    },
    assemblyName: {
        type: String,
        required: true
    },
    assemblyNumber: { //  start with a + X where X is increasing numbers
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
    draftEstimateId: { // corresponding draft estimate --> _id
        type: Schema.Types.ObjectId,
        ref: "DraftEstimate",
        index: true
    },
    estimateCreatedUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    estimateUpdatedUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    estimateDetails: {}, // not defined yet
    estimateBoq: {},
    estimateAttachment: [{
        file: String
    }],

    subAssemblies: [{
        type: Schema.Types.ObjectId,
        ref: "EstimateSubAssembly",
        index: true
    }],

    processing: [{
        type: Schema.Types.ObjectId,
        ref: "EstimateProcessing",
        index: true
    }],
    addons: [{
        type: Schema.Types.ObjectId,
        ref: "EstimateAddons",
        index: true
    }],
    extras: [{
        type: Schema.Types.ObjectId,
        ref: "EstimateExtras",
        index: true
    }],
    assemblyObj: {},
    estimateVersion: {
        type: String,
    },
});

schema.plugin(deepPopulate, {
    populate: {
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
module.exports = mongoose.model('Estimate', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    //-It helps to remove unwanted fields like _id,_iv etc. from the documents .
    removeUnwantedField: function (data, callback) {
        delete data._id;
        delete data.createdAt;
        delete data.updatedAt;
        delete data.__v;
        callback(data)
    },

    //- import assembly by passing assembly number
    //- import assembly by making deepPopulate all fileds & then send response after deletion of _id,_v etc..  from object
    importAssembly: function (data, callback) {

        DraftEstimate.findOne().sort({
            createdAt: -1
        }).limit(1).exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of Estimate.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                data.lastAssemblyNumber = found.assemblyNumber;
                data.lastAssemblyNumber = data.lastAssemblyNumber.replace(/\d+$/, function (n) {
                    return ++n
                });

                Estimate.findOne({
                    _id: data._id
                }).select('assemblyObj').lean().exec(function (err, found) {
                    if (err) {
                        console.log('**** error at importAssembly of Estimate.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(found)) {
                        callback(null, []);
                    } else {

                        var lastAssemblyNumber = data.lastAssemblyNumber;
                        found.assemblyObj.assemblyNumber = lastAssemblyNumber;
                        var subAssNumber = 1;

                        async.eachSeries(found.assemblyObj.subAssemblies, function (subAss, callback) {
                            subAss.subAssemblyNumber = lastAssemblyNumber + 'SA' + subAssNumber;
                            subAssNumber++;
                            var subAssProcessIndex = 1;
                            var subAssAddonIndex = 1;
                            var subAssExtraIndex = 1;

                            // subAssemblies  PAE
                            async.waterfall([
                                function (callback) {
                                    async.eachSeries(subAss.processing, function (subAssPro, callback) {
                                        subAssPro.processingNumber = subAss.subAssemblyNumber + 'PR' + subAssProcessIndex;
                                        subAssProcessIndex++;
                                        callback();
                                    }, function (err) {
                                        if (err) {
                                            console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                        } else {
                                            callback();
                                        }
                                    });
                                },
                                function (callback) {
                                    async.eachSeries(subAss.addons, function (subAssAdd, callback) {
                                        subAssAdd.addonNumber = subAss.subAssemblyNumber + 'AD' + subAssAddonIndex;
                                        subAssAddonIndex++;
                                        callback();
                                    }, function (err) {
                                        if (err) {
                                            console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                        } else {
                                            callback();
                                        }
                                    });
                                },
                                function (callback) {
                                    async.eachSeries(subAss.extras, function (subAssExt, callback) {
                                        subAssExt.extraNumber = subAss.subAssemblyNumber + 'EX' + subAssExtraIndex;
                                        subAssExtraIndex++;
                                        callback();
                                    }, function (err) {
                                        if (err) {
                                            console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                        } else {
                                            callback();
                                        }
                                    });
                                },
                            ], function () {
                                if (err) {
                                    console.log('***** error at final response of async.waterfall in function_name of Components.js *****', err);
                                } else {
                                    var partNumber = 1;
                                    var partProcessIndex = 1;
                                    var partAddonIndex = 1;
                                    var partExtraIndex = 1;

                                    async.eachSeries(subAss.subAssemblyParts, function (part, callback) {

                                        part.partNumber = subAss.subAssemblyNumber + 'PT' + partNumber;

                                        async.waterfall([
                                            function (callback) {
                                                async.eachSeries(part.processing, function (partPro, callback) {
                                                    partPro.processingNumber = part.partNumber + 'PR' + partProcessIndex;
                                                    partProcessIndex++;
                                                    callback();

                                                }, function (err) {
                                                    if (err) {
                                                        console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                                    } else {
                                                        callback();
                                                    }
                                                });
                                            },
                                            function (callback) {
                                                async.eachSeries(part.addons, function (partAdd, callback) {
                                                    partAdd.addonNumber = part.partNumber + 'AD' + partAddonIndex;
                                                    partAddonIndex++;
                                                    callback();

                                                }, function (err) {
                                                    if (err) {
                                                        console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                                    } else {
                                                        callback();
                                                    }
                                                });
                                            },
                                            function (callback) {
                                                async.eachSeries(part.extras, function (partExt, callback) {
                                                    partExt.extraNumber = part.partNumber + 'EX' + partExtraIndex;
                                                    partExtraIndex++;
                                                    callback();

                                                }, function (err) {
                                                    if (err) {
                                                        console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                                    } else {
                                                        callback();
                                                    }
                                                });
                                            },
                                        ], function () {
                                            if (err) {
                                                console.log('***** error at final response of async.waterfall all in function_name of Components.js *****', err);
                                            } else {
                                                callback();
                                            }
                                        });
                                    }, function (err) {
                                        if (err) {
                                            console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                        } else {
                                            callback();
                                        }
                                    });
                                }
                            });

                        }, function (err) {

                            if (err) {
                                console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                            } else {
                                var assProcessIndex = 1;
                                var assAddonIndex = 1;
                                var assExtraIndex = 1;
                                async.waterfall([
                                    function (callback) {
                                        async.eachSeries(found.assemblyObj.processing, function (assPro, callback) {
                                            assPro.processingNumber = lastAssemblyNumber + 'PR' + assProcessIndex;
                                            assProcessIndex++;
                                            callback();

                                        }, function (err) {
                                            if (err) {
                                                console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                            } else {
                                                callback();
                                            }
                                        });
                                    },
                                    function (callback) {
                                        async.eachSeries(found.assemblyObj.addons, function (assAdd, callback) {
                                            assAdd.addonNumber = lastAssemblyNumber + 'AD' + assAddonIndex;
                                            assAddonIndex++;
                                            callback();

                                        }, function (err) {
                                            if (err) {
                                                console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                            } else {
                                                callback();
                                            }
                                        });
                                    },
                                    function (callback) {
                                        async.eachSeries(found.assemblyObj.extras, function (assExt, callback) {
                                            assExt.extraNumber = lastAssemblyNumber + 'EX' + assExtraIndex;
                                            assExtraIndex++;
                                            callback();

                                        }, function (err) {
                                            if (err) {
                                                console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                                            } else {
                                                callback();
                                            }
                                        });
                                    },
                                ], function () {
                                    if (err) {
                                        console.log('***** error at final response of async.waterfall in function_name of Components.js *****', err);
                                    } else {
                                        callback(null, found);
                                    }
                                });
                            }
                        });

                    }
                });
            }
        });
    },

    //-get all estimate data from estimate table.
    getEstimateData: function (data, callback) {
        Estimate.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getEstimateData of Estimate.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    //-search the estimate records using assembly name or assembly number with pagination.
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
        Estimate.find({}).sort({
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

    //-get all unique assembly nos. from estimate table.
    getAllUniqueAssembliesNo: function (data, callback) {
        Estimate.find().distinct('assemblyNumber').lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getAllUniqueAssembliesNo of Estimate.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    //-Get Estimate version by passing enquiry Id.
    getEstimateVersion: function (data, callback) {
        Estimate.find({
            enquiryId: data.enquiryId
        }).deepPopulate('estimateCreatedUser estimateUpdatedUser').select('estimateVersion createdAt updatedAt estimateCreatedUser estimateUpdatedUser').exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of Estimate.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, found);
            }
        });
    },

    //-Get all Estimate Versions by passing assembly no.
    getAllEstimateVersionOnAssemblyNo: function (data, callback) {
        Estimate.find({
            assemblyNumber: data.assemblyNumber
        }).select('estimateVersion assemblyNumber').lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of Estimate.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, found);
            }
        });
    },
    // what this function will do ?
    // req data --> ?
    getVersionsOfAssNo: function (data, callback) {
        Estimate.aggregate(
            [{
                $group: {
                    _id: '$assemblyNumber',
                    versionDetail: {
                        $push: {
                            versionNumber: "$estimateVersion",
                            _id: "$_id"
                        }
                    }
                },
            }]
        ).exec(function (err, found) {
            console.log('**** 111111111111 ****', found);
            if (err) {
                console.log('**** error at function_name of Estimate.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                var temp = [];
                var tempObj = {
                    assemblyNumber: "",
                    versionDetail: []
                };
                async.eachSeries(found, function (n, callback) {
                    console.log('**** 22222222222222****', n);

                    temp.push({
                        assemblyNumber: n._id,
                        versionDetail: n.versionDetail
                    });
                    callback();

                }, function (err) {
                    if (err) {
                        console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                    } else {
                        callback(null, temp);
                    }
                });
            }
        });
    },
    // generateDraftEstExcel: function (data, callback) {
    //     DraftEstimate.findOne({
    //         _id: data._id
    //     }).lean().exec(function (err, found) {
    //         if (err) {
    //             console.log('**** error at function_name of DraftEstimate.js ****', err);
    //             callback(err, null);
    //         } else if (_.isEmpty(found)) {
    //             callback(null, []);
    //         } else {
    //             var workbook = new Excel.Workbook();
    //             var worksheet1 = workbook.addWorksheet('Assembly', {
    //                 properties: {
    //                     tabColor: {
    //                         argb: 'FFC0000'
    //                     }
    //                 }
    //             });
    //             var worksheet2 = workbook.addWorksheet('Sub Assembly');
    //             var worksheet3 = workbook.addWorksheet('Sub Assembly Parts');
    //             var worksheet4 = workbook.addWorksheet('Part Processing');
    //             var worksheet5 = workbook.addWorksheet('Part Addons');
    //             var worksheet6 = workbook.addWorksheet('Part Extras');
    //             var worksheet7 = workbook.addWorksheet('Sub Assembly Processing');
    //             var worksheet8 = workbook.addWorksheet('Sub Assembly Addons');
    //             var worksheet9 = workbook.addWorksheet('Sub Assembly Extras');
    //             var worksheet10 = workbook.addWorksheet('Assembly Processing');
    //             var worksheet11 = workbook.addWorksheet('Assembly Addons');
    //             var worksheet12 = workbook.addWorksheet('Assembly Extras');

    //             worksheet1.autoFilter = 'A1:C1';

    //             worksheet1.columns = [{
    //                     header: 'Assembly Name',
    //                     key: 'assemblyName',
    //                     width: 20
    //                 },
    //                 {
    //                     header: 'Assembly Number',
    //                     key: 'assemblyNumber',
    //                     width: 20
    //                 },
    //                 {
    //                     header: 'KVC Perimeter',
    //                     key: 'keyValueCalculations.perimeter',
    //                     width: 15
    //                 },
    //                 {
    //                     header: 'KVC SheetMetalArea',
    //                     key: 'keyValueCalculations.SheetMetalArea',
    //                     width: 18
    //                 },
    //                 {
    //                     header: 'KVC SurfaceArea',
    //                     key: 'keyValueCalculations.surfaceArea',
    //                     width: 15
    //                 },
    //                 {
    //                     header: 'KVC Weight',
    //                     key: 'keyValueCalculations.weight',
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

    //             worksheet1.addRow({
    //                 assemblyName: found.assemblyName,
    //                 assemblyNumber: found.assemblyNumber,
    //                 'keyValueCalculations.perimeter': found.keyValueCalculations.perimeter,
    //                 'keyValueCalculations.sheetMetalArea': found.keyValueCalculations.sheetMetalArea,
    //                 'keyValueCalculations.surfaceArea': found.keyValueCalculations.surfaceArea,
    //                 'keyValueCalculations.weight': found.keyValueCalculations.weight,
    //                 'keyValueCalculations.numbers': found.keyValueCalculations.numbers,
    //                 'keyValueCalculations.hours': found.keyValueCalculations.hours,
    //                 totalWeight: found.totalWeight,
    //                 materialCost: found.materialCost,
    //                 processingCost: found.processingCost,
    //                 addonCost: found.addonCost,
    //                 extrasCost: found.extrasCost,
    //                 totalCost: found.totalCost,
    //                 estimateDetails: found.estimateDetails,
    //                 estimateBoq: found.estimateBoq,
    //             });


    //             //-Merge Cells

    //             worksheet1.mergeCells('A4:B5');
    //             worksheet1.getCell('A4').value = '';

    //             //-get cell font bold
    //             worksheet1.getCell('B1').font = {
    //                 // extrasCost: found.extrasCost,
    //                 family: 4,
    //                 size: 16,
    //                 underline: true,
    //                 bold: true
    //             };


    //             // cell boarder coloring

    //             worksheet1.getCell('A3').border = {
    //                 top: {
    //                     style: 'double',
    //                     color: {
    //                         argb: 'FF00FF00'
    //                     }
    //                 },
    //                 left: {
    //                     style: 'double',
    //                     color: {
    //                         argb: 'FF00FF00'
    //                     }
    //                 },
    //                 bottom: {
    //                     style: 'double',
    //                     color: {
    //                         argb: 'FF00FF00'
    //                     }
    //                 },
    //                 right: {
    //                     style: 'double',
    //                     color: {
    //                         argb: 'FF00FF00'
    //                     }
    //                 }
    //             };

    //             // expect(worksheet.getCell('B5').value).toBe(worksheet.getCell('A4').value);
    //             // expect(worksheet.getCell('B5').master).toBe(worksheet.getCell('A4'));

    //             // ... merged cells share the same style object
    //             // expect(worksheet.getCell('B5').style).toBe(worksheet.getCell('A4').style);
    //             // worksheet1.getCell('B5').style.font = myFonts.arial;
    //             // expect(worksheet.getCell('A4').style.font).toBe(myFonts.arial);

    //             workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
    //                 console.log('sheet 1 is written');
    //             });

    //             async.eachSeries(found.subAssemblies, function (subAss, callback) {

    //                 worksheet2.columns = [{
    //                         header: 'Sub Assembly Name',
    //                         key: 'subAssemblyName',
    //                         width: 25,
    //                     }, {
    //                         header: 'Sub Assembly Number',
    //                         key: 'subAssemblyNumber',
    //                         width: 20
    //                     },
    //                     {
    //                         header: 'Quantity',
    //                         key: 'quantity',
    //                         width: 20
    //                     },
    //                     {
    //                         header: 'Total Value',
    //                         key: 'totalValue',
    //                         width: 10
    //                     },
    //                     {
    //                         header: 'KVC Perimeter',
    //                         key: 'keyValueCalculations.perimeter',
    //                         width: 15
    //                     },
    //                     {
    //                         header: 'KVC SheetMetalArea',
    //                         key: 'keyValueCalculations.SheetMetalArea',
    //                         width: 18
    //                     },
    //                     {
    //                         header: 'KVC SurfaceArea',
    //                         key: 'keyValueCalculations.surfaceArea',
    //                         width: 15
    //                     },
    //                     {
    //                         header: 'KVC Weight',
    //                         key: 'keyValueCalculations.weight',
    //                         width: 15
    //                     },
    //                     {
    //                         header: 'KVC Numbers',
    //                         key: 'keyValueCalculations.numbers',
    //                         width: 15
    //                     },
    //                     {
    //                         header: 'KVC hours',
    //                         key: 'keyValueCalculations.hours',
    //                         width: 10
    //                     },


    //                 ];

    //                 worksheet2.addRow({
    //                     subAssemblyName: subAss.subAssemblyName,
    //                     subAssemblyNumber: subAss.subAssemblyNumber,
    //                     quantity: subAss.quantity,
    //                     totalValue: subAss.totalValue,
    //                     'keyValueCalculations.perimeter': subAss.keyValueCalculations.perimeter,
    //                     'keyValueCalculations.sheetMetalArea': subAss.keyValueCalculations.sheetMetalArea,
    //                     'keyValueCalculations.surfaceArea': subAss.keyValueCalculations.surfaceArea,
    //                     'keyValueCalculations.weight': subAss.keyValueCalculations.weight,
    //                     'keyValueCalculations.numbers': subAss.keyValueCalculations.numbers,
    //                     'keyValueCalculations.hours': subAss.keyValueCalculations.hours,
    //                 });

    //                 workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
    //                     console.log('sheet 2 is written');
    //                 });
    //                 async.eachSeries(subAss.subAssemblyParts, function (part, callback) {
    //                     worksheet3.columns = [{
    //                             header: 'PartName',
    //                             key: 'partName',
    //                             width: 25,
    //                         }, {
    //                             header: 'PartNumber',
    //                             key: 'partNumber',
    //                             width: 20
    //                         },
    //                         {
    //                             header: 'Size',
    //                             key: 'size',
    //                             width: 20
    //                         },
    //                         {
    //                             header: 'Quantity',
    //                             key: 'quantity',
    //                             width: 10
    //                         },
    //                         {
    //                             header: 'ScaleFactor',
    //                             key: 'scaleFactor',
    //                             width: 10
    //                         },
    //                         {
    //                             header: 'FC MaterialPrice',
    //                             key: 'finalCalculation.materialPrice',
    //                             width: 20
    //                         },
    //                         {
    //                             header: 'FC ItemUnitPrice',
    //                             key: 'finalCalculation.itemUnitPrice',
    //                             width: 20
    //                         },
    //                         {
    //                             header: 'FC TotalCostForQuantity',
    //                             key: 'finalCalculation.totalCostForQuantity',
    //                             width: 20
    //                         },
    //                         {
    //                             header: 'KVC Perimeter',
    //                             key: 'keyValueCalculations.perimeter',
    //                             width: 20
    //                         },
    //                         {
    //                             header: 'KVC SheetMetalArea',
    //                             key: 'keyValueCalculations.sheetMetalArea',
    //                             width: 20
    //                         },
    //                         {
    //                             header: 'KVC SurfaceArea',
    //                             key: 'keyValueCalculations.surfaceArea',
    //                             width: 20
    //                         },
    //                         {
    //                             header: 'KVC Weight',
    //                             key: 'keyValueCalculations.weight',
    //                             width: 20
    //                         }

    //                     ];

    //                     worksheet3.addRow({
    //                         partName: part.partName,
    //                         partNumber: part.partNumber,
    //                         size: part.size,
    //                         quantity: part.quantity,
    //                         scaleFactor: part.scaleFactor,
    //                         'finalCalculation.materialPrice': part.finalCalculation.materialPrice,
    //                         'finalCalculation.itemUnitPrice': part.finalCalculation.itemUnitPrice,
    //                         'finalCalculation.totalCostForQuantity': part.finalCalculation.totalCostForQuantity,
    //                         'keyValueCalculations.perimeter': part.keyValueCalculations.perimeter,
    //                         'keyValueCalculations.sheetMetalArea': part.keyValueCalculations.sheetMetalArea,
    //                         'keyValueCalculations.surfaceArea': part.keyValueCalculations.surfaceArea,
    //                         'keyValueCalculations.weight': part.keyValueCalculations.weight

    //                     });

    //                     workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
    //                         console.log('sheet 3 is written');
    //                     });

    //                     async.waterfall([
    //                         function (callback) {
    //                             async.eachSeries(part.processing, function (proObj, callback) {
    //                                 // tempProObj.processingObj = proObj;
    //                                 worksheet4.columns = [
    //                                     // {
    //                                     //     header: 'processingLevel',
    //                                     //     key: 'processingLevel',
    //                                     //     width: 25,
    //                                     // }, 
    //                                     {
    //                                         header: 'ProcessingLevelId',
    //                                         key: 'processingLevelId',
    //                                         width: 20
    //                                     },
    //                                     {
    //                                         header: 'ProcessingNumber',
    //                                         key: 'processingNumber',
    //                                         width: 20
    //                                     },
    //                                     {
    //                                         header: 'Rate',
    //                                         key: 'rate',
    //                                         width: 10
    //                                     },
    //                                     {
    //                                         header: 'Quantity.keyValue.keyVariable',
    //                                         key: 'quantity.keyValue.keyVariable',
    //                                         width: 30
    //                                     },
    //                                     {
    //                                         header: 'Quantity.KeyValue.keyValue',
    //                                         key: 'quantity.keyValue.keyValue',
    //                                         width: 30
    //                                     },
    //                                     {
    //                                         header: 'Quantity.Utilization',
    //                                         key: 'quantity.utilization',
    //                                         width: 15
    //                                     },
    //                                     {
    //                                         header: 'Quantity.ContengncyOrWastage',
    //                                         key: 'quantity.contengncyOrWastage',
    //                                         width: 30
    //                                     },
    //                                     {
    //                                         header: 'Quantity.total',
    //                                         key: 'quantity.total',
    //                                         width: 15
    //                                     },
    //                                     {
    //                                         header: 'TotalCost',
    //                                         key: 'totalCost',
    //                                         width: 10
    //                                     },
    //                                     {
    //                                         header: 'Remarks',
    //                                         key: 'remarks',
    //                                         width: 20
    //                                     }


    //                                 ];

    //                                 worksheet4.addRow({
    //                                     // processingLevel: proObj.processingLevel,
    //                                     processingLevelId: proObj.processingLevelId,
    //                                     processingNumber: proObj.processingNumber,
    //                                     rate: proObj.rate,
    //                                     'quantity.keyValue.keyVariable': proObj.quantity.keyValue.keyVariable,
    //                                     'quantity.keyValue.keyValue': proObj.quantity.keyValue.keyValue,
    //                                     'quantity.utilization': proObj.quantity.utilization,
    //                                     'quantity.contengncyOrWastage': proObj.quantity.contengncyOrWastage,
    //                                     'quantity.total': proObj.quantity.total,
    //                                     'totalCost': proObj.totalCost,
    //                                     'remarks': proObj.remarks,
    //                                 });

    //                                 workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
    //                                     console.log('sheet 4 is written');
    //                                     callback();
    //                                 });


    //                             }, function (err) {
    //                                 if (err) {
    //                                     console.log('***** error at final response of async.eachSeries in partProcessing of DraftEstimate.js*****', err);
    //                                 } else {
    //                                     callback();
    //                                 }
    //                             });
    //                         },
    //                         function (callback) {
    //                             async.eachSeries(part.addons, function (addonsObj, callback) {
    //                                 worksheet5.columns = [
    //                                     // {
    //                                     //     header: 'addonsLevel',
    //                                     //     key: 'addonsLevel',
    //                                     //     width: 25,
    //                                     // },
    //                                     {
    //                                         header: 'AddonsLevelId',
    //                                         key: 'addonsLevelId',
    //                                         width: 20
    //                                     },
    //                                     {
    //                                         header: 'AddonNumber',
    //                                         key: 'addonNumber',
    //                                         width: 20
    //                                     },
    //                                     {
    //                                         header: 'Rate',
    //                                         key: 'rate',
    //                                         width: 10
    //                                     },
    //                                     {
    //                                         header: 'Quantity.SupportingVariable.SupportingVariable',
    //                                         key: 'quantity.supportingVariable.supportingVariable',
    //                                         width: 35
    //                                     },
    //                                     {
    //                                         header: 'Quantity.SupportingVariable.Value',
    //                                         key: 'quantity.supportingVariable.value',
    //                                         width: 30
    //                                     },
    //                                     {
    //                                         header: 'Quantity.KeyValue.KeyVariable',
    //                                         key: 'quantity.keyValue.keyVariable',
    //                                         width: 25
    //                                     },
    //                                     {
    //                                         header: 'Quantity.KeyValue.KeyValue',
    //                                         key: 'quantity.keyValue.keyValue',
    //                                         width: 20
    //                                     },
    //                                     {
    //                                         header: 'Quantity.Utilization',
    //                                         key: 'quantity.utilization',
    //                                         width: 20
    //                                     },
    //                                     {
    //                                         header: 'Quantity.ContengncyOrWastage',
    //                                         key: 'quantity.contengncyOrWastage',
    //                                         width: 25
    //                                     },
    //                                     {
    //                                         header: 'Quantity.Total',
    //                                         key: 'quantity.total',
    //                                         width: 20
    //                                     },
    //                                     {
    //                                         header: 'TotalCost',
    //                                         key: 'totalCost',
    //                                         width: 20
    //                                     },
    //                                     {
    //                                         header: 'Remarks',
    //                                         key: 'remarks',
    //                                         width: 10
    //                                     }
    //                                 ];

    //                                 worksheet5.addRow({
    //                                     // addonsLevel: addonsObj.addonsLevel,
    //                                     addonsLevelId: addonsObj.addonsLevelId,
    //                                     addonNumber: addonsObj.addonNumber,
    //                                     rate: addonsObj.rate,
    //                                     'quantity.supportingVariable.supportingVariable': addonsObj.quantity.supportingVariable.supportingVariable,
    //                                     'quantity.supportingVariable.value': addonsObj.quantity.supportingVariable.value,
    //                                     'quantity.keyValue.keyVariable': addonsObj.quantity.keyValue.keyVariable,
    //                                     'quantity.keyValue.keyValue': addonsObj.quantity.keyValue.keyValue,
    //                                     'quantity.utilization': addonsObj.quantity.utilization,
    //                                     'quantity.contengncyOrWastage': addonsObj.quantity.contengncyOrWastage,
    //                                     'quantity.total': addonsObj.quantity.total,
    //                                     totalCost: addonsObj.totalCost,
    //                                     remarks: addonsObj.remarks,

    //                                 });

    //                                 workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
    //                                     console.log('sheet 5 is written');
    //                                     callback();
    //                                 });

    //                             }, function (err) {
    //                                 if (err) {
    //                                     console.log('***** error at final response of async.eachSeries in partAddons of DraftEstimate.js*****', err);
    //                                 } else {
    //                                     callback();
    //                                 }
    //                             });
    //                         },
    //                         function (callback) {
    //                             async.eachSeries(part.extras, function (extrasObj, callback) {
    //                                 worksheet6.columns = [
    //                                     // {
    //                                     //     header: 'extraLevel',
    //                                     //     key: 'extraLevel',
    //                                     //     width: 25,
    //                                     // },
    //                                     {
    //                                         header: 'ExtraLevelId',
    //                                         key: 'extraLevelId',
    //                                         width: 15
    //                                     },
    //                                     {
    //                                         header: 'ExtraNumber',
    //                                         key: 'extraNumber',
    //                                         width: 15
    //                                     },
    //                                     {
    //                                         header: 'Quantity',
    //                                         key: 'quantity',
    //                                         width: 10
    //                                     },
    //                                     {
    //                                         header: 'TotalCost',
    //                                         key: 'totalCost',
    //                                         width: 15
    //                                     },
    //                                     {
    //                                         header: 'Remarks',
    //                                         key: 'remarks',
    //                                         width: 20
    //                                     }

    //                                 ];

    //                                 worksheet6.addRow({
    //                                     // extraLevel: extrasObj.extraLevel,
    //                                     extraLevelId: extrasObj.extraLevelId,
    //                                     extraNumber: extrasObj.extraNumber,
    //                                     quantity: extrasObj.quantity,
    //                                     totalCost: extrasObj.totalCost,
    //                                     remarks: extrasObj.remarks
    //                                 });

    //                                 workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
    //                                     console.log('sheet 6 is written');
    //                                     callback();
    //                                 });
    //                             }, function (err) {
    //                                 if (err) {
    //                                     console.log('***** error at final response of async.eachSeries in partExtras of DraftEstimate.js*****', err);
    //                                 } else {
    //                                     callback();
    //                                 }
    //                             });
    //                         }
    //                     ], function (err, finalResults) {
    //                         if (err) {
    //                             console.log('********** error at final response of async.waterfall  DraftEstimate.js ************', err);
    //                         } else {
    //                             callback(null, finalResults);
    //                         }
    //                     });
    //                 }, function (err) {
    //                     if (err) {
    //                         console.log('***** error at final response of 1st async.eachSeries in function_name of DraftEstimate.js *****', err);
    //                     } else {
    //                         async.waterfall([
    //                             function (callback) {
    //                                 async.eachSeries(subAss.processing, function (proObj, callback) {
    //                                     worksheet7.columns = [
    //                                         // {
    //                                         //     header: 'processingLevel',
    //                                         //     key: 'processingLevel',
    //                                         //     width: 25,
    //                                         // },
    //                                         {
    //                                             header: 'ProcessingLevelId',
    //                                             key: 'processingLevelId',
    //                                             width: 15
    //                                         },
    //                                         {
    //                                             header: 'ProcessingNumber',
    //                                             key: 'processingNumber',
    //                                             width: 15
    //                                         },
    //                                         {
    //                                             header: 'Rate',
    //                                             key: 'rate',
    //                                             width: 10
    //                                         },
    //                                         {
    //                                             header: 'Quantity.KeyValue.KeyVariable',
    //                                             key: 'quantity.keyValue.keyVariable',
    //                                             width: 30
    //                                         },
    //                                         {
    //                                             header: 'Quantity.KeyValue.KeyValue',
    //                                             key: 'quantity.keyValue.keyValue',
    //                                             width: 25
    //                                         },
    //                                         {
    //                                             header: 'Quantity.Utilization',
    //                                             key: 'quantity.utilization',
    //                                             width: 15
    //                                         },
    //                                         {
    //                                             header: 'Quantity.ContengncyOrWastage',
    //                                             key: 'quantity.contengncyOrWastage',
    //                                             width: 30
    //                                         },
    //                                         {
    //                                             header: 'Quantity.Total',
    //                                             key: 'quantity.total',
    //                                             width: 15
    //                                         },
    //                                         {
    //                                             header: 'TotalCost',
    //                                             key: 'totalCost',
    //                                             width: 10
    //                                         },
    //                                         {
    //                                             header: 'Remarks',
    //                                             key: 'remarks',
    //                                             width: 10
    //                                         }


    //                                     ];


    //                                     worksheet7.addRow({
    //                                         // processingLevel: proObj.processingLevel,
    //                                         processingLevelId: proObj.processingLevelId,
    //                                         processingNumber: proObj.processingNumber,
    //                                         rate: proObj.rate,
    //                                         'quantity.keyValue.keyVariable': proObj.quantity.keyValue.keyVariable,
    //                                         'quantity.keyValue.keyValue': proObj.quantity.keyValue.keyValue,
    //                                         'quantity.utilization': proObj.quantity.utilization,
    //                                         'quantity.contengncyOrWastage': proObj.quantity.contengncyOrWastage,
    //                                         'quantity.total': proObj.quantity.total,
    //                                         'totalCost': proObj.totalCost,
    //                                         'remarks': proObj.remarks,
    //                                     });

    //                                     workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
    //                                         console.log('sheet 7 is written');
    //                                         callback();
    //                                     });
    //                                 }, function (err) {
    //                                     if (err) {
    //                                         console.log('***** error at final response of async.eachSeries in partProcessing of DraftEstimate.js*****', err);
    //                                     } else {
    //                                         callback();
    //                                     }
    //                                 });
    //                             },
    //                             function (callback) {
    //                                 async.eachSeries(subAss.addons, function (addonsObj, callback) {
    //                                     worksheet8.columns = [
    //                                         // {
    //                                         //     header: 'addonsLevel',
    //                                         //     key: 'addonsLevel',
    //                                         //     width: 25,
    //                                         // },
    //                                         {
    //                                             header: 'AdonsLevelId',
    //                                             key: 'addonsLevelId',
    //                                             width: 15
    //                                         },
    //                                         {
    //                                             header: 'AddonNumber',
    //                                             key: 'addonNumber',
    //                                             width: 15
    //                                         },
    //                                         {
    //                                             header: 'rate',
    //                                             key: 'rate',
    //                                             width: 10
    //                                         },
    //                                         {
    //                                             header: 'Quantity.SupportingVariable.SupportingVariable',
    //                                             key: 'quantity.supportingVariable.supportingVariable',
    //                                             width: 35
    //                                         },
    //                                         {
    //                                             header: 'Quantity.SupportingVariable.Value',
    //                                             key: 'quantity.supportingVariable.value',
    //                                             width: 30
    //                                         },
    //                                         {
    //                                             header: 'Quantity.KeyValue.KeyVariable',
    //                                             key: 'quantity.keyValue.keyVariable',
    //                                             width: 25
    //                                         },
    //                                         {
    //                                             header: 'Quantity.KeyValue.keyValue',
    //                                             key: 'quantity.keyValue.keyValue',
    //                                             width: 20
    //                                         },
    //                                         {
    //                                             header: 'Quantity.Utilization',
    //                                             key: 'quantity.utilization',
    //                                             width: 20
    //                                         },
    //                                         {
    //                                             header: 'Quantity.ContengncyOrWastage',
    //                                             key: 'quantity.contengncyOrWastage',
    //                                             width: 25
    //                                         },
    //                                         {
    //                                             header: 'Quantity.Total',
    //                                             key: 'quantity.total',
    //                                             width: 15
    //                                         },
    //                                         {
    //                                             header: 'TotalCost',
    //                                             key: 'totalCost',
    //                                             width: 10
    //                                         },
    //                                         {
    //                                             header: 'Remarks',
    //                                             key: 'remarks',
    //                                             width: 20
    //                                         }
    //                                     ];

    //                                     worksheet8.addRow({
    //                                         // addonsLevel: addonsObj.addonsLevel,
    //                                         addonsLevelId: addonsObj.addonsLevelId,
    //                                         addonNumber: addonsObj.addonNumber,
    //                                         rate: addonsObj.rate,
    //                                         'quantity.supportingVariable.supportingVariable': addonsObj.quantity.supportingVariable.supportingVariable,
    //                                         'quantity.supportingVariable.value': addonsObj.quantity.supportingVariable.value,
    //                                         'quantity.keyValue.keyVariable': addonsObj.quantity.keyValue.keyVariable,
    //                                         'quantity.keyValue.keyValue': addonsObj.quantity.keyValue.keyValue,
    //                                         'quantity.utilization': addonsObj.quantity.utilization,
    //                                         'quantity.contengncyOrWastage': addonsObj.quantity.contengncyOrWastage,
    //                                         'quantity.total': addonsObj.quantity.total,
    //                                         totalCost: addonsObj.totalCost,
    //                                         remarks: addonsObj.remarks,

    //                                     });


    //                                     workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
    //                                         console.log('sheet 8 is written');
    //                                         callback();
    //                                     });


    //                                 }, function (err) {
    //                                     if (err) {
    //                                         console.log('***** error at final response of async.eachSeries in partAddons of DraftEstimate.js*****', err);
    //                                     } else {
    //                                         callback();
    //                                     }
    //                                 });
    //                             },
    //                             function (callback) {
    //                                 async.eachSeries(subAss.extras, function (extrasObj, callback) {
    //                                     worksheet9.columns = [
    //                                         // {
    //                                         //     header: 'extraLevel',
    //                                         //     key: 'extraLevel',
    //                                         //     width: 25,
    //                                         // },
    //                                         {
    //                                             header: 'ExtraLevelId',
    //                                             key: 'extraLevelId',
    //                                             width: 15
    //                                         },
    //                                         {
    //                                             header: 'ExtraNumber',
    //                                             key: 'extraNumber',
    //                                             width: 15
    //                                         },
    //                                         {
    //                                             header: 'Quantity',
    //                                             key: 'quantity',
    //                                             width: 10
    //                                         },
    //                                         {
    //                                             header: 'TotalCost',
    //                                             key: 'totalCost',
    //                                             width: 10
    //                                         },
    //                                         {
    //                                             header: 'Remarks',
    //                                             key: 'remarks',
    //                                             width: 20
    //                                         }

    //                                     ];

    //                                     worksheet9.addRow({
    //                                         // extraLevel: extrasObj.extraLevel,
    //                                         extraLevelId: extrasObj.extraLevelId,
    //                                         extraNumber: extrasObj.extraNumber,
    //                                         quantity: extrasObj.quantity,
    //                                         totalCost: extrasObj.totalCost,
    //                                         remarks: extrasObj.remarks
    //                                     });

    //                                     workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
    //                                         console.log('sheet 9 is written');
    //                                         callback();
    //                                     });


    //                                 }, function (err) {
    //                                     if (err) {
    //                                         console.log('***** error at final response of async.eachSeries in partExtras of DraftEstimate.js*****', err);
    //                                     } else {
    //                                         callback();
    //                                     }
    //                                 });
    //                             }
    //                         ], function (err, finalResults) {
    //                             if (err) {
    //                                 console.log('********** error at final response of async.waterfall  DraftEstimate.js ************', err);
    //                                 callback(err, null);
    //                             } else {
    //                                 callback(null, finalResults);

    //                             }
    //                         });
    //                     }
    //                 });

    //             }, function (err) {
    //                 if (err) {
    //                     console.log('***** error at final response of 2nd async.eachSeries in function_name of DraftEstimate.js *****', err);
    //                 } else {
    //                     async.waterfall([
    //                         function (callback) {
    //                             async.eachSeries(found.processing, function (proObj, callback) {
    //                                 worksheet10.columns = [
    //                                     //     {
    //                                     //         header: 'processingLevel',
    //                                     //         key: 'processingLevel',
    //                                     //         width: 25,
    //                                     //     },
    //                                     {
    //                                         header: 'ProcessingLevelId',
    //                                         key: 'processingLevelId',
    //                                         width: 15
    //                                     },
    //                                     {
    //                                         header: 'ProcessingNumber',
    //                                         key: 'processingNumber',
    //                                         width: 15
    //                                     },
    //                                     {
    //                                         header: 'Rate',
    //                                         key: 'rate',
    //                                         width: 10
    //                                     },
    //                                     {
    //                                         header: 'Quantity.KeyValue.KeyVariable',
    //                                         key: 'quantity.keyValue.keyVariable',
    //                                         width: 20
    //                                     },
    //                                     {
    //                                         header: 'Quantity.KeyValue.keyValue',
    //                                         key: 'quantity.keyValue.keyValue',
    //                                         width: 20
    //                                     },
    //                                     {
    //                                         header: 'Quantity.Utilization',
    //                                         key: 'quantity.utilization',
    //                                         width: 20
    //                                     },
    //                                     {
    //                                         header: 'Quantity.ContengncyOrWastage',
    //                                         key: 'quantity.contengncyOrWastage',
    //                                         width: 25
    //                                     },
    //                                     {
    //                                         header: 'Quantity.Total',
    //                                         key: 'quantity.total',
    //                                         width: 15
    //                                     },
    //                                     {
    //                                         header: 'TotalCost',
    //                                         key: 'totalCost',
    //                                         width: 10
    //                                     },
    //                                     {
    //                                         header: 'Remarks',
    //                                         key: 'remarks',
    //                                         width: 10
    //                                     }


    //                                 ];

    //                                 worksheet10.addRow({
    //                                     // processingLevel: proObj.processingLevel,
    //                                     processingLevelId: proObj.processingLevelId,
    //                                     processingNumber: proObj.processingNumber,
    //                                     rate: proObj.rate,
    //                                     'quantity.keyValue.keyVariable': proObj.quantity.keyValue.keyVariable,
    //                                     'quantity.keyValue.keyValue': proObj.quantity.keyValue.keyValue,
    //                                     'quantity.utilization': proObj.quantity.utilization,
    //                                     'quantity.contengncyOrWastage': proObj.quantity.contengncyOrWastage,
    //                                     'quantity.total': proObj.quantity.total,
    //                                     'totalCost': proObj.totalCost,
    //                                     'remarks': proObj.remarks,
    //                                 });

    //                                 workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
    //                                     console.log('sheet 10 is written');
    //                                     callback();
    //                                 });

    //                             }, function (err) {
    //                                 if (err) {
    //                                     console.log('***** error at final response of async.eachSeries in partProcessing of DraftEstimate.js*****', err);
    //                                 } else {
    //                                     callback();
    //                                 }
    //                             });
    //                         },
    //                         function (callback) {
    //                             async.eachSeries(found.addons, function (addonsObj, callback) {
    //                                 worksheet11.columns = [
    //                                     // {
    //                                     //     header: 'addonsLevel',
    //                                     //     key: 'addonsLevel',
    //                                     //     width: 25,
    //                                     // },
    //                                     {
    //                                         header: 'AddonsLevelId',
    //                                         key: 'addonsLevelId',
    //                                         width: 15
    //                                     },
    //                                     {
    //                                         header: 'AddonNumber',
    //                                         key: 'addonNumber',
    //                                         width: 15
    //                                     },
    //                                     {
    //                                         header: 'Rate',
    //                                         key: 'rate',
    //                                         width: 10
    //                                     },
    //                                     {
    //                                         header: 'Quantity.SupportingVariable.SupportingVariable',
    //                                         key: 'quantity.supportingVariable.supportingVariable',
    //                                         width: 35
    //                                     },
    //                                     {
    //                                         header: 'Quantity.SupportingVariable.Value',
    //                                         key: 'quantity.supportingVariable.value',
    //                                         width: 30
    //                                     },
    //                                     {
    //                                         header: 'Quantity.keyValue.keyVariable',
    //                                         key: 'quantity.keyValue.keyVariable',
    //                                         width: 25
    //                                     },
    //                                     {
    //                                         header: 'Quantity.KeyValue.KeyValue',
    //                                         key: 'quantity.keyValue.keyValue',
    //                                         width: 20
    //                                     },
    //                                     {
    //                                         header: 'Quantity.Utilization',
    //                                         key: 'quantity.utilization',
    //                                         width: 20
    //                                     },
    //                                     {
    //                                         header: 'Quantity.ContengncyOrWastage',
    //                                         key: 'quantity.contengncyOrWastage',
    //                                         width: 25
    //                                     },
    //                                     {
    //                                         header: 'Quantity.Total',
    //                                         key: 'quantity.total',
    //                                         width: 20
    //                                     },
    //                                     {
    //                                         header: 'TotalCost',
    //                                         key: 'totalCost',
    //                                         width: 15
    //                                     },
    //                                     {
    //                                         header: 'Remarks',
    //                                         key: 'remarks',
    //                                         width: 20
    //                                     }
    //                                 ];

    //                                 worksheet11.addRow({
    //                                     // addonsLevel: addonsObj.addonsLevel,
    //                                     addonsLevelId: addonsObj.addonsLevelId,
    //                                     addonNumber: addonsObj.addonNumber,
    //                                     rate: addonsObj.rate,
    //                                     'quantity.supportingVariable.supportingVariable': addonsObj.quantity.supportingVariable.supportingVariable,
    //                                     'quantity.supportingVariable.value': addonsObj.quantity.supportingVariable.value,
    //                                     'quantity.keyValue.keyVariable': addonsObj.quantity.keyValue.keyVariable,
    //                                     'quantity.keyValue.keyValue': addonsObj.quantity.keyValue.keyValue,
    //                                     'quantity.utilization': addonsObj.quantity.utilization,
    //                                     'quantity.contengncyOrWastage': addonsObj.quantity.contengncyOrWastage,
    //                                     'quantity.total': addonsObj.quantity.total,
    //                                     totalCost: addonsObj.totalCost,
    //                                     remarks: addonsObj.remarks,

    //                                 });


    //                                 workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
    //                                     console.log('sheet 11 is written');
    //                                     callback();
    //                                 });

    //                             }, function (err) {
    //                                 if (err) {
    //                                     console.log('***** error at final response of async.eachSeries in partAddons of DraftEstimate.js*****', err);
    //                                 } else {
    //                                     callback();
    //                                 }
    //                             });
    //                         },
    //                         function (callback) {
    //                             async.eachSeries(found.extras, function (extrasObj, callback) {
    //                                 worksheet12.columns = [
    //                                     // {
    //                                     //     header: 'extraLevel',
    //                                     //     key: 'extraLevel',
    //                                     //     width: 25,
    //                                     // },
    //                                     {
    //                                         header: 'ExtraLevelId',
    //                                         key: 'extraLevelId',
    //                                         width: 15
    //                                     },
    //                                     {
    //                                         header: 'ExtraNumber',
    //                                         key: 'extraNumber',
    //                                         width: 15
    //                                     },
    //                                     {
    //                                         header: 'Quantity',
    //                                         key: 'quantity',
    //                                         width: 10
    //                                     },
    //                                     {
    //                                         header: 'TotalCost',
    //                                         key: 'totalCost',
    //                                         width: 15
    //                                     },
    //                                     {
    //                                         header: 'Remarks',
    //                                         key: 'remarks',
    //                                         width: 20
    //                                     }

    //                                 ];

    //                                 worksheet12.addRow({
    //                                     // extraLevel: extrasObj.extraLevel,
    //                                     extraLevelId: extrasObj.extraLevelId,
    //                                     extraNumber: extrasObj.extraNumber,
    //                                     quantity: extrasObj.quantity,
    //                                     totalCost: extrasObj.totalCost,
    //                                     remarks: extrasObj.remarks
    //                                 });

    //                                 workbook.xlsx.writeFile('./EstimateSheet.xlsx').then(function () {
    //                                     console.log('sheet 12 is written');
    //                                     callback();
    //                                 });

    //                             }, function (err) {
    //                                 if (err) {
    //                                     console.log('***** error at final response of async.eachSeries in partExtras of DraftEstimate.js*****', err);
    //                                 } else {
    //                                     callback();
    //                                 }
    //                             });
    //                         }
    //                     ], function (err) {
    //                         if (err) {
    //                             console.log('********** error at final response of async.waterfall  DraftEstimate.js ************', err);
    //                         } else {
    //                             callback(null, "success");
    //                         }
    //                     });
    //                 }
    //             });
    //         }

    //     });
    // },
};
module.exports = _.assign(module.exports, exports, model);