var schema = new Schema({
    estimateId: {
        type: Schema.Types.ObjectId,
        ref: "Estimate",
        index: true
    },
    extraLevel: {
        type: String,
        enum: ['assembly', 'subAssembly', 'part'],
        default: 'assembly'
    },
    extraItem: {
        type: Schema.Types.ObjectId,
        ref: "MExtra",
        index: true,
    },
    quantity: Number,
    totalCost: Number,
    remarks: String
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('EstimateExtras', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);