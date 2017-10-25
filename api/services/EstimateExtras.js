var schema = new Schema({
    processingLevel: {
        type: String,
        enum: ['estimate', 'subAssembly', 'part'],
        default: 'estimate'
    },
    processingLevelId: {
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
    remarks: String
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('EstimateExtras', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    // what this function will do ?
    // req data --> ?
    importExtra: function (data, callback) {
        EstimateExtras.find(
            {
                extraNumber:data.extraNumber
            }
        ).exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of EstimateExtras.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, found);
            }
        });
    },
};
module.exports = _.assign(module.exports, exports, model);