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
    processingNumber: {
        type: String,
        unique: true,
        required: true
    },
    processType: {
        type: Schema.Types.ObjectId,
        ref: "MProcessType",
        index: true,
    },
    processItem: {
        type: Schema.Types.ObjectId,
        ref: "MProcessItem",
        index: true,
    },
    rate: Number,
    quantity: {
        keyValue: {
            keyVariable: String,
            keyValue: String
        },
        utilization: Number,
        contengncyOrWastage: Number,
        total: Number
    },
    totalCost: Number,
    remarks: String,

    processingObj: {},
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('EstimateProcessing', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    importProcessing: function (data, callback) {
        data.lastProcessingNumber = data.lastProcessingNumber.replace(/\d+$/, function (n) {
            return ++n
        });

        EstimateProcessing.findOne({
            processingNumber: data.processingNumber
        }).lean().exec(function (err, found) {

            if (err) {
                console.log('**** error at importProcessing of EstimateProcessing.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                var lastProcessingNumber = data.lastProcessingNumber;
                found.processingNumber = lastProcessingNumber;
                Estimate.removeUnwantedField(found, function (finalData) {
                    console.log('**** inside function_name of EstimateProcessing.js ****');
                    callback(null, finalData);
                });
            }
        });
    },
    getEstimateProcessingData: function (data, callback) {
        EstimateProcessing.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getEstimateProcessingData of EstimateProcessing.js ****', err);
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