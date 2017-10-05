var schema = new Schema({
    processTypeName: {
        type:String, 
        required:true
    },
    processCat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MProcessCat',
        required: true,
    },
    rate: {
        mulFact: String,
        uom: String
    },
    quantity: {
        linkedKeyValue: String,
        uom: String,
        mulfact: String,
        finalUom: String,
        utilization: Number,
        contengncyOrWastage: Number
    }
});

schema.plugin(deepPopulate, {
    'Populate':{}
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MProcessType', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema,"processCat","processCat"));
var model = {};


module.exports = _.assign(module.exports, exports, model);