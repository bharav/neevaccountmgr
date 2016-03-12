var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
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
router.use('/dealers', isAuthenticated);
router.use('/dealertobepaid', isAuthenticated);
//api for all posts
router.route('/dealers')

//create a new post
    .post(function (req, res) {
         console.log(req.body.created);
         if(req.body.dealerId===null)
         {
             req.body.dealerId="DEALER" + (Date.now).toString();
         }
        var dealer = new Dealer(req.body);
        dealer.save(function (err, dealer) {
            if (err) {
                return res.send(500, err);
            }
            return res.json(dealer);
        })
    })
    .get(function (req, res) {
        Dealer.find(function (err, dealers) {
            if (err) {
                return res.send(500, err);
            }
            return res.send(dealers);
        });
    })

//api for a specfic post
router.route('/dealer/:id')

//create
    .put(function (req, res) {
        Dealer.findById(req.params.id, function (err, dealer) {
            if (err)
                res.send(err);
            dealer.name = req.body.name;
            dealer.contact = req.body.contact;
            dealer.connectedfrom = req.body.connectedfrom;
            dealer.address = req.body.address;
            dealer.save(function (err, dealer) {
                if (err)
                    res.send(err);
                res.json(dealer);
            });
        });
    })
    .get(function (req, res) {
        Dealer.findById(req.params.id, function (err, dealer) {
            if (err)
                res.send(err);
            res.json(dealer);
        });
    })
    .delete(function (req, res) {
        Dealer.remove({
            _id: req.params.id
        }, function (err) {
            if (err)
                res.send(err);
            res.json("deleted :(");
        });
    });
router.route('/dealertobepaid')
   .get(function(req,res){
       Dealer.find({'paymentdue':{$gt:0}},function(err,dealers){
             if (err)
                res.send(err);
            res.json(dealers);
       })
   })
module.exports = router;