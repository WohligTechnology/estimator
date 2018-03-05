myApp.service('TemplateService', function (usersRoleService) {
    this.title = "Dashboard";
    this.meta = "";
    this.metadesc = "";
    this.userPhoto = "";
    this.userName = "";
    this.visibleGlobalVar = {};
    var d = new Date();
    this.year = d.getFullYear();

    // if ($.jStorage.set("allRoles") != null) {
    //        usersRoleService.getUserCrudRole('Global_Variables', '', function (response) {
    //            if (response) {
    //                this.visibleGlobalVar = response;
    //                console.log('****.......... $scope.visibleGlobalVar in Dashboard...... ****', this.visibleGlobalVar);
    //            }
    //        });
    //    }
    if ($.jStorage.get('loggedInUser') != null) {
        var loggedInUser = $.jStorage.get('loggedInUser');
        this.userPhoto = loggedInUser.photo;
        this.userName = loggedInUser.name;
    }


    this.getTitle = function (title) {
        console.log('**** inside function_name of template.js ****');
        this.title = title;
    };
    this.getUserDetails = function (formData, type) {
        var loggedInUser = $.jStorage.get('loggedInUser');
        if (loggedInUser == null) {
            loggedInUser = {};
            loggedInUser._id = formData._id;
            loggedInUser.email = formData.email;
            this.userName = loggedInUser.name = formData.name;
            this.userPhoto = loggedInUser.photo = formData.photo;
            $.jStorage.set("loggedInUser", loggedInUser);
            // debugger;
            // $.jStorage.set("allRoles", formData.accessLevel[0].roles);
            // usersRoleService.getUserCrudRole('Global_Variables', '', function (response) {
            //     if (response) {
            //         this.visibleGlobalVar = response;
            //         console.log('****.......... $scope.visibleGlobalVar in Dashboard...... ****', this.visibleGlobalVar);
            //     }
            // });
        } else {
            if (loggedInUser._id == formData._id) {
                this.userName = loggedInUser.name = formData.name;
                this.userPhoto = loggedInUser.photo = formData.photo;
                loggedInUser.email = formData.email;
                $.jStorage.set("loggedInUser", loggedInUser);
            }
        }
    }

    //Set user role
    this.setUserRole = function (allRoles, callback) {
        if (_.isUndefined(allRoles.roles)) {
            callback(false);
        } else {
            $.jStorage.set("allRoles", allRoles.roles);
            // usersRoleService.getUserCrudRole('Global_Variables', '', function (response) {
            //     if (response) {
            //         this.visibleGlobalVar = response;
            //         console.log('****.......... $scope.visibleGlobalVar in Dashboard...... ****', this.visibleGlobalVar);
            //     }
            // });
            callback(true);
        }
    }



    this.init = function () {
        this.header = "views/template/header.html";
        this.menu = "views/template/menu.html";
        this.content = "views/content/content.html";
        this.footer = "views/template/footer.html";
    };

    this.getHTML = function (page) {
        this.init();
        var data = this;
        data.content = "views/" + page;
        return data;
    };

    this.init();

});