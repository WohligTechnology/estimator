var schema = new Schema({
    presetName: {
        type: String,
        required:true
    },
    shape: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MShape'
    },
    partType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MPartType'
    },
    sizes: {
        type: String
    },
    variable: [{
        type: String
    }],
    proccessing: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MProcessType'
    }],
    addons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MAddonType'
    }],
    extras: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MExtra'
    }],
    material: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MMaterial'
    }],
    partFormulae: {
        perimeter: String,
        sheetMetalArea: String,
        surfaceArea: String,
        weight: String
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MPartPresets', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);