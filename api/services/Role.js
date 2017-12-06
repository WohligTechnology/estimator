var schema = new Schema({
    roleName: {
        type: String,
        index: true
    },
    permission: [{
        model: String,
        action: {}
    }],


});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Role', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getRoleData: function (data, callback) {
        Role.find().lean().exec(function (err, found) {
            if (err) {
                console.log('**** error at getRoleData of Role.js ****', err);
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
    createRole: function (data, callback) {
        User.findOne({
                email: data.email
            })
            .exec(function (err, user) {
                if (err) {
                    console.log('**** error at getRoleData of Role.js ****', err);
                    callback(err, null);
                } else if (_.isEmpty(user)) {
                    callback(null, []);
                } else {
                    Role.create({
                            roleName: data.roleName,
                            userId: [user.id]
                        })
                        .catch(function (error) {
                            console.error('**** error at getRoleData of Role.js ****', error);
                        })
                        .then(function (role) {
                            var saveDataObj = {
                                accessLevel: data.roleName,
                            };
                            if (!_.isEmpty(user._id)) {
                                saveDataObj._id = user._id;
                            }
                            User.saveData(saveDataObj, function (err, savedData) {
                                if (err) {
                                    console.log('**** error at function_name of Role.js ****', err);
                                    callback(err, null);
                                } else if (_.isEmpty(savedData)) {
                                    callback(null, []);
                                } else {
                                    callback(null, savedData);
                                }
                            });
                        });
                }
            });
    },
    // what this function will do ?
    // req data --> ?
    createRoleWithPermissions: function (data, callback) {

        PermissionService.createRole({
            name: data.roleName,
            users: data.email,
            permissions: [{
                    model: 'User',
                    action: 'create'
                },
                {
                    model: 'Customer',
                    action: 'read'
                }
            ]
        })
    },
    createRole: function (data, callback) {
        Role.create({
            roleName: data.roleName,
            })
            .then(function (role) {
                console.log(role);
                callback(role);
            })
            .catch(function (error) {
                console.error(error);
            });

    },



};
module.exports = _.assign(module.exports, exports, model);