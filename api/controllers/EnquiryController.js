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

    createEnquiry: function (req, res) {
        if (req.body) {
            // please remove Controller.js from below line
            Enquiry.createEnquiry(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },
    getEnquiryData: function (req, res) {
        if (req.body) {
            Enquiry.getEnquiryData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: 'Invalid Request'
                }
            })
        }
    },

    search: function (req, res) {
        if (req.body) {
            // please remove Controller.js from below line
            Enquiry.search(req.body, res.callback);
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