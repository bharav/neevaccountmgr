var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Account = mongoose.model('Account');


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
    });

module.exports = router;