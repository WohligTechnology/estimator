var schema = new Schema({
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
    estimateId: {
        type: Schema.Types.ObjectId,
        ref: "Estimate",
        required: true,
        key: 'subAssemblies'
    },

    subAssemblyParts: [{
        type: Schema.Types.ObjectId,
        ref: "EstimatePart",
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
module.exports = mongoose.model('EstimateSubAssembly', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);