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
    dob: {
        type: Date,
        excel: {
            name: "Birthday",
            modify: function (val, data) {
                return moment(val).format("MMM DD YYYY");
            }
        }
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
    accessLevel: {
        type: String,
        default: "User",
        enum: ['User', 'Admin']
    }
});

schema.plugin(deepPopulate, {
    populate: {
        'user': {
            select: 'name _id'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('User', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "user", "user"));
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
                Estimate.count().exec(function (err, count) {
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

    loginUser: function (data, callback) {
        console.log('**** inside loginUser of User.js & data is ****', data);
        User.findOne({
            email: data.username,
            password: data.password
        }).exec(function (err, found) {
            console.log('**** inside res object of User.js & data is ****', found);
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

    generateRandomString: function (number) {
        var text = "";
        var possible = "$#@%&ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < number; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },

    changePassword: function (data, callback) {
        console.log('**** inside resetPassword of User.js & data is ****', data);
        User.findOne({
            _id: data.id
        }).exec(function (err, found) {
            console.log('**** inside res object of User.js & data is ****', found);
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
    sendForgetPasswordOtp: function (data, callback) {
        console.log(" ***** inside sendForgotPasswordOtp  ***** ", data);
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
                                console.log('**** inside function_name of User mai hu& data is ****',user);
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
                        emailData.otp = user.forgotPassword;
                        emailData.email = data.email;
                        emailData.subject = "Forgot Password";
                        emailData.filename = "forgotPassword.ejs";
                        // emailData.from = "admin@rusa.com"
                        emailData.from = "ashish.zanwar@wohlig.com";
                        emailData.name = user.name;

                        Config.email(emailData, callback);
                        // callback();
                    }
                }
            ],
            function (err, result) {
                console.log(" ***** async.waterfall final response of sendForgotPasswordOtp ***** ", result);
                callback(err, result);
            });
    },
    confirmForgotPasswordOtp: function (data, callback) {
        console.log(" **** inside confirmForgotPasswordOtp *** ", data);
        User.findOne({
            _id: data._id,
            forgotPassword: data.verifyOtp
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
    resetPassword: function (data, callback) {
        User.findOneAndUpdate({
            _id: data._id
        }, {
            password: data.newPassword,
            otp:""
        }).exec(function (err, updatedData) {
            if (err) {
                console.log('**** error at resetPassword of User.js ****', err);
                callback(err, null);
            } else if (_.isEmpty(updatedData)) {
                callback(null, 'noDataFound');
            } else {
                callback(null,updatedData);
            }
        });
    },


};
module.exports = _.assign(module.exports, exports, model);