var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var Customer = mongoose.model('Customer');
var Dealer = mongoose.model('Dealer');


//Used for routes that must be authenticated.
function isAuthenticated(req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects

    //allow all get request methods
    if (req.method === "GET") {
        return next();
    }
    if (req.isAuthenticated()) {
        return next();
    }

    // if the user is not authenticated then redirect him to the login page
    return res.redirect('/#login');
};

//Register the authentication middleware
router.use('/accounts', isAuthenticated);
        
//api for all posts
router.route('/accounts')

//create a new post
    .post(function (req, res) {
        console.log(req.body.customer[0]);
        if (req.body.customer[0].custId === null || typeof (req.body.customer[0].custId) === "undefined") {
            req.body.customer[0].custId = "CUST" + req.body.customer[0].contact;
            var customer = new Customer(req.body.customer[0]);
            customer.save(function (err, customer) {
                if (err) {
                    return res.send(500, err);
                }
            })
        }
        req.body.products.forEach(function (product) {
            if (product.dealerId === null || typeof (product.dealerId) === "undefined") {
                var dealer = new Dealer({ dealerId: "DEALER" + product.dealercontact, name: product.dealer, contact: product.dealercontact });
                dealer.save(function (err, dealer) {
                    if (err) {
                        return res.send(500, err);
                    }
                })
            }
        }, this);

        var account = new Account(req.body);
        account.save(function (err, account) {
            if (err) {
                return res.send(500, err);
            }
            return res.json(account);
        })
    })
    .get(function (req, res) {
        Account.find(function (err, accounts) {
            if (err) {
                return res.send(500, err);
            }
            return res.send(accounts);
        });
    })

//api for a specfic post
router.route('/account/:id')

//create
    .put(function (req, res) {
        Account.findById(req.params.id, function (err, account) {
            if (err)
                res.send(err);
            account.status = req.body.status;
            account.customer = req.body.customer;
            account.products = req.body.products;
            account.billedamount = req.body.billedamount;
            account.paymentstatus = req.body.paymentstatus;
            account.paymentcomment = req.body.paymentcomment;
            account.shipmentstatus = req.body.shipmentstatus;
            account.shipmentcomment = req.body.shipmentcomment;
            account.save(function (err, account) {
                if (err)
                    res.send(err);
                res.json(account);
            });
        });
    })
    .get(function (req, res) {
        Account.findById(req.params.id, function (err, account) {
            if (err)
                res.send(err);
            res.json(account);
        });
    })
    .delete(function (req, res) {
        Account.remove({
            _id: req.params.id
        }, function (err) {
            if (err)
                res.send(err);
            res.json("deleted :(");
        });
    })
//api for date specific route
router.route('/accountbydate')
    .post(function (req, res) {
        var startdate = new Date(req.body.startdate);
        var enddate = new Date(req.body.enddate);
        console.log("tried to search accounts between" + startdate + "&" + enddate);
        console.log(enddate);
        Account.find({ "created": { "$gte": startdate, "$lt": enddate } }, function (err, account) {
            if (err)
                res.send(err);
            res.json(account);
        })
    });

module.exports = router;