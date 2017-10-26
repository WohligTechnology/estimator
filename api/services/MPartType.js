var schema = new Schema({
    partTypeName: {
        type: String
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

    addMaterialToPartType: function (data, callback) {
        MPartType.findOneAndUpdate({
            _id: data._id,
        }, {
            $push: {
                material: data.materialId
            },
        }).exec(function (err, updatedData) {
            if (err) {
                console.log('**** error at function_name of MPartType.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(updatedData)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, updatedData);
            }
        });

    },
};
module.exports = _.assign(module.exports, exports, model);