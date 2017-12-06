module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getRoleData: function (req, res) {
        if (req.body) {
            Role.getRoleData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    assignRole: function (req, res) {
        if (req.body) {
            Role.assignRole(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    createRoleWithPermissions: function (req, res) {
        console.log('**** inside function_name of RoleController.js & data is ****', req.body);
        if (req.body) {
            Role.createRoleWithPermissions(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    createRole: function (req, res) {
        console.log('****!!!!!!!!!!!!****',req.body);
        if (req.body) {
            Role.createRole(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
};
module.exports = _.assign(module.exports, controller);