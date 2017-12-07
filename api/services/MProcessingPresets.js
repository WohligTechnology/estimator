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
module.exports = mongoose.model('MProcessingPresets', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    //-Get All MProcessing presets records from MProcessingPresets table.
    getMProcessingPresetsData: function (data, callback) {
        MProcessingPresets.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getMProcessingPresetsData of MProcessingPresets.js ****', err);
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