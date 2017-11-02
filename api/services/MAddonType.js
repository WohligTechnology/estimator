var schema = new Schema({
    addonTypeName: {
        type: String,
        required: true
    },
    materialCat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MMaterialCat'
    },
    materialSubCat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MMaterialSubCat'
    },
    rate: {
        mulFact: String,
        uom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MUom',
            required: true
        }
    },
    quantity: {
        additionalInput: String, // additional input
        additionalInputUom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MUom',
            required: true
        },
        linkedKey: String,
        linkedKeyUom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MUom',
            required: true
        },
        mulFact: String,
        percentageUse: Number,
        finalUom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MUom',
            required: true
        }

    },
    remarks: {
        type: String
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MAddonType', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'materialCat materialCat.subCat materialSubCat rate.uom quantity.additionalInputUom quantity.linkedKeyUom quantity.finalUom', 'materialCat materialCat.subCat materialSubCat rate.uom quantity.additionalInputUom quantity.linkedKeyUom quantity.finalUom'));
var model = {
    // what this function will do ?
    // req data --> ?
    getAddonMaterial: function (data, callback) {
        MAddonType.findOne({
            _id: data._id
        }).lean().exec(function (err, myData) {
            if (err) {
                console.log('**** error at getAddonMaterial of MAddonType.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(myData)) {
                callback(null, []);
            } else {
                MMaterialSubCat.findOne(
                    {
                        _id:myData.materialSubCat
                    }
                ).populate('materials').select ('materials').exec(function (err, finalResult) {
                    if (err) {
                        console.log('**** error at function_name of MAddonType.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(finalResult)) {
                        callback(null, []);
                    } else {
                        callback(null, finalResult);
                    }
                });
            }

        });
    },

};
module.exports = _.assign(module.exports, exports, model);