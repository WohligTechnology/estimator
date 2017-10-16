var schema = new Schema({
    enquiryName: {
        type: String,
        required: true
    },
    enquiryId: {
        type: String, // auto geneatated with suffix
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: true
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
        salesman: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MMaterialCat'
        },
        estimator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MMaterialCat'
        },
        enquiryType: {
            type: String,
            enum: ['firmRfq', 'budgetary', 'verbal', 'other']
        }
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
var model = {};
module.exports = _.assign(module.exports, exports, model);