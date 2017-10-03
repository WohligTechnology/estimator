// estimate collection schema
var schema = new Schema({
    enquiryId: {
        type: Schema.Types.ObjectId,
        ref: "Enquiry",
        index: true,
    },
    assemblyName: {
        type: String,
        required: true
    },
    assemplyNumber: { //  start with a + X where X is increasing numbers
        type: String
    },
    keyValueCalculations: {
        perimeter: Number,
        sheetMetalArea: Number,
        surfaceArea: Number,
        weight: Number,
        numbers: Number,
        hours: Number
    },
    totalWeight: Number,
    materialCost: Number,
    processingCost: Number,
    addonCost: Number,
    extrasCost: Number,
    totalCost: Number,
    estimateId: { // it is a common & unique field to backup estimate document
        type: String,
        unique: true
    },
    estimateCreatedUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    estimateUpdatedUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    estimateDetails: {}, // not defined yet
    estimateBoq: {},
    estimateAttachment: [{
        file: String
    }],

    subAssemblies: [{
        subAssemblyName: String,
        subAssemblyNumber: { //  a1sX where a1 --> assembly name, sX --> X is auto increasing number
            type: String
        },
        quantity: Number,
        totalValue: Number,
        keyValueCalculations: {
            perimeter: Number,
            sheetMetalArea: Number,
            surfaceArea: Number,
            weight: Number,
            numbers: Number,
            hours: Number
        },

        subAssemblyParts: [{
            partName: String,
            partNumber: { // a1s1pX where a1 --> assembly name, s1 --> subAssemblyName, X is auto increasing number
                type: String
            },
            shortcut: String,
            scaleFactor: Number, // it is %
            finalCalculation: {
                materialPrice: Number,
                itemUnitPrice: Number,
                totalCostForQuantity: Number
            },
            keyValueCalculations: {
                perimeter: Number,
                sheetMetalArea: Number,
                surfaceArea: Number,
                weight: Number
            },
            sectionCode: {
                type: Schema.Types.ObjectId,
                ref: "MPartPresets",
                index: true,
            },
            material: {
                type: Schema.Types.ObjectId,
                ref: "MMaterial",
                index: true,
            },
            size: String,
            quantity: Number,
            variable: [{}], // Structure not defined yet    

            proccessing: [{
                processType: {
                    type: Schema.Types.ObjectId,
                    ref: "MProcessType",
                    index: true,
                },
                processItem: {
                    type: Schema.Types.ObjectId,
                    ref: "MProcessItem",
                    index: true,
                },
                rate: Number,
                quantity: {
                    keyValue: {
                        keyVariable: String,
                        keyValue: String
                    },
                    utilization: Number,
                    contengncyOrWastage: Number,
                    total: Number
                },
                totalCost: Number,
                remarks: String
            }],
            addons: [{
                addonType: {
                    type: Schema.Types.ObjectId,
                    ref: "MAddonType",
                    index: true,
                },
                addonItem: {
                    type: Schema.Types.ObjectId,
                    ref: "MMaterial",
                    index: true,
                },
                rate: Number,
                quantity: {
                    supportingVariable: {
                        supportingVariable: String,
                        value: Number
                    },
                    keyValue: {
                        keyVariable: String,
                        keyValue: String
                    },
                    utilization: Number,
                    contengncyOrWastage: Number,
                    total: Number
                },
                totalCost: Number,
                remarks: String
            }],
            extras: [{
                extraItem: {
                    type: Schema.Types.ObjectId,
                    ref: "MExtra",
                    index: true,
                },
                quantity: Number,
                totalCost: Number,
                remarks: String
            }],
        }],

        proccessing: [{
            processType: {
                type: Schema.Types.ObjectId,
                ref: "MProcessType",
                index: true,
            },
            processItem: {
                type: Schema.Types.ObjectId,
                ref: "MProcessItem",
                index: true,
            },
            rate: Number,
            quantity: {
                keyValue: {
                    keyVariable: String,
                    keyValue: String
                },
                utilization: Number,
                contengncyOrWastage: Number,
                total: Number
            },
            totalCost: Number,
            remarks: String
        }],
        addons: [{
            addonType: {
                type: Schema.Types.ObjectId,
                ref: "MAddonType",
                index: true,
            },
            addonItem: {
                type: Schema.Types.ObjectId,
                ref: "MMaterial",
                index: true,
            },
            rate: Number,
            quantity: {
                supportingVariable: {
                    supportingVariable: String,
                    value: Number
                },
                keyValue: {
                    keyVariable: String,
                    keyValue: String
                },
                utilization: Number,
                contengncyOrWastage: Number,
                total: Number
            },
            totalCost: Number,
            remarks: String
        }],
        extras: [{
            extraItem: {
                type: Schema.Types.ObjectId,
                ref: "MExtra",
                index: true,
            },
            quantity: Number,
            totalCost: Number,
            remarks: String
        }],
    }],

    proccessing: [{
        processType: {
            type: Schema.Types.ObjectId,
            ref: "MProcessType",
            index: true,
        },
        processItem: {
            type: Schema.Types.ObjectId,
            ref: "MProcessItem",
            index: true,
        },
        rate: Number,
        quantity: {
            keyValue: {
                keyVariable: String,
                keyValue: String
            },
            utilization: Number,
            contengncyOrWastage: Number,
            total: Number
        },
        totalCost: Number,
        remarks: String
    }],
    addons: [{
        addonType: {
            type: Schema.Types.ObjectId,
            ref: "MAddonType",
            index: true,
        },
        addonItem: {
            type: Schema.Types.ObjectId,
            ref: "MMaterial",
            index: true,
        },
        rate: Number,
        quantity: {
            supportingVariable: {
                supportingVariable: String,
                value: Number
            },
            keyValue: {
                keyVariable: String,
                keyValue: String
            },
            utilization: Number,
            contengncyOrWastage: Number,
            total: Number
        },
        totalCost: Number,
        remarks: String
    }],
    extras: [{
        extraItem: {
            type: Schema.Types.ObjectId,
            ref: "MExtra",
            index: true,
        },
        quantity: Number,
        totalCost: Number,
        remarks: String
    }]

});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Estimate', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    //- to add sub part name
    //- req data --> _id (document id) subAssemblyName 
    addSubAssembly: function (data, callback) {

        var addSubAssObj = {
            subAssemblyName: data.subAssemblyName
        };

        if (data.proccessing) {
            addSubAssObj.processing = data.processing;
        }

        Estimate.findOneAndUpdate({
            _id: data.id
        }, {
            $push: {
                subAssemblies: addSubAssObj
            },
        }).exec(function (err, updatedData) {
            if (err) {
                console.log('**** error at addSubAssPartName of Estimate.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(updatedData)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, updatedData);
            }
        });
    },

    // what this function will do ?
    // req data --> ?
    updateSubAssembly: function (data, callback) {
        Estimate.update({
            _id: data.id, // document/record _id
            'subAssemblies._id': data.subAssembliesId // element _id of array
        }, {
            $set: {
                'subAssemblies.$.subAssemblyName': data.subAssemblyName,
                'subAssemblies.$.quantity': data.quantity
            }
        }).exec(function (err, updatedData) {
            if (err) {
                console.log('**** error at function_name of Estimate.js ****', err);
                callback(err, null);
            } else {
                if (_.isEmpty(updatedData)) {
                    callback(null, 'noDataFound');
                } else {
                    callback(null, updatedData);
                }
            }
        });
    },
    // what this function will do ?
    // req data --> ?
    addSubAssemblyPart: function (data, callback) {
        var addSubAssPartObj = {
            partName: data.partName
        };

        if (data.proccessing) {
            addSubAssPartObj.processing = data.processing;
        }

        Estimate.findOneAndUpdate({
            _id: data.id,
            'subAssemblies._id': data.subAssembliesId
        }, {
            $push: {
                subAssemblyParts: subAssemblies.addSubAssPartObj
            },
        }).exec(function (err, updatedData) {
            if (err) {
                console.log('**** error at addSubAssPartName of Estimate.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(updatedData)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, updatedData);
            }
        });

    },

    // what this function will do ?
    // req data --> ?
    updateSubAssemblyPart: function (data, callback) {

    },
};
module.exports = _.assign(module.exports, exports, model);