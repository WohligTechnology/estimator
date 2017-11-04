var schema = new Schema({
    roleName: {
        Type: String
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Role', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getRoleData: function (data, callback) {
        Role.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getRoleData of Role.js ****', err);
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