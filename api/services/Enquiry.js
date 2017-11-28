var schema = new Schema({
    enquiryName: {
        type: String,
        // required: true
    },
    enquiryId: {
        type: Number, // auto geneatated with suffix
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        //required: true
    },
    enquiryDetails: {
        enquiryStatus: {
            type: String,
            enum: ['open', 'close', 'hold'],
            default: "open"
        },
        // customerName:String                 // get it from customer collection
        // customerLocation:String             // get it from customer collection

        currency: {
            type: String // here will the currency table Id/string after integrating google API 
        },
        deliveryLocation: {
            type: String
        },
        deliveryDistance: {
            type: Number
        },
        project: {
            type: String
        },
        applicationCategory: {
            type: String,
            enum: ['extraction', 'crushing', 'grinding', 'mixing', 'screening', 'agglomeration', 'transport']
        },
        oemEquipmentName: {
            type: String
        },
        rfqDescription: {
            type: String
        },
        rfqNo: {
            type: String
        },
        rfqReceiveddDate: {
            type: Date
        },
        rfqDueDate: {
            type: Date
        },
        customerContacts: {
            type: String
        },
        // salesman: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'MMaterialCat'
        // },
        // estimator: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'MMaterialCat'
        // },
        // enquiryType: {
        //     type: String,
        //     enum: ['firmRfq', 'budgetary', 'verbal', 'other']
        // }
    },
    enquiryInfo: {
        rfqCopy: [{
            file: String
        }],
        drawings: [{
            file: String
        }],
        photos: [{
            file: String
        }],
        otherDocs: [{
            file: String
        }],
        technicalFeedback: {
            type: String
        },
        commercialFeedback: {
            type: String
        },
        remarks: {
            type: String
        }
    },
    keyRequirement: {
        ndaAgreement: [{
            file: String
        }],
    },
    technicalRequirement: {
        design: String,
        fabrication: String,
        preparation: String,
        siteServices: String
    },
    commercialRequirement: {
        warrantyRequired: String,
        // paymentTerms:String,     // get it from customer collection
        retentionTerms: String,
        ldOrPenalties: String,
        securityDeposit: String,
        emd: String,
        other1: String,
        other2: String,
        other3: String
    },
    preQualificationCriteria: {
        detail: String,
        paintSpecs: String,
        freight: String,
        other1: String,
        other2: String,
        other3: String
    },

});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Enquiry', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    totalHoldsEnquiries: function (data, callback) {
        Enquiry.find({
            enquiryDetails: {
                enquiryStatus: "hold"
            }
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of Enquiry.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                found = found.length;
                callback(null, found);
            }
        });
    },

    totalOpenEnuieries: function (data, callback) {
        Enquiry.find({
            enquiryDetails: {
                enquiryStatus: "open"
            }
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of Enquiry.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                found = found.length;
                callback(null, found);
            }
        });

    },

    totalCloseEnquiries: function (data, callback) {
        Enquiry.find({
            enquiryDetails: {
                enquiryStatus: "close"
            }
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of Enquiry.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                found = found.length;
                callback(null, found);
            }
        });

    },

    getStatusCount: function (data, callback) {
        Enquiry.find({
            enquiryDetails: {
                enquiryStatus: data.status
            }

        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at getStatusCount of Enquiry.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                found = found.length;
                callback(null, found);
            }
        });
    },

    getStatusCountInBulk: function (data, callback) {
        Enquiry.find({}).exec(function (err, found) {
            if (err) {
                console.log('**** error at getStatusCountInBulk of Enquiry.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                found = _.countBy(found, 'enquiryDetails.enquiryStatus');
                callback(null, found);
            }
        });
    },

    createEnquiry: function (data, callback) {

        Enquiry.findOne().sort({
            createdAt: -1
        }).exec(function (err, found) {
            console.log('**** inside function_name of Enquiry.js ****', found);
            if (err) {
                console.log('**** error at function_name of Enquiry.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                data.enquiryId = 1;
            } else {
                data.enquiryId = found.enquiryId + 1;
            }

            console.log('**** inside &&&&&&&&&&&&& of Enquiry.js ****', data);


            Enquiry.saveData(data, function (err, savedData) {
                if (err) {
                    console.log('**** error at function_name of Enquiry.js ****', err);
                    callback(err, null);
                } else if (_.isEmpty(savedData)) {
                    callback(null, 'noDataFound');
                } else {
                    callback(null, savedData);
                }
            });
        });
    },

    getEnquiryData: function (data, callback) {
        Enquiry.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getEnquiryData of Enquiry.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

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
                    fields: ['enquiryName'],
                    term: data.keyword
                }
            },
            sort: {
                desc: 'createdAt'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        Enquiry.find({}).sort({
                createdAt: -1
            })
            .order(options)
            .keyword(options)
            .page(options,
                function (err, found) {
                    if (err) {
                        console.log('**** error at search of Enquiry.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(found)) {
                        callback(null, 'noDataFound');
                    } else {
                        callback(null, found);
                    }
                });
    },

    getEstimateVersionData: function (data, callback) {
        Enquiry.findOne({
            _id: data._id
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of Enquiry.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                Estimate.find({
                    enquiryId: found._id
                }, {
                    assemblyObj: 0
                }).exec(function (err, found) {
                    if (err) {
                        console.log('**** error at function_name of Enquiry.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(found)) {
                        callback(null, []);
                    } else {
                        callback(null, found);
                    }
                });
            }
        });
    },
    deleteMultipleEnquiry: function (data, callback) {
        Enquiry.remove({
            _id: {
                $in: data.idsArray
            }
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at deleteMultipleEnquiry of Enquiry.js ****', err);
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