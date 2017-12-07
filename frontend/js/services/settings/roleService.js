myApp.service('roleService', function ($http, $uibModal, NavigationService) {

    this.getRoleData = function (callback) {
        callback();
    }
    this.addOrEditRoleModal = function (operation, role, callback) {
        var roleDataObj = {};

        if (angular.isDefined(role)) {
            roleDataObj.user = user;
        }
        if (operation == "save") {
            roleDataObj.saveBtn = true;
            roleDataObj.editBtn = false;
        } else if (operation == "update") {
            roleDataObj.saveBtn = false;
            roleDataObj.editBtn = true;
        }
        callback(roleDataObj);
    }
    this.addOrEditRole = function (role, callback) {
        callback();
    }
    this.deleteRole = function (roleId, callback) {
        callback();
    }
});