var schema = new Schema({
    partTypeCatName: {
        type: String
    },
    partTypes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MPartType',
        index: true
    }]

});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MPartTypeCat', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'partTypes', 'partTypes'));
var model = {

    //-Get All Master Part Type Cat. records from MPartTypeCat table. 
    getMPartTypeCatData: function (data, callback) {
        MPartTypeCat.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getMPartTypeCatData of MPartTypeCat.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },
    // what this function will do ?
    // req data --> ?
    delRestrictionOfMPartTypeCat: function (data, callback) {
        MPartTypeCat.find({
            partTypes: data.partTypes
        }).exec(function (err, found) {
            console.log('**** found found ****', found);
            if (err) {
                console.log('**** error at function_name of MPartTypeCat.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, found);
            }
        });
    },
};
module.exports = _.assign(module.exports, exports, model);