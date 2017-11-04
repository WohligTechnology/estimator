var schema = new Schema({
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

    subAssemblyId: {
        type: Schema.Types.ObjectId,
        ref: "EstimateSubAssembly",
        index: true
        // key: 'subAssemblyParts'
    },

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
    }]
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('EstimatePart', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    importPart: function (data, callback) {
        EstimatePart.findOne({
                partNumber: data.partNumber
            }).deepPopulate('proccessing addons extras')
            .lean().exec(function (err, found) {
                if (err) {
                    console.log('**** error at function_name of EstimatePart.js ****', err);
                    callback(err, null);
                } else if (_.isEmpty(found)) {
                    callback(null, 'noDataFound');
                } else {
                    delete found._id;
                    delete found.createdAt;
                    delete found.updatedAt;
                    delete found.__v;

                    async.parallel([
                        function (callback) {
                            async.eachSeries(found.addons, function (add, callback) {
                                delete add._id;
                                delete add.createdAt;
                                delete add.updatedAt;
                                delete add.__v;
                                callback();

                            }, function (err) {
                                if (err) {
                                    console.log('***** error at final response of async.eachSeries in function_name of EstimatePart.js*****', err);
                                } else {
                                    callback();
                                }
                            });
                        },
                        function (callback) {
                            async.eachSeries(found.proccessing, function (proc, callback) {
                                delete proc._id;
                                delete proc.createdAt;
                                delete proc.updatedAt;
                                delete proc.__v;
                                callback();

                            }, function (err) {
                                if (err) {
                                    console.log('***** error at final response of async.eachSeries in function_name of EstimatePart.js*****', err);
                                } else {
                                    callback();
                                }
                            });
                        },
                        function (callback) {
                            async.eachSeries(found.extras, function (ext, callback) {
                                delete ext._id;
                                delete ext.createdAt;
                                delete ext.updatedAt;
                                delete ext.__v;
                                callback();

                            }, function (err) {
                                if (err) {
                                    console.log('***** error at final response of async.eachSeries in function_name of EstimatePart.js*****', err);
                                } else {
                                    callback();
                                }
                            });

                        }
                    ], function () {
                        if (err) {
                            console.log('********** error at final response of async.parallel  EstimatePart.js ************', err);
                            callback(err, null);
                        } else {
                            callback(null, found);
                        }
                    });
                }
            });
    },
    getEstimatePartData: function (data, callback) {
        EstimatePart.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getEstimatePartData of EstimatePart.js ****', err);
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