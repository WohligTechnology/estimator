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

var exports = _.cloneDeep(require("sails-wohlig-service")(schema,'materialCat materialCat.subCat materialSubCat rate.uom quantity.additionalInputUom quantity.linkedKeyUom quantity.finalUom','materialCat materialCat.subCat materialSubCat rate.uom quantity.additionalInputUom quantity.linkedKeyUom quantity.finalUom'));
var model = {};
module.exports = _.assign(module.exports, exports, model);