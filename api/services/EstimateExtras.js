var schema = new Schema({
    extraLevel: {
        type: String,
        enum: ['estimate', 'subAssembly', 'part'],
        default: 'estimate'
    },
    extraLevelId: {
        type: String,
        required: true
    },
    extraNumber: {
        type: String,
        unique: true,
        required: true
    },
    extraItem: {
        type: Schema.Types.ObjectId,
        ref: "MExtra",
        index: true,
    },
    quantity: Number,
    totalCost: Number,
    remarks: String,

    extraObj: {}
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('EstimateExtras', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    importExtra: function (data, callback) {
        data.lastExtraNumber = data.lastExtraNumber.replace(/\d+$/, function (n) {
            return ++n
        });

        EstimateExtras.findOne({
            extraNumber: data.extraNumber
        }).lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of EstimateExtras.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                var lastExtraNumber = found.extraNumber;
                found.extraNumber = data.lastExtraNumber;
                Estimate.removeUnwantedField(found, function (finalData) {
                    callback(null, finalData);

                })
            }
        });
    },
    getEstimateExtraData: function (data, callback) {
        EstimateExtras.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getEstimateExtraData of EstimateExtras.js ****', err);
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