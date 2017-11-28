var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    formula: {
        type: String,
        required: true
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MFormulae', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    // what this function will do ?
    // req data --> ?
    getMFormulaData: function (data, callback) {
        MFormulae.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getMFormulaData of MFormulae.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null,[]);
            } else {
                callback(null, found);
            }
        });
    },
};
module.exports = _.assign(module.exports, exports, model);