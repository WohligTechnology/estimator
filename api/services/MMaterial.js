var schema = new Schema({
    materialName: {
        type: String,
        required:true
    },
    materialSubCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MMaterialSubCat',
        required: true,
        key: "materials"
    },
    datasheet:{
        type:String
    },
    density:{
        type: Number
    },
    typicalRatePerKg:{
        type: Number
    },
    rollingIndex:{
        type: Number
    },
    bendingIndex:{
        type: Number
    },
    fabrictionIndex:{
        type: Number
    },
    cuttingIndex:{
        type: Number
    },
    type: {
        type: String,
        enum: ["standard", "customBase","customOverlay"],
        default: "standard"
    },
    estimateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estimate'
    },
    contingencyOrWastage:{
        type:Number
    },
    weightPerUnit:{
        type:Number
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MMaterial', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);