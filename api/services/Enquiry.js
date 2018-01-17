var schema = new Schema({
    enquiryName: {
        type: String,
        // required: true
    },
    enquiryId: {
        //type: Number, // auto geneatated with suffix
        //required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
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
        customerName: {
            type: String
        },
        customerLocation: {
            type: String
        },

        // salesman: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'MMaterialCat'
        // },
        estimator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        enquiryType: {
            type: String,
            enum: ['firmRfq', 'budgetary', 'verbal', 'other']
        }
    },
    enquiryInfo: {
        rfqCopy: [{
            type: String
        }],
        drawings: [{
            type: String
        }],
        photos: [{
            type: String
        }],
        otherDocs: [{
            type: String
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
            type: String
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
        paymentTerms: String, // get it from customer collection
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

schema.plugin(deepPopulate, {
    populate: {
        'customerId': {
            select: 'customerName location paymentTerms _id'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Enquiry', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'customerId', 'customerId'));
var model = {

    //-retrieve count of  hold enquiries from enquiry table on the basis of enquiry status as "hold".
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

    //-retrieve count of open enquiries from enquiry table on the basis of enquiry status as "open".
    totalOpenEnquiries: function (data, callback) {
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

    //-retrieve total count of closed enquiries from enquiry table on the basis of enquiry status as "close".
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

    //-retrieve total enquiry status count from enquiry table on the basis of enquiry status.
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

    //-retrieve total enquiry status count for all status at same time in bulk from enquiry table.
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

    //-create the new enquiry by admin 
    createEnquiry: function (data, callback) {
        Enquiry.findOne().sort({
            createdAt: -1
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of Enquiry.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                data.enquiryId = 1;
            } else {
                data.enquiryId = found.enquiryId + 1;
            }
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

    //-retrieve total enquiry records from enqury table.
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

    //- search the records by passing enquiry name with pagination.
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
            }).lean()
            .order(options)
            .keyword(options)
            .page(options,
                function (err, found) {
                    console.log('****@@@@@@@@@@ ****', found.results);
                    if (err) {
                        console.log('**** error at search of Enquiry.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(found)) {
                        callback(null, []);
                    } else {
                        var index = 0;
                        async.eachSeries(found.results, function (enquiryObj, callback) {
                                UserId = enquiryObj.enquiryDetails.estimator
                                User.find({
                                    _id: enquiryObj.enquiryDetails.estimator
                                }).lean().select('name').exec(function (err, foundEnquiryDetailsEstimator) {
                                    if (err) {
                                        console.log('**** error at rate uom of MProcessType.js ****', err);
                                    } else {
                                        found.results[index].enquiryDetails.estimator = foundEnquiryDetailsEstimator;
                                        index++;
                                        callback();
                                    }
                                });
                            },
                            function (err) {
                                if (err) {
                                    console.log('***** error at final response of async.eachSeries in function_name of MProcessType.js*****', err);
                                } else {
                                    callback(null, found);
                                }
                            });
                    }
                });
    },

    //-get estimate version data by passing enquiry id.
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

    //-delete multiple enquiries from enquiry table by passing multiple enquiry ids.
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

    // what this function will do ?
    // req data --> ?
    getOne: function (data, callback) {
        console.log('**** inside &&&&&&&&&&&&&&&&&& of Enquiry.js ****', data);
        Enquiry.findOne({
            _id: data._id
        }).populate('customerId').exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of Enquiry.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, {});
            } else {

                User.findOne({
                    _id: found.enquiryDetails.estimator
                }).exec(function (err, getOneUser) {
                    if (err) {
                        console.log('**** error at function_name of Enquiry.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(getOneUser)) {
                        callback(null, {});
                    } else {
                        found.enquiryDetails.estimator = getOneUser;
                        callback(null, found);
                    }
                });

                // callback(null, found);
            }
        });

    },

    // what this function will do ?
    // req data --> ?
    getAllEnquiryUsers: function (data, callback) {
        Enquiry.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of Enquiry.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                var index = 0;
                async.eachSeries(found, function (enquiryObj, callback) {
                        User.find({
                            _id: enquiryObj.enquiryDetails.estimator
                        }).lean().select('name').exec(function (err, foundEnquiryDetailsEstimator) {
                            if (err) {
                                console.log('**** error at rate uom of MProcessType.js ****', err);
                            } else {
                                found[index].enquiryDetails.estimator = foundEnquiryDetailsEstimator;
                                index++;
                                callback();
                            }
                        });

                    },
                    function (err) {
                        if (err) {
                            console.log('***** error at final response of async.eachSeries in function_name of MProcessType.js*****', err);
                        } else {
                            callback(null, found);
                        }
                    });
            }
        });
    },
};
module.exports = _.assign(module.exports, exports, model);