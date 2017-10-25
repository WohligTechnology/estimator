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

    proccessing: [{
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
module.exports = mongoose.model('Estimate', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    removeUnwantedField:function(data,callback){
        delete data._id;
        delete data.createdAt;
        delete data.updatedAt;
        delete data.__v;
        callback(data)
    },

    removePAEFields: function (data, callback) {
        removeUnwantedField(data);
        async.eachSeries(data.proccessing, function (pro, callback) {
            removeUnwantedField(pro);
            callback();
        }, function (err) {
            if (err) {
                console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
            } else {
                async.eachSeries(data.addons, function (add, callback) {
                    removeUnwantedField(add);
                    callback();
                }, function (err) {
                    if (err) {
                        console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                    } else {
                        async.eachSeries(data.extras, function (ext, callback) {
                            removeUnwantedField(ext);
                            callback();
                        }, function (err) {
                            if (err) {
                                console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                            } else {
                                callback(data);
                            }
                        });
                    }
                });
            }
        });
    },

    // import assembly by passing assembly number
    importAssembly: function (data, callback) {
        Estimate.find({
                assemplyNumber: data.assemplyNumber
            }).deepPopulate('subAssemblies proccessing addons extras subAssemblies.subAssemblyParts subAssemblies.extras subAssemblies.addons subAssemblies.proccessing subAssemblies.subAssemblyParts.proccessing subAssemblies.subAssemblyParts.addons subAssemblies.subAssemblyParts.extras')
            .lean().exec(function (err, found) {
                if (err) {
                    console.log('**** error at importAssembly of Estimate.js ****', err);
                    callback(err, null);
                } else if (_.isEmpty(found)) {
                    callback(null, 'noDataFound');
                } else {
                    callback(null, found);
                }
            });
    },


};
module.exports = _.assign(module.exports, exports, model);