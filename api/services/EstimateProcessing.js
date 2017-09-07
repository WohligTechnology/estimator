var schema = new Schema({
    estimateId: {
        type: Schema.Types.ObjectId,
        ref: "Estimate",
        index: true
    },
    processingLevel: {
        type: String,
        enum: ['assembly', 'subAssembly', 'part'],
        default: 'assembly'
    },
    estimateCreatedUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
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
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('EstimateProcessing', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);