var schema = new Schema({
    customerName: {
        type: String,
        required: true
    },
    location: String,
    paymentTerms: String,
    margins: {
        negotiation: Number,
        commission: Number,
        other: Number
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Customer', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getCustomerData: function (data, callback) {
        Customer.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getCustomerData of Customer.js ****', err);
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