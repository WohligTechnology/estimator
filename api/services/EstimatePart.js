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
        required: true,
        key: 'subAssemblyParts'
    },

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
module.exports = mongoose.model('EstimatePart', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);