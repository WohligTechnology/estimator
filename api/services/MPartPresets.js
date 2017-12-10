var schema = new Schema({
    presetName: { // preset name will be used in dropdown at add Part To Estimate 
        type: String,
        required: true,
        unique: true
    },
    presetId: { // manual unique ID for preset because mongo will create a different _id for each document
        type: String // So, we will not able to identify same presets with different sizes 
    },
    shape: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MShape',
        index: true
    },
    partType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MPartType',
        index: true
    },
    size: {
        type: String, // sizes will be used in the dropdown of sizes field
        required: true // when we select partType name at-->add Part To Estimate
    },
    variable: [{
        varName: String,
        varValue: Number
    }],
    sizeFactor: {
        type: String
    },
    formFactor: {
        type: String
    },
    thickness: {
        type: String
    },
    length: {
        type: String
    },
    wastage: {
        type: String
    },
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
        },
        shape:{
            select: ""
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MPartPresets', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'shape partType', 'shape partType'));
var model = {

    //-Get All Part Types and Shapes by passing partTypeId from MPartPresets table.
    getPresetSizes: function (data, callback) {
        MPartPresets.find({
            partType: data.partType
        }).populate('partType shape').lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at MPartPresets of MPartPresets.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    getPresetMaterials: function (data, callback) {
        MPartPresets.findOne({
                _id: data._id
            }).deepPopulate('material')
            .select("material")
            .exec(function (err, found) {
                if (err) {
                    console.log('**** error at function_name of MPartPresets.js ****', err);
                    callback(err, null);
                } else if (_.isEmpty(found)) {
                    callback(null, []);
                } else {
                    callback(null, found);
                }
            });
    },

    //- to push materal id in material array
    //- req --> _id (i.e. presets --> _id), materialId
    addMaterial: function (data, callback) {
        MPartPresets.findOneAndUpdate({
            _id: data.id
        }, {
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

    //-to delete materials from material array 
    updateMaterial: function (data, callback) {

    },

    //-Get all part presets records from MPartPresets table
    getMPartPresetData: function (data, callback) {
        MPartPresets.find().deepPopulate('shape partType partType.material').lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of MPartPresets.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    getPresetsShapeAndPartType: function (data, callback) {
        MPartPresets.find({
            presetName: data.presetName
        }).deepPopulate('shape partType partType.material').lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of MPartPresets.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    //- retrieve all MPartPresets Records
    //- req data --> _id or mPartType_id and sizes
    getAllPartPresetsData: function (data, callback) {
        MPartPresets.findOne({
            _id: data._id
        }).deepPopulate('shape partType partType.material').lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of MPartPresets.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                MPartPresets.findOne({
                    partType: data.partType,
                    size: data.size
                }).deepPopulate('shape partType partType.material').lean().exec(function (err, found) {
                    if (err) {
                        console.log('**** error at function_name of MPartPresets.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(found)) {
                        callback(null, []);
                    } else {
                        callback(null, found);
                    }
                });
            } else {
                callback(null, found);
            }
        });
    }

};
module.exports = _.assign(module.exports, exports, model);