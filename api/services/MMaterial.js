var schema = new Schema({
    materialName: {
        type: String,
        required: true
    },
    materialSubCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MMaterialSubCat',
        required: true,
        key: "materials"
    },
    datasheet: {
        type: String
    },
    density: {
        type: Number
    },
    typicalRatePerKg: {
        type: Number
    },
    rollingIndex: {
        type: Number
    },
    bendingIndex: {
        type: Number
    },
    fabrictionIndex: {
        type: Number
    },
    cuttingIndex: {
        type: Number
    },
    type: {
        type: String,
        enum: ["standard", "customBase", "customOverlay"],
        default: "standard"
    },
    estimateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estimate'
    },
    contingencyOrWastage: {
        type: Number
    },
    weightPerUnit: {
        type: Number
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MMaterial', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    // what this function will do ?
    // req data --> ?
    getSubCatMaterials: function (data, callback) {
        var maxRow = Config.maxRow;
        var page = 1;
        if (data.page) {
            page = data.page;
        }
        var field = data.field;
        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: ['name'],
                    term: data.keyword
                }
            },
            sort: {
                desc: 'createdAt'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        MMaterial.find({
                materialSubCategory: data.subCatId
            }).sort({
                createdAt: -1
            })
            .order(options)
            .keyword(options)
            .page(options,
                function (err, found) {
                    if (err) {
                        console.log('**** error at getSubCatMaterials of MMaterial.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(found)) {
                        callback(null, []);
                    } else {
                        callback(null, found);
                    }
                });
    },

    getAllMaterials: function (data, callback) {
        MMaterial.find().exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of MMaterial.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, found);
            }
        });
    },
    // what this function will do ?
    // req data --> ?
    materialAddEdit: function (data, callback) {

    },

    // what this function will do ?
    // req data --> ?
    updateAllSubCatMatType: function (data, callback) {

        MMaterial.update({
            materialSubCategory: data.matSubCatId,
        }, {
            type: data.type
        }, {
            multi: true
        }).exec(function (err, updatedData) {
            if (err) {
                console.log('**** error at updateAllSubCatMatType of MMaterial.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(updatedData)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, updatedData);
            }
        });

    },


};
module.exports = _.assign(module.exports, exports, model);