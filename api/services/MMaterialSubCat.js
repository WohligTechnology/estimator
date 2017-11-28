var schema = new Schema({
    materialSubCatName: {
        type: String,
        required: true
    },
    catId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MMaterialCat',
        key: "subCat",
        required: true
    },
    materials: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MMaterial',
    }],
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MMaterialSubCat', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    // what this function will do ?
    // req data --> ?
    getCatsOfSubCat: function (data, callback) {
        MMaterialSubCat.find({
            catId: data.matCatId
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at getMaterialsCats of MMaterialSubCat.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, found);
            }
        });
    },
    getMMaterialSubCatData: function (data, callback) {
        MMaterialSubCat.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getMMaterialSubCatData of MMaterialSubCat.js ****', err);
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