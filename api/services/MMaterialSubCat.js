var schema = new Schema({
    materialSubCatName: {
        type: String,
        required: true
    },
    catId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MMaterialCat',
        key: "subCat",
        required: true
    },
    materials: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MMaterial',
    }],
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MMaterialSubCat', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    //-Find the records of material sub category on the basis of material category Id.
    getCatsOfSubCat: function (data, callback) {
        MMaterialSubCat.find({
            catId: data.matCatId
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at getMaterialsCats of MMaterialSubCat.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, found);
            }
        });
    },

    //-Get all the records of material sub category from MMAterialSubCat table.
    getMMaterialSubCatData: function (data, callback) {
        MMaterialSubCat.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getMMaterialSubCatData of MMaterialSubCat.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },
    // allow to delete and restrictions for material sub category on the basis of conditions.
    // req data --> _id
    delRestrictionMMaterialSubCat: function (data, callback) {
        MMaterialSubCat.find({
            _id: data._id
        }).lean().exec(function (err, subCatData) {
            if (err) {
                console.log('**** error at function_name of MMaterialSubCat.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(subCatData)) {
                callback(null, []);
            } else {
                MAddonType.findOne({
                    materialSubCat: data._id
                }).lean().exec(function (err, found) {
                    if (err) {
                        console.log('**** error at function_name of MMaterialSubCat.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(found)) {
                        EstimatePart.find({
                            material: {
                                $in: subCatData.materials
                            }
                        }).exec(function (err, found) {
                            if (err) {
                                console.log('**** error at function_name of MMaterialSubCat.js ****', err);
                                callback(err, null);
                            } else if (_.isEmpty(found)) {
                                async.parallel([
                                    function (callback) {
                                        Material.remove({
                                            materialSubCategory: data._id
                                        }).exec(function (err, removedMat) {
                                            if (err) {
                                                console.log('**** error at function_name of MMaterialSubCat.js ****', err);
                                                callback(err, null);
                                            } else if (_.isEmpty(removedMat)) {
                                                callback(null, []);
                                            } else {
                                                callback(null, removedMat);
                                            }
                                        });
                                    },
                                    function (callback) {
                                        MaterialSubCat.find({
                                            _id: data._id
                                        }).exec(function (err, removedMatSubCat) {
                                            if (err) {
                                                console.log('**** error at function_name of MMaterialSubCat.js ****', err);
                                                callback(err, null);
                                            } else if (_.isEmpty(removedMatSubCat)) {
                                                callback(null, []);
                                            } else {
                                                callback(null, removedMatSubCat);
                                            }
                                        });
                                    },
                                ], function (err, finalResults) {
                                    if (err) {
                                        console.log('********** error at final response of async.parallel  MMaterialSubCat.js ************', err);
                                        callback(err, null);
                                    } else if (_.isEmpty(finalResults)) {
                                        callback(null, 'noDataFound');
                                    } else {
                                        callback(null, 'records updated successfully');
                                    }
                                });
                            } else {
                                callback(null, 'dependecy of table Estimate Part');
                            }
                        });
                    } else {
                        callback(null, 'Dependecny of table MAddon Type');
                    }
                });
            }
        });
    },

};
module.exports = _.assign(module.exports, exports, model);