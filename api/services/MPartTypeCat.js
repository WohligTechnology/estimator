var schema = new Schema({
    partTypeCatName:{
        type:String
    },
    partTypes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MPartType',
        index: true
    }]

});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MPartTypeCat', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema,'partTypes','partTypes'));
var model = {};
module.exports = _.assign(module.exports, exports, model);