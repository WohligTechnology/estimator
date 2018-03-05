myApp.service('usersRoleService', function () {

    //- *************************** default variables/tasks begin here ********************************* //
    //- define all variables in this section only

    //- *************************** repeated functions in service begin here  ************************* //
    //- define all repeated functions in this section only

    //- *************************** functions to be triggered form controller begin here ************** // 
    //- define all functions triggered from view in this section only

    //- Get navigation role
    this.getNavigationRole = function (roles, callback) {
        // console.log('**** inside function_name of usersRoleModuleService.js ****', roles);
        if (!_.isUndefined(roles)) {
            var navigationFlags = {};
            _.each(roles, function (value, key) {
                navigationFlags[key] = {
                    flag: value.navigation
                };
                if (value.subModules) {
                    _.each(value.subModules, function (subValue, subKey) {
                        navigationFlags[key][subKey] = subValue.navigation;
                    });
                }
            });
            callback({
                value: true,
                data: navigationFlags
            });
            // console.log(" navigation flags = ", navigationFlags);
        } else {
            callback({
                status: "error",
                message: "Relogin Required!",
                value: false
            });
        }
    }

    //- Get specific role from roles
    this.getUserCrudRole = function (key, subKey, callback) {
        debugger;
        var userDetails = $.jStorage.get("allRoles");
        if (_.isEmpty(subKey)) {
            callback(userDetails[key]);
        } else {
            callback(userDetails[key]['subModules'][subKey]);
        }
    }


});