var schema = new Schema({
    variableName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MVariables', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    getAllVarId: function (data, callback) {

        MVariables.find().select('_id variableName').lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of MVariables.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                // var varArray = [];
                // _.map(found, function(n){
                //     varArray.push(n._id);
                // });
                callback(null, found);
            }
        });

    },

    //-Get all Mvariable data from MVarible table.
    getMVariableData: function (data, callback) {
        MVariables.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getMVariableData of MVariables.js ****', err);
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