var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        validate: validators.isEmail(),
        excel: "User Email",
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        default: ""
    },
    photo: {
        file: String,
        default: ""
    },
    password: {
        type: String,
        default: ""
    },
    forgotPassword: {
        type: String,
        default: ""
    },
    otp: {
        type: String,
        default: ""
    },
    accessToken: {
        type: [String],
        index: true
    },
    googleAccessToken: String,
    googleRefreshToken: String,
    oauthLogin: {
        type: [{
            socialId: String,
            socialProvider: String
        }],
        index: true
    },
    accessLevel: [{
        type: Schema.Types.ObjectId,
        ref: 'Role',
        index: true
    }]
});

schema.plugin(deepPopulate, {
    populate: {
        'accessLevel': {
            select: 'name _id'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('User', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "accessLevel", "accessLevel"));
var model = {

    existsSocial: function (user, callback) {
        var Model = this;
        Model.findOne({
            "oauthLogin.socialId": user.id,
            "oauthLogin.socialProvider": user.provider,
        }).exec(function (err, data) {
            if (err) {
                callback(err, data);
            } else if (_.isEmpty(data)) {
                var modelUser = {
                    name: user.displayName,
                    accessToken: [uid(16)],
                    oauthLogin: [{
                        socialId: user.id,
                        socialProvider: user.provider,
                    }]
                };
                if (user.emails && user.emails.length > 0) {
                    modelUser.email = user.emails[0].value;
                    var envEmailIndex = _.indexOf(env.emails, modelUser.email);
                    if (envEmailIndex >= 0) {
                        modelUser.accessLevel = "Admin";
                    }
                }
                modelUser.googleAccessToken = user.googleAccessToken;
                modelUser.googleRefreshToken = user.googleRefreshToken;
                if (user.image && user.image.url) {
                    modelUser.photo = user.image.url;
                }
                Model.saveData(modelUser, function (err, data2) {
                    if (err) {
                        callback(err, data2);
                    } else {
                        data3 = data2.toObject();
                        delete data3.oauthLogin;
                        delete data3.password;
                        delete data3.forgotPassword;
                        delete data3.otp;
                        callback(err, data3);
                    }
                });
            } else {
                delete data.oauthLogin;
                delete data.password;
                delete data.forgotPassword;
                delete data.otp;
                data.googleAccessToken = user.googleAccessToken;
                data.save(function () {});
                callback(err, data);
            }
        });
    },
    profile: function (data, callback, getGoogle) {
        var str = "name email photo mobile accessLevel";
        if (getGoogle) {
            str += " googleAccessToken googleRefreshToken";
        }
        User.findOne({
            accessToken: data.accessToken
        }, str).exec(function (err, data) {
            if (err) {
                callback(err);
            } else if (data) {
                callback(null, data);
            } else {
                callback("No Data Found", data);
            }
        });
    },
    updateAccessToken: function (id, accessToken) {

        User.findOne({
            "_id": id
        }).exec(function (err, data) {
            data.googleAccessToken = accessToken;
            data.save(function () {});
        });
    },
    getAllMedia: function (data, callback) {

    },

    //-get total count of records from user,customer,enquiry and estimate table.
    getAllDashboardData: function (data, callback) {

        async.parallel({
            userCount: function (callback) {
                User.count().exec(function (err, count) {
                    callback(null, count);
                });

            },
            customerCount: function (callback) {
                Customer.count().exec(function (err, count) {
                    callback(null, count);
                });

            },
            enquiryCount: function (callback) {
                Enquiry.count().exec(function (err, count) {
                    callback(null, count);
                });

            },
            estimateCount: function (callback) {
                DraftEstimate.count().exec(function (err, count) {
                    callback(null, count);
                });

            },

        }, function (err, finalResults) {
            if (err) {
                console.log('********** error at final response of async.parallel  User.js ************', err);
                callback(err, null);
            } else if (_.isEmpty(finalResults)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, finalResults);
            }
        });
    },

    //-create new user by passing email and name and send the otp to respective emailid of user.
    createUser: function (data, callback) {
        var userData = {};
        async.waterfall([
                function (callback) {
                    var saveDataObj = {
                        email: data.email,
                        name: data.name,
                        mobile:data.mobile
                    };
                    User.saveData(saveDataObj, function (err, savedData) {
                        if (err) {
                            console.log('**** error at createUser of User.js ****', err);
                            callback(err, null);
                        } else if (_.isEmpty(savedData)) {
                            callback(null, []);
                        } else {
                            var oneTimePassword = User.generateRandomString(8);
                            savedData.password = oneTimePassword;

                            User.saveData(savedData, function (err, result) {
                                if (err) {
                                    callback(err, null);
                                } else {
                                    callback(null, savedData);
                                }
                            });
                        }
                    });
                },
                // Send new password to user's email
                function (savedData, callback) {
                    if (_.isEmpty(savedData)) {
                        callback(null, []);
                    } else {
                        var emailData = {};
                        emailData.otp = savedData.password;
                        emailData.email = data.email;
                        emailData.subject = "Estimator User Credential";
                        emailData.filename = "forgotPassword.ejs";
                        // emailData.from = "admin@rusa.com"
                        emailData.from = "ashish.zanwar@wohlig.com";
                        emailData.name = savedData.name;

                        Config.email(emailData, callback);
                    }
                },
            ],
            function (err, result) {
                console.log(" ***** async.waterfall final response of createUser ***** ", result);
                callback(err, "success");
            });

    },

    //-allow the user to login the application through email and password.
    loginUser: function (data, callback) {
        User.findOne({
            email: data.email,
            password: data.password
        }).populate('accessLevel').exec(function (err, found) {
            if (err) {
                console.log('**** error at loginUser of User.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, found);
            }
        });
    },

    //-generate random text string mainly used for generating the password.
    generateRandomString: function (number) {
        var text = "";
        var possible = "$ABCDEFGHIJKLMNOPQRS&TUVWXYZabcd#efghijklmnopqrstuvw@xyz01234%56789";

        for (var i = 0; i < number; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },

    //-allow the system to change the password of already logged in user by given new password.
    changePassword: function (data, callback) {
        User.findOne({
            _id: data._id
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at resetPassword of User.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, 'noDataFound');
            } else {

                if (found.password == data.password) {

                    var saveDataObj = {
                        password: data.newPassword
                    };

                    if (!_.isEmpty(found._id)) {
                        saveDataObj._id = found._id;

                    }

                    User.saveData(saveDataObj, function (err, savedData) {
                        if (err) {
                            console.log('**** error at resetPassword of User.js ****', err);
                            callback(err, null);
                        } else if (_.isEmpty(savedData)) {
                            callback(null, 'noDataFound');
                        } else {
                            callback(null, savedData);
                        }
                    });
                } else {
                    callback(null, "password not matching");
                }
            }
        });
    },

    //-allow the system to send the forget password otp to user's emailid.
    sendForgetPasswordOtp: function (data, callback) {
        var userData = {};
        // check whether user is available or not ?
        // if --> yes --> generate OTP & send email to user with otp
        async.waterfall([
                // Check whether user is present
                function (callback) {
                    User.findOne({
                        email: data.email
                    }).lean().exec(callback);
                },
                // Change password to random String
                function (user, callback) {
                    if (_.isEmpty(user)) {
                        callback(null, []);
                    } else {
                        // Generate random String as a password
                        var verificationCode = User.generateRandomString(6);

                        user.otp = verificationCode;
                        User.saveData(user, function (err, result) {
                            if (err) {
                                callback(err, null);
                            } else {
                                console.log('**** inside function_name of User mai hu& data is ****', user);
                                User.findOne({
                                    _id: user._id
                                }).exec(callback);
                            }
                        });
                    }
                },
                // Send forget password email
                function (user, callback) {
                    if (_.isEmpty(user)) {
                        userData.userId = user._id;
                        callback(null, "userNotFound");
                    } else {
                        userData.userId = user._id;
                        var emailData = {};
                        emailData.otp = user.otp;
                        emailData.email = data.email;
                        emailData.subject = "Forgot Password";
                        emailData.filename = "forgotPassword.ejs";
                        // emailData.from = "admin@rusa.com"
                        emailData.from = "ashish.zanwar@wohlig.com";
                        // emailData.from = "vijayvaidya99@gmail.com";
                        emailData.name = user.name;
                        Config.email(emailData, callback);
                        // callback();
                    }
                }
            ],
            function (err, result) {
                console.log(" ***** async.waterfall final response of sendForgotPasswordOtp ***** ", result);
                callback(err, userData);
            });
    },

    //-confirm the forget password otp which is sent on user's email id.
    confirmForgotPasswordOtp: function (data, callback) {
        User.findOne({
            _id: data._id,
            otp: data.verifyOtp
        }).lean().exec(function (err, found) {
            if (err) {
                console.log(" *** inside confirmForgotPasswordOtp err *** ", err);
                callback(null, err);
            } else if (_.isEmpty(found)) {
                callback(null, {});
            } else {
                callback(null, found);
            }
        });
    },

    //-reset password in case if user forgot the password.
    resetPassword: function (data, callback) {
        User.findOneAndUpdate({
            _id: data._id
        }, {
            password: data.newPassword,
            otp: ""
        }).exec(function (err, updatedData) {
            if (err) {
                console.log('**** error at resetPassword of User.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(updatedData)) {
                callback(null, 'noDataFound');
            } else {
                callback(null, updatedData);
            }
        });
    },

    //-get all user data from user table.
    getUserData: function (data, callback) {
        User.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getUserData of User.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    //-serach the user data by passing user name
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
            filters: {
                field: [''],
                keyword: {
                    fields: ['name'],
                    term: data.keyword
                }
            },
            sort: {
                desc: 'createdAt'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        User.find({}).sort({
                createdAt: -1
            })
            .deepPopulate('accessLevel')
            .field(options)
            .order(options)
            .keyword(options)
            .page(options,
                function (err, found) {
                    if (err) {
                        console.log('**** error at search of User.js ****', err);
                        callback(err, null);
                    } else if (_.isEmpty(found)) {
                        callback(null, 'noDataFound');
                    } else {
                        callback(null, found);
                    }
                });
    },

    //-delete multiple users by passing multiple user ids
    deleteMultipleUsers: function (data, callback) {
        User.remove({
            _id: {
                $in: data.idsArray
            }
        }).exec(function (err, found) {
            if (err) {
                console.log('**** error at deleteMultipleUsers of User.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, []);
            } else {
                callback(null, found);
            }
        });
    },

    // upload the avtar 
    // req data --files
    uploadAvtar: function (data, callback) {
        var uuid = '';
        data("file").upload({
            maxBytes: 10000000, // 10 MB Storage 1 MB = 10^6
            dirname: "../../assets/images",
        }, function (err, uploadedFile) {
            if (err) {
                callback('error at uploadAvtar', err);
            } else if (uploadedFile.length > 0) {
                var getAllFilesId = [];
                async.concat(uploadedFile, function (n, callback) {

                    User.uploadFile(n, function (err, value) {

                        // console.log('**** inside %%%%%%%%%%%%%%%%%%%%% of Person.js ****',value);
                        getAllFilesId.push(value);
                        // if (err) {
                        //   callback(err);
                        // } else {
                        //   callback();
                        // }

                        callback();
                    });

                }, function (err, finalData) {
                    console.log('**** inside %%%%%%%%%%%%%%%%%%%%% of Person.js ****', getAllFilesId);
                    callback(null, getAllFilesId);
                });

            } else {
                callback(null, {
                    value: false,
                    data: "No files selected"
                });
            }
        });
    },

    //-uploadAvtar function calling the function uploadFile from frontend and give back fileId.
    uploadFile: function (file, callback) {
        var d = new Date();
        var extension = file.filename.split('.').pop();
        var allowedTypes = ['image/jpeg', 'image/png'];
        uuid = file.fd.split('/').pop();

        if (uuid) {
            callback(null, uuid);
        }
    },

    beforeCreate: function (data, callback) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(data.password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                    callback(err);
                } else {
                    data.password = hash;
                    callback();
                }
            });
        });
    },

    // AceesControl: function (data, callback) {
    //     PermissionService.createRole({
    //         roleName: data.roleName,
    //         permissions: [{
    //             model: data.modelName,
    //             action: data.action
    //         }, ]
    //     })
    // },

    //-Get all users' name from user table.
    getUserName: function (data, callback) {
        console.log('**** i@@@@@@@2 ****',data);
        User.find().select('name').lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at function_name of User.js ****', err);
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