var schema = new Schema({
    role_id:{
        type:String,
        required:true
    },
    accessLevel:[{
        module:"String",
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean
    }]
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('AccessLevel', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);