var schema = new Schema({
    material: {
        overhead: Number,
        minProfit: Number,
        negotiation: Number,
        commission: Number,
        other: Number,
        totalValue: Number
    },
    process: {
        overhead: Number,
        minProfit: Number,
        negotiation: Number,
        commission: Number,
        other: Number,
        totalValue: Number
    },
    addon: {
        overhead: Number,
        minProfit: Number,
        negotiation: Number,
        commission: Number,
        other: Number,
        totalValue: Number
    },
    extras: {
        overhead: Number,
        minProfit: Number,
        negotiation: Number,
        commission: Number,
        other: Number,
        totalValue: Number
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MMarkup', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);