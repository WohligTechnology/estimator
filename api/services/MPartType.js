var schema = new Schema({
    partTypeName: {
        Type: String
    },
    partTypeCode: {
        Type: String
    },
    icon: {
        Type: String
    },
    material: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MMaterial'
    }],
    partTypeCat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MPartTypeCat',
        key: "partTypes",
        required: true
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MPartType', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);