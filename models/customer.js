var mongoose = require('mongoose');

var customerSchema = new mongoose.Schema({
    custId:{type:String},
    name:{type:String},
    contact:{type:Number},
    connectedfrom:{type:String},
    address:{type:String}
});


mongoose.model('Customer', customerSchema);
