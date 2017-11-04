module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getCustomerData: function (req, res) {
        if (req.body) {
            Customer.getCustomerData(req.body, res.callback);
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