var schema = new Schema({
    materialCatName: {
        type: String,
        required: true
    },
    subCat: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MMaterialSubCat',
        index: true
    }],
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MMaterialCat', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    //-Get all material structure by deep populating sub category and subCat's materials.
    getMaterialStructure: function (data, callback) {
        MMaterialCat.find()
            .deepPopulate('subCat subCat.materials').lean()
            .exec(function (err, found) {
                if (err) {
                    console.log('**** error at getMaterialStructure of MMaterialCat.js ****', err);
                    callback(err, null);
                } else if (_.isEmpty(found)) {
                    callback(null, []);
                } else {
                    callback(null, found);
                }
            });
    },
    // allow to delete and restrictions for material category on the basis of conditions.
    // req data --> _id
    delRestrictionMaterialCat: function (data, callback) {
        MMaterialCat.find({
            _id: data._id
        }).exec(function (err, matData) {
            if (err) {
                console.log('**** error at function_name of MMaterialCat.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(matData)) {
                callback(null, 'noDataFound');
            } else {
                MAddonType.findOne({
                    materialCat: data._id
                }).exec(function (err, addonTypeData) {
                    if (err) {
                        console.log('**** error at function_name of MMaterialCat.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(addonTypeData)) {
                        MMaterialSubCat.findOne({
                            catId: data._id
                        }).exec(function (err, subCatData) {
                            if (err) {
                                console.log('**** error at function_name of MMaterialCat.js ****', err);
                                callback(err, null);
                            } else if (_.isEmpty(subCatData)) {
                                callback(null, 'noDataFound');
                            } else {
                                EstimatePart.find({
                                    material: subCatData.materials
                                }).exec(function (err, partData) {
                                    if (err) {
                                        console.log('**** error at function_name of MMaterialCat.js ****', err);
                                        callback(err, null);
                                    } else if (_.isEmpty(partData)) {
                                        async.parallel([
                                            function (callback) {
                                                MMaterial.remove({
                                                    _id: {
                                                        $in: subCatData.materials
                                                    }
                                                }).exec(function (err, allMatRemoved) {
                                                    if (err) {
                                                        console.log('**** error at function_name of MMaterialCat.js ****', err);
                                                        callback(err, null);
                                                    } else if (_.isEmpty(allMatRemoved)) {
                                                        callback(null, 'noDataFound');
                                                    } else {
                                                        callback(null, allMatRemoved);
                                                    }
                                                });
                                            },
                                            function (callback) {
                                                MMaterialSubCat.remove({
                                                    catId: data._id
                                                }).exec(function (err, matSubCatRemoved) {
                                                    if (err) {
                                                        console.log('**** error at function_name of MMaterialCat.js ****', err);
                                                        callback(err, null);
                                                    } else if (_.isEmpty(matSubCatRemoved)) {
                                                        callback(null, 'noDataFound');
                                                    } else {
                                                        callback(null, matSubCatRemoved);
                                                    }
                                                });
                                            },
                                            function (callback) {
                                                MMaterialCat.remove({
                                                    _id: data._id
                                                }).exec(function (err, matCatRemoved) {
                                                    if (err) {
                                                        console.log('**** error at function_name of MMaterialCat.js ****', err);
                                                        callback(err, null);
                                                    } else if (_.isEmpty(matCatRemoved)) {
                                                        callback(null, 'noDataFound');
                                                    } else {
                                                        callback(null, matCatRemoved);
                                                    }
                                                });
                                            }
                                        ], function (err, finalResults) {
                                            if (err) {
                                                console.log('********** error at final response of async.parallel  MMaterialCat.js ************', err);
                                                callback(err, null);
                                            } else if (_.isEmpty(finalResults)) {
                                                callback(null, 'noDataFound');
                                            } else {
                                                callback(null, 'Records updated succesfully');
                                            }
                                        });
                                    } else {
                                        callback(null, 'dependecny of table estimate part');
                                    }
                                });
                            }
                        });
                    } else {
                        callback(null, 'dependecy of table MMaterialCat');
                    }
                });
            }
        });
    },

};
module.exports = _.assign(module.exports, exports, model);