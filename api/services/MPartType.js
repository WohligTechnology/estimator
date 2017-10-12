var schema = new Schema({
    partTypeName: {
        type: String
    },
    partTypeCode: {
        type: String
    },
    icon: {
        type: String
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

var exports = _.cloneDeep(require("sails-wohlig-service")(schema,'partTypeCat material','partTypeCat material'));
var model = {};
module.exports = _.assign(module.exports, exports, model);