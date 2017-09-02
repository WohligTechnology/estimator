var schema = new Schema({
    processCatName:{
        type:String,
        required:true
    },
    uom:{
        type:String
    },
    processItems:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MProcessItem'
    }]
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MProcessCat', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);