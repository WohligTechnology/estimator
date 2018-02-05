myApp.service('TemplateService', function () {
    this.title = "";
    this.meta = "";
    this.metadesc = "";

    var d = new Date();
    this.year = d.getFullYear();

    this.getTitle = function(title){
        console.log('**** inside function_name of template.js ****');
       this.title = title;
    };

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