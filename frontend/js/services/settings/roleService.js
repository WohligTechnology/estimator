myApp.service('roleService', function (NavigationService) {


    //- *************************** default variables/tasks begin here ********************************* //
    //-  define all variables in this section only

    //- *************************** repeated functions in service begin here  ************************* //
    //- define all repeated functions in this section only


    //- *************************** functions to be triggered form controller begin here ************** // 
    //- define all functions triggered from view in this section only

    //- get pagination data
    this.getPaginationData = function (pageNumber, count, searchKeyword, callback) {
        NavigationService.apiCall('Role/search', {
            keyword: searchKeyword,
            totalRecords: count,
            page: pageNumber
        }, function (data) {
            callback(data.data);
        });
    }
    //-find one role
    this.findOneRole = function (roleId, callback) {
        NavigationService.apiCall('Role/getOne', {
            _id: roleId
        }, function (data) {
            callback(data.data);
        });

    }


    // -create new Role
    this.addRole = function (role, callback) {

        NavigationService.apiCall('Role/save', role, function (data) {
            callback(data);
        });

    }

    //-update  question Role
    this.updateRole = function (role, callback) {

        NavigationService.apiCall('Role/save', role, function (data) {
            callback(data);
        });

    }

    this.deleteOneRole = function (roleId, callback) {
        NavigationService.delete('Role/delete', {
            "_id": roleId
        }, function (data) {
            callback(data);
        });
    }
    //- For Checkbox checked row
    this.selectRow = function (allRoles, field, status, callback) {
        allRoles[field].create = checkStatus(allRoles[field].createPerm, status);
        allRoles[field].read = checkStatus(allRoles[field].readPerm, status);
        allRoles[field].update = checkStatus(allRoles[field].updatePerm, status);
        allRoles[field].delete = checkStatus(allRoles[field].deletePerm, status);
        allRoles[field].navigation = checkStatus(allRoles[field].navigationPerm, status);
        callback(allRoles);
    }

    //- For Checkbox sub checked row
    this.selectSubRow = function (allRoles, field, subField, status, callback) {
        allRoles[field]['subModules'][subField].create = checkStatus(allRoles[field]['subModules'][subField].createPerm, status);
        allRoles[field]['subModules'][subField].read = checkStatus(allRoles[field]['subModules'][subField].readPerm, status);
        allRoles[field]['subModules'][subField].update = checkStatus(allRoles[field]['subModules'][subField].updatePerm, status);
        allRoles[field]['subModules'][subField].delete = checkStatus(allRoles[field]['subModules'][subField].deletePerm, status);
        allRoles[field]['subModules'][subField].navigation = checkStatus(allRoles[field]['subModules'][subField].navigationPerm, status);
        callback(allRoles);
    }

    //- For All Checkbox checked
    this.selectAllCheckbox = function (allRoles, status, callback) {
        _.map(allRoles, function (value) {
            changeStatus(value);
            if (value.subModules) {
                _.map(value.subModules, function (subValue) {
                    changeStatus(subValue);
                });
            }
        });

        function changeStatus(value) {
            value.create = checkStatus(value.createPerm, status);
            value.read = checkStatus(value.readPerm, status);
            value.update = checkStatus(value.updatePerm, status);
            value.delete = checkStatus(value.deletePerm, status);
            value.navigation = checkStatus(value.navigationPerm, status);
        }

        callback(allRoles);
    }

    //- For check role status
    function checkStatus(roleFlag, status) {
        if (roleFlag == true && status == true) {
            return true;
        } else {
            return false;
        }
    }
});