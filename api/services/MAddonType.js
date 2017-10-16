var schema = new Schema({
    addonTypeName: {
        type:String,
        required:true
    },
    materialCat:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MProcessCat'
    },
    materialSubCat:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MProcessCat'
    },
    rate: {
        mulFact: String,
        uom: String
    },
    quantity:{
        supportingVariable: String,
        linkedKey: String,
        percentageUse: Number,
        percentageExtra: String,
        mulFact: String
    },
    remarks:{
        type:String
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MAddonType', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);