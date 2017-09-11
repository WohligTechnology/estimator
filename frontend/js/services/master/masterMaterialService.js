myApp.service('masterMaterialService', function ($http) {
    //- get master material view
    this.getMaterialView = function (callback) {
        callback();
    }
    //- get master material tree structure data
    this.getMaterialData = function (callback) {
        var materialCat = [{
            "name": "materialCat 1",
            "materialSub": [{
                "name": "MaterialSub Cat 1",
                "material": [{
                    "name": "Material 1"
                }, {
                    "name": "Material 2"
                }]
            }, ]
        }, {
            "name": "materialCat 2",
            "materialSub": [{
                "name": "MaterialSub Cat 1",
                "material": [{
                    "name": "Material 1"
                }, {
                    "name": "Material 2"
                }]

            }, {
                "name": "MaterialSub Cat 2"
            }, {
                "name": "MaterialSub Cat 3"
            }]
        }, {
            "name": "materialCat 3",
            "materialSub": [{
                "name": "MaterialSub Cat 1"
            }]
        }];

        callback(materialCat);
    }
    //- modal to add or edit material category

});