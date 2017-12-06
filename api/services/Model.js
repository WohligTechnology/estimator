/**
 * Model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Model', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {


  // what this function will do ?
  // req data --> ?
  createModel: function (data, callback) {
    Model.create({
      name: data.name
    }).exec(function (err, found) {
      if (err) {
        console.log('**** error at function_name of Model.js ****', err);
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