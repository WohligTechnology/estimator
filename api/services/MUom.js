var schema = new Schema({
    uomName: {
        type: String,
        required: true
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MUom', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getMUomData: function (data, callback) {
        MUom.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getMUomData of MUom.js ****', err);
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