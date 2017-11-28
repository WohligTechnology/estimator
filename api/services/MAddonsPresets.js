var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        excel: {
            name: "Name"
        }
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MAddonsPresets', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getMAddonsPresetsData: function (data, callback) {
        MAddonsPresets.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getMAddonsPresetsData of MAddonsPresets.js ****', err);
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