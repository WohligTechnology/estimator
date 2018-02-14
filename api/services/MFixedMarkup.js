var schema = new Schema({
    fixedMarkups: {
        negotiation: Number,
        commission: Number,
        other: Number,
    },
    scaleFactors:{
        low:Number,
        medium:Number,
        high:Number,
        budgetory: Number
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MFixedMarkup', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);