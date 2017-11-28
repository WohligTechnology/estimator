module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getCatsOfSubCat: function (req, res) {
        if (req.body) {
            MMaterialSubCat.getCatsOfSubCat(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getMMaterialSubCatData: function (req, res) {
        if (req.body) {
            MMaterialSubCat.getMMaterialSubCatData(req.body, res.callback);
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