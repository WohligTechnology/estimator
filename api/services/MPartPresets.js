var schema = new Schema({
    presetName: { // preset name will be used in dropdown at add Part To Estimate 
        type: String,
        required: true,
        unique: true
    },
    presetId: { // manual unique ID for preset because mongo will create a different _id for each document
        type: String, // So, we will not able to identify same presets with different sizes 
        required: true
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
        type: String, // sizes will be used in the dropdown of sizes field 
        required: true, // when we select partType name at-->add Part To Estimate
        unique: true
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
        ref: 'MMaterial',
        unique:true
    }],
    partFormulae: {
        perimeter: String,
        sheetMetalArea: String,
        surfaceArea: String,
        weight: String
    }
});

schema.plugin(deepPopulate, {
    populate: {
        material: {
            select: "_id materialSubCategory materialName"
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MPartPresets', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    getPresetSizes: function (data, callback) {
        MPartPresets.find({
            presetId: data.presetId
        }, {
            "sizes": 1
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at MPartPresets of MPartPresets.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, found);
            }
        });
    },

    getPresetMaterials: function (data, callback) {
        MPartPresets.find({
                _id: data._id
            }).deepPopulate('material')
            .select("material")
            .exec(function (err, found) {
                if (err) {
                    console.log('**** error at function_name of MPartPresets.js ****', err);
                    callback(err, null);
                } else if (_.isEmpty(found)) {
                    callback(null, 'noDataFound');
                } else {
                    callback(null, found);
                }
            });
    },

    //- to push materal id in material array
    //- req --> _id (i.e. presets --> _id), materialId
    addMaterial: function (data, callback) {
        MPartPresets.findOneAndUpdate({
            _id:data.id
        }, {
            // to push multiple objects in an arrayOfObjects_name
            $addToSet: {
                material: data.materialId
            },
        }).exec(function (err, updatedData) {
            if (err) {
                console.log('**** error at addMaterial of MPartPresets.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(updatedData)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, updatedData);
            }
        });
    },

    //- to delete materials from material array 
    updateMaterial: function (data, callback) {

    },



};
module.exports = _.assign(module.exports, exports, model);