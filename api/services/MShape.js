var schema = new Schema({
    shapeName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["2d", "3d"],
        default: "2d"
    },
    icon: {
        file: String,
        default: ""
    },
    image: {
        file: String,
        default: ""
    },
    variable: [{
        varName: String
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
        weight: String,
    },
    namingConvenstion: {
        type: String
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MShape', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'variable', 'variable'));
var model = {

    //-Get all MShape data from MShape table.
    getMShapeData: function (data, callback) {
        MShape.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getMShapeData of MShape.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },
    //- check the data dependency of MShape record and disable it from frontend accordingly.
    delRestrictionsMultiDeletionMShape: function (data, callback) {
        allDependency = [];
        async.eachSeries(data.idsArray, function (ids, callback) {
                MPartPresets.findOne({
                    shape: ids
                }).select('_id').lean().exec(function (err, found) {
                    if (err) {
                        console.log('**** error at delRestrictions ****', err);
                        callback(err,null);
                    } else if (found == null) {
                         callback (null,[]);
                    } else {
                        allDependency.push({
                            model: 'MPartPresets',
                            fieldName: 'shape',
                        });

                        callback();
                    }
                });
            },
            function (err) {
                if (err) {
                    console.log('***** error at final response of async.eachSeries in function_name of MMaterial.js*****', err);
                } else {
                    callback(null, allDependency);
                }
            });
    },
};
module.exports = _.assign(module.exports, exports, model);