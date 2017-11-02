var schema = new Schema({
    processCatName: {
        type: String,
        required: true
    },
    uom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MUom',
        required: true,
    },
    processItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MProcessItem'
    }]
});

schema.plugin(deepPopulate, {
    populate:{
        'processItems':{
            select:"processItemName rate"
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MProcessCat', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'processItems uom', 'processItems uom'));
var model = {};
module.exports = _.assign(module.exports, exports, model);