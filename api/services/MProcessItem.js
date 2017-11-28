var schema = new Schema({
    processItemName: {
        type: String
    },
    processCat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MProcessCat',
        required: true,
        key: "processItems"
    },
    rate: Number
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MProcessItem', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getMProcessItemData: function (data, callback) {
        MProcessItem.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getMProcessItemData of MProcessItem.js ****', err);
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