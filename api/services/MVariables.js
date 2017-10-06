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

    // what this function will do ?
    // req data --> ?
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
};
module.exports = _.assign(module.exports, exports, model);