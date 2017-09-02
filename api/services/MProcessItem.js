var schema = new Schema({
    processItemName: {
        type:String
    },
    processCat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MProcessCat',
        required: true,
        key:"processItems"
    },
    rate: Number
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MProcessItem', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);