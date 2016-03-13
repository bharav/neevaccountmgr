var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var schedule = require('node-schedule');

require('./models/account');
require('./models/customer');
require('./models/dealer');
require('./models/user');
require('./models/profitrevenue');
require('./models/systemvariables');
var timer = require('./timerlogic/revenueprofit');
var timer2 = require('./timerlogic/paymentdue');
var index = require('./routes/index')
var account = require('./routes/account');
var dealer = require('./routes/dealer');
var customer = require('./routes/customer');
var revenue = require('./routes/revenueprofit');
var authenticate = require('./routes/authenticate')(passport);
var mongoose = require('mongoose');                         //add for Mongo support
mongoose.connect('mongodb://localhost:27017/neevaccountdb');              //connect to Mongo
//mongoose.connect('mongodb://neevsysmgr:mongo2016@ds064188.mlab.com:64188/neevaccountdb');              //connect to Mongo
var app = express();
var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
//rule.hour = 23;
rule.minute = 45;
//rule.second = 10;

var j = schedule.scheduleJob(rule, function() {
    console.log('Testing Cron Job!');
    timer2.ResetDueForCustomer();
    timer2.ResetDuetoDealer();
    timer.initiatlizeRevenueDB();
    setTimeout(function() {

        timer.updateProfitRevenue();
        timer2.PaymentDuetoMe();
        timer2.PaymentDuetoDealer();
    }, 10000);



});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({
    secret: 'keyboard cat'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', index);
app.use('/auth', authenticate);
app.use('/api', account);
app.use('/api', customer);
app.use('/api', dealer);
app.use('/api', revenue);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//// Initialize Passport
var initPassport = require('./passport-init');
initPassport(passport);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
