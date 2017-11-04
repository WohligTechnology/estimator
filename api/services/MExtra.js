var schema = new Schema({
    extraName: String,
    rate: {
        name: String,
        uom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MUom',
            required: true
        }
    }
});

schema.plugin(deepPopulate, {
    Populate: {
        'rate.uom': {
            select: ''
        },
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MExtra', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "rate.uom"));
var model = {
    getMExtraData: function (data, callback) {
        MExtra.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getMExtraData of MExtra.js ****', err);
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