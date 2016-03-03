var mongoose = require('mongoose');

var customerSchema = new mongoose.Schema({
    name: { type: String },
    contact: { type: Number },
    connectedfrom: { type: String },
    address: { type: String }
});
var productSchema = new mongoose.Schema({
    name: { type: String },
    dealer: { type: String },
    dealercontact: { type: Number },
    costprice: { type: Number },
    sellingprice: { type: Number },
    units: { type: Number },
    purchasepaymentdone: { type: String, default: "Due" },
    purchasepaymentamount: { type: Number },
    purchasepaymentcomment: { type: String }
});
var accountSchema = new mongoose.Schema({
    customer: [customerSchema],
    products: [productSchema],
    billedamount: { type: Number, required: true, default: 0 },
    paymentstatus: { type: String, default: "Due" },
    paymentcomment: { type: String },
    shipmentstatus: { type: String, default: 'Not Started' },
    shipmentcomment: { type: String },
    created: { type: Date, required: true, default: Date.now },
    status: { type: String },
    resellername: { type: String },
    resellercomission: { type: Number }
});

mongoose.model('Account', accountSchema);

