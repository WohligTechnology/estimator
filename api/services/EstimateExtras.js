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

    extraObj: {},
    estimateVersion: {
        type: String,
    },
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('EstimateExtras', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getVersionsOfExtrassNo: function (data, callback) {
        EstimateExtras.aggregate(
            [{
                $group: {
                    _id: '$extraNumber',
                    versionDetail: {
                        $push: {
                            versionNumber: "$estimateVersion",
                            _id: "$_id"
                        }
                    }
                },
            }]
        ).exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of Estimate.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                var temp = [];
                var tempObj = {
                    extraNumber: "",
                    versionDetail: []
                };
                async.eachSeries(found, function (n, callback) {
                    temp.push({
                        extraNumber: n._id,
                        versionDetail: n.versionDetail
                    });
                    callback();

                }, function (err) {
                    if (err) {
                        console.log('***** error at final response of async.eachSeries in function_name of Estimate.js*****', err);
                    } else {
                        callback(null, temp);
                    }
                });
            }
        });
    },


    importExtra: function (data, callback) {
        data.lastExtraNumber = data.lastExtraNumber.replace(/\d+$/, function (n) {
            return ++n
        });

        EstimateExtras.findOne({
            _id: data._id
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

    //-get all estimate extra records from estimate extra table.
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


    //-get all extra nos only from Estimate extra table.
    getAllExtrasNo: function (data, callback) {
        EstimateExtras.find({}, {
            extraNumber: 1
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of EstimateExtras.js ****', err);
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