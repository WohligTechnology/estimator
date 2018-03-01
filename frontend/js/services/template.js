myApp.service('TemplateService', function () {
    this.title = "Dashboard";
    this.meta = "";
    this.metadesc = "";
    this.userPhoto = "";
    this.userName = "";

    var d = new Date();
    this.year = d.getFullYear();

    if ($.jStorage.get('loggedInUser') != null) {
        var loggedInUser = $.jStorage.get('loggedInUser');
        this.userPhoto = loggedInUser.photo;
        this.userName =  loggedInUser.name;
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
        } else {
            if (loggedInUser._id == formData._id) {
                this.userName = loggedInUser.name = formData.name;
                this.userPhoto = loggedInUser.photo = formData.photo;
                loggedInUser.email = formData.email;
                $.jStorage.set("loggedInUser", loggedInUser);
            }
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