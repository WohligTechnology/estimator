var schema = new Schema({
    processCatName: {
        type: String,
        required: true
    },
    uom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MUom',
        required: true,
    },
    processItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MProcessItem'
    }]
});

schema.plugin(deepPopulate, {
    populate: {
        'processItems': {
            select: "processItemName rate"
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MProcessCat', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'processItems uom', 'processItems uom'));
var model = {
    getMProcessCatData: function (data, callback) {
        MProcessCat.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getMProcessCatData of MProcessCat.js ****', err);
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