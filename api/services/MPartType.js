var schema = new Schema({
    partTypeName: {
        type: String,
        unique:true
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
    deletePartTypeMaterial: function (data, callback) {
        MPartType.findOneAndUpdate({
            _id: data._id,
        }, {
            $pull: {
                material: data.materialId
            },
        }).exec(function (err, updatedData) {
            if (err) {
                console.log('**** error at deletePartTypeMaterial of MPartType.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(updatedData)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, updatedData);
            }
        });


    },
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
    getPartTypeData: function (data, callback) {
        MPartType.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getPartTypeData of MPartType.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },


};
module.exports = _.assign(module.exports, exports, model);