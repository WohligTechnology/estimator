var schema = new Schema({
    addonsLevel: {
        type: String,
        enum: ['estimate', 'subAssembly', 'part'],
        default: 'estimate'
    },
    addonsLevelId: {
        type: String,
        required: true
    },
    addonNumber: {
        type: String,
        required: true
    },


    addonType: {
        type: Schema.Types.ObjectId,
        ref: "MAddonType",
        index: true,
    },
    addonItem: {
        type: Schema.Types.ObjectId,
        ref: "MMaterial",
        index: true,
    },
    rate: Number,
    quantity: {
        supportingVariable: {
            supportingVariable: String,
            value: Number
        },
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
    addonObj: {},
    estimateVersion: {
        type: String,
    },

});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('EstimateAddons', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    getVersionsOfAddonsNo: function (data, callback) {
        EstimateAddons.aggregate(
            [{
                $group: {
                    _id: '$addonsNumber',
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
                    partNumber: "",
                    versionDetail: []
                };
                async.eachSeries(found, function (n, callback) {
                    temp.push({
                        addonsNumber    : n._id,
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


    //- import addon by passing addon number and get the last to last addon number no. by giving addon number.
    importAddon: function (data, callback) {
        data.lastAddonNumber = data.lastAddonNumber.replace(/\d+$/, function (n) {
            return ++n
        });

        EstimateAddons.findOne({
            _id: data._id
        }).lean().exec(function (err, found) {

            if (err) {
                console.log('**** error at importAddon of EstimateAddons.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                var lastAddonNumber = data.lastAddonNumber;
                found.addonNumber = lastAddonNumber;
                Estimate.removeUnwantedField(found, function (finalData) {
                    callback(null, finalData);
                });
            }
        });
    },

    //-retrieve all estimate addon records from estimae addon table.
    getEstimateAddonsData: function (data, callback) {
        EstimateAddons.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getEstimateAddonsData of EstimateAddons.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    //-get all estimate addons no. only from Estimate addon table.
    getAllAddonsNo: function (data, callback) {
        EstimateAddons.find({}, {
            addonNumber: 1
        }).lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of EstimateAddons.js ****', err);
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