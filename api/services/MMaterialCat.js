var schema = new Schema({
    materialCatName: {
        type: String,
        required: true
    },
    subCat: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MMaterialSubCat',
        index:true
    }],
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MMaterialCat', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);