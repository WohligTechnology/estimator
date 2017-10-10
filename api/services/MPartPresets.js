var schema = new Schema({
    presetName: {      // preset name will be used in dropdown at add Part To Estimate 
        type: String,
        required:true,
        unique:true
    },
    presetId:{         // manual unique ID for preset because mongo will create a different _id for each document
        type:String,   // So, we will not able to identify same presets with different sizes 
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
        type: String,   // sizes will be used in the dropdown of sizes field 
        required:true,  // when we select partType name at-->add Part To Estimate
        unique:true
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