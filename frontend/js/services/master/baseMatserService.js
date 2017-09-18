myApp.service('baseMatserService', function ($http) {
    this.getBaseMasterData = function (callback) {
        
        var uoms = [{
            "name": "UOM 1",
            "_id": "jhsdadhashdghjg8767asfs7a6f7"
        }, {
            "name": "UOM 2",
            "_id": "jhsdadhashdghjg8767asfs7a6f7"
        }, {
            "name": "UOM 3",
            "_id": "jhsdadhashdghjg8767asfs7a6f7"
        }];
        
        var variables = [{
            "name": "Variable 1",
            "_id": "jhsdadhashdghjg8767asfs7a6f7"
        }, {
            "name": "Variable 2",
            "_id": "jhsdadhashdghjg8767asfs7a6f7"

        }, {
            "name": "Variable 3",
            "_id": "jhsdadhashdghjg8767asfs7a6f7"
        }];
        
        var dfs = [{
            "name": "Name 1",
            "_id": "jhsdadhashdghjg8767asfs7a6f7"
        }, {
            "name": "Name 2",
            "_id": "jhsdadhashdghjg8767asfs7a6f7"

        }, {
            "name": "Name 3",
            "_id": "jhsdadhashdghjg8767asfs7a6f7"
        }];
        
        var markups = [{
            "name": "Markups Name",
            "_id": "jhsdadhashdghjg8767asfs7a6f7"
        }, {
            "name": "Markups Name",
            "_id": "jhsdadhashdghjg8767asfs7a6f7"

        }, {
            "name": "Markups Name",
            "_id": "jhsdadhashdghjg8767asfs7a6f7"
        }];

        var baseMaterialObject = {
            "uoms":uoms,
            "variables":variables,
            "dfs":dfs,
            "markups":markups
        };

        callback(baseMaterialObject);
    }

});