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
        other: Number,
        scaleFactor: String
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Customer', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    //- retrieve all customer data from customer table.
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

    //-search customer records using customer name with pagination.
    search: function (data, callback) {
        var maxRow = 10;
        if (data.totalRecords) {
            maxRow = data.totalRecords;
        }

        var page = 1;
        if (data.page) {
            page = data.page;
        }
        var field = data.field;
        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: ['customerName'],
                    term: data.keyword
                }
            },
            sort: {
                desc: 'createdAt'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        Customer.find({}).sort({
                createdAt: -1
            })
            .order(options)
            .keyword(options)
            .page(options,
                function (err, found) {
                    if (err) {
                        console.log('**** error at search of Customer.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(found)) {
                        callback(null, 'noDataFound');
                    } else {
                        callback(null, found);
                    }
                });
    },

    //- delete multiple customers by passing multiple customer ids.
    deleteMultipleCustomers: function (data, callback) {
        Customer.remove({
            _id: {
                $in: data.idsArray
            }
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of Customer.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, found);
            }
        });
    },

    //-Get all customer Name and loation and Payment Terms from customer tables.
    getCustomerNameLocationAndPayTerms: function (data, callback) {
        Customer.find().select('customerName location paymentTerms').lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of Customer.js ****', err);
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