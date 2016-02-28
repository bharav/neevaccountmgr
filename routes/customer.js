var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Customer = mongoose.model('Customer');


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
router.use('/customers', isAuthenticated);
        
//api for all posts
router.route('/customers')

//create a new post
    .post(function (req, res) {
         console.log(req.body.created);
         if(req.body.custId===null)
         {
             req.body.custId="CUST" + (Date.now).toString();
         }
        var customer = new Customer(req.body);
        customer.save(function (err, customer) {
            if (err) {
                return res.send(500, err);
            }
            return res.json(customer);
        })
    })
    .get(function (req, res) {
        Customer.find(function (err, customers) {
            if (err) {
                return res.send(500, err);
            }
            return res.send(customers);
        });
    })

//api for a specfic post
router.route('/customer/:id')

//create
    .put(function (req, res) {
        Customer.findById(req.params.id, function (err, customer) {
            if (err)
                res.send(err);
            customer.name = req.body.name;
            customer.contact = req.body.contact;
            customer.connectedfrom = req.body.connectedfrom;
            customer.address = req.body.address;
            customer.save(function (err, customer) {
                if (err)
                    res.send(err);
                res.json(customer);
            });
        });
    })
    .get(function (req, res) {
        Customer.findById(req.params.id, function (err, customer) {
            if (err)
                res.send(err);
            res.json(customer);
        });
    })
    .delete(function (req, res) {
        Customer.remove({
            _id: req.params.id
        }, function (err) {
            if (err)
                res.send(err);
            res.json("deleted :(");
        });
    });

module.exports = router;