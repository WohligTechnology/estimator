module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getMaterialStructure: function (req, res) {
        if (req.body) {
            MMaterialCat.getMaterialStructure(req.body, res.callback);
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