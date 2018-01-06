var schema = new Schema({
    materialCatName: {
        type: String,
        required: true
    },
    subCat: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MMaterialSubCat',
        index: true
    }],
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MMaterialCat', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    //-Get all material structure by deep populating sub category and subCat's materials.
    getMaterialStructure: function (data, callback) {
        MMaterialCat.find()
            .deepPopulate('subCat subCat.materials').lean()
            .exec(function (err, found) {
                if (err) {
                    console.log('**** error at getMaterialStructure of MMaterialCat.js ****', err);
                    callback(err, null);
                } else if (_.isEmpty(found)) {
                    callback(null, []);
                } else {
                    callback(null, found);
                }
            });
    },

};
module.exports = _.assign(module.exports, exports, model);