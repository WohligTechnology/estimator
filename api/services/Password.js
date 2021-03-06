var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    key: {
        type: String
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Password', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    findOneByName: function (name, callback) {
        var Model = this;
        Model.findOne({
            "name": name
        }, function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                callback(err, data);
            }
        });
    },

    //-Get all password data from password table.
    getPasswordData: function (data, callback) {
        Password.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getPasswordData of Password.js ****', err);
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