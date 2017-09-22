var schema = new Schema({
    markupType: {
        type: String,
        enum: ['material', 'process', 'addon', 'extra'],
        required: true
    },
    overhead: Number,
    minProfit: Number,
    negotiation: Number,
    commission: Number,
    other: Number,
    totalValue: Number
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MMarkup', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);