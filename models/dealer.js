var mongoose = require('mongoose');

var dealerSchema = new mongoose.Schema({
    dealerId:{type:String},
    name:{type:String},
    contact:{type:Number},
    connectedfrom:{type:String},
    address:{type:String},
    paymentdue:{type:Number}
});


mongoose.model('Dealer', dealerSchema);
