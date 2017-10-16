var schema = new Schema({
    materialSubCatName: {
        type: String,
        required: true
    },
    catId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MMaterialCat',
        key:"subCat",
        required: true
    },
    materials: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MMaterial',
        required: true
    }],
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MMaterialSubCat', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);