var Lock = function () {

    return {
        //main function to initiate the module
        init: function () {

             $.backstretch([
		        "../themeassets/pages/img/login/1.jpg",
		        "../themeassets/pages/img/login/2.jpg",
		        "../themeassets/pages/img/login/3.jpg",
		        "../themeassets/pages/img/login/4.jpg"
		        ], {
		          fade: 1000,
		          duration: 8000
		      });
        }

    };

}();

jQuery(document).ready(function() {
    Lock.init();
});