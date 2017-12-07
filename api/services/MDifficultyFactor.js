var schema = new Schema({
    difficultyFactor: String,
    mulfact: String
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MDifficultyFactor', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    //-Get all MDifficultyFactor records from MDifficulty Factor table.
    getMDifficultyFactorData: function (data, callback) {
        MDifficultyFactor.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getMDifficultyFactorData of MDifficultyFactor.js ****', err);
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