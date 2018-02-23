var schema = new Schema({
    partTypeName: {
        type: String,
        unique: true
    },
    partTypeCode: {
        type: String
    },
    icon: {
        type: String
    },
    partTypeCat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MPartTypeCat',
        key: "partTypes",
        required: true
    },
    proccessing: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MProcessType',
        index: true
    }],
    addons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MAddonType',
        index: true
    }],
    extras: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MExtra',
        index: true
    }],
    material: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MMaterial',
        index: true
    }],
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MPartType', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'partTypeCat material', 'partTypeCat material'));
var model = {

    //-Find One record of MPart Type and push the material Id to material array.
    addPartTypeMaterial: function (data, callback) {
        MPartType.findOneAndUpdate({
            _id: data._id,
        }, {
            $push: {
                material: data.materialId
            },
        }).exec(function (err, updatedData) {
            if (err) {
                console.log('**** error at addPartTypeMaterial of MPartType.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(updatedData)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, updatedData);
            }
        });
    },

    //-Find One record of MPart Type and push the proccessingId to proccessing array.
    addPartTypeProcessing: function (data, callback) {
        MPartType.findOneAndUpdate({
            _id: data._id
        }, {
            $push: {
                proccessing: data.proccessingId
            },
        }).exec(function (err, updatedData) {
            if (err) {
                console.log('**** error at addPartTypeProcessing of MPartType.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(updatedData)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, updatedData);
            }
        });
    },

    //-Find the single record and push the addon Id to addon array.
    addPartTypeAddons: function (data, callback) {
        MPartType.findOneAndUpdate({
            _id: data._id
        }, {
            $push: {
                addons: data.addonsId
            },
        }).exec(function (err, updatedData) {
            if (err) {
                console.log('**** error at addPartTypeAddons of MPartType.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(updatedData)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, updatedData);
            }
        });
    },

    //-Find the single record and push extrasId to extra array.
    addPartTypeExtras: function (data, callback) {
        MPartType.findOneAndUpdate({
            _id: data._id
        }, {
            $push: {
                extras: data.extrasId
            },
        }).exec(function (err, updatedData) {
            if (err) {
                console.log('**** error at addPartTypeExtras of MPartType.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(updatedData)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, updatedData);
            }
        });
    },

    //-Find single record from MPartType table and remove the material Id from material array.
    deletePartTypeMaterial: function (data, callback) {
        MPartType.findOne({
            _id: data._id,
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at deletePartTypeMaterial of MPartType.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                EstimatePart.findOne({
                    material:  data.material
                }).exec(function (err, found1) {
                    console.log('**** found1 found1 ****',found1);
                    if (err) {
                        console.log('**** error at function_name of MPartType.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(found1)) {
                        MPartType.findOneAndUpdate({
                            _id: data._id,
                        }, {
                            $pull: {
                                material: data.material
                            },
                        }).exec(function (err, updatedData) {
                            if (err) {
                                console.log('**** error at function_name of MPartType.js ****', err);
                                callback(err, null);
                            } else if (_.isEmpty(updatedData)) {
                                callback(null, 'noDataFound');
                            } else {
                                callback(null, 'Records Are Updated');
                            }
                        });
                    } else {
                        callback(null, 'Dependency of Table Estimate Part');
                    }
                });
            }
        });


    },

    //-Find single record from MPartType table and remove the proccessingId from proccessing array.
    deleteProcessingPartType: function (data, callback) {
        MPartType.findOneAndUpdate({
            _id: data._id
        }, {
            $pull: {
                proccessing: data.proccessingId
            },
        }).exec(function (err, updatedData) {
            if (err) {
                console.log('**** error at deleteProcessingPartType of MPartType.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(updatedData)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, updatedData);
            }
        });

    },

    //-Find single record from MPartType table and remove the addonsId from addons array.
    deleteAddonsPartType: function (data, callback) {
        MPartType.findOneAndUpdate({
            _id: data._id
        }, {
            $pull: {
                addons: data.addonsId
            },
        }).exec(function (err, updatedData) {
            if (err) {
                console.log('**** error at deleteAddonsPartType of MPartType.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(updatedData)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, updatedData);
            }
        });

    },

    //-Find single record from MPartType table and remove the extrasId from extras array.
    deleteExtrasPartType: function (data, callback) {
        MPartType.findOneAndUpdate({
            _id: data._id
        }, {
            $pull: {
                extras: data.extrasId
            },
        }).exec(function (err, updatedData) {
            if (err) {
                console.log('**** error at deleteExtrasPartType of MPartType.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(updatedData)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, updatedData);
            }
        });

    },

    //-Get all records from Mpart type table.
    getPartTypeData: function (data, callback) {
        MPartType.find().lean().deepPopulate('material').exec(function (err, found) {
            if (err) {
                console.log('**** error at getPartTypeData of MPartType.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    }
};
module.exports = _.assign(module.exports, exports, model);