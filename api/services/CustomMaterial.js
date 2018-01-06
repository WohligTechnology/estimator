var schema = new Schema({
    customMaterialName: {
        type: String
    },
    uniqueId: String,
    basePlate: {
        thickness: Number,
        baseMetal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MMaterial'
        },
    },
    hardFacingAlloy: [{
        thickness: Number,
        alloy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MMaterial'
        },
        costOfDepRsPerKg: Number,
        costOfDepRsPerSm: Number
    }],
    difficultyFactor : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MDifficultyFactor'
    },
    freeIssue : Boolean,
    totalCostRsPerKg:Number,
    totalCostRsPerSm : Number,
    thickness : String
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('CustomMaterial', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);