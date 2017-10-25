module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    totalHoldsEnquiries: function (req, res) {
        if (req.body) {
            Enquiry.totalHoldsEnquiries(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    totalOpenEnuieries: function (req, res) {
        if (req.body) {
            Enquiry.totalOpenEnuieries(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    totalCloseEnquiries: function (req, res) {
        if (req.body) {
            Enquiry.totalCloseEnquiries(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getStatusCount: function (req, res) {
        if (req.body) {
            Enquiry.getStatusCount(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getStatusCountInBulk: function (req, res) {
        if (req.body) {
            Enquiry.getStatusCountInBulk(req.body, res.callback);
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