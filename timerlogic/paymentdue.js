var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var Customer = mongoose.model('Customer')
var Dealer = mongoose.model('Dealer')
var SystemVariables = mongoose.model('SytemVariable');
module.exports = {
    ResetDueForCustomer: function ResetDueForCustomer() {
        Customer.find(function(err, customers) {
            if (err)
                console.log(err);
            else {
                customers.forEach(function(customer) {
                    customer.paymentdue = 0;
                    customer.save(function(err, customer) {
                        if (err)
                            console.log('Error in updating customer' + err);
                    })
                }, this);
            }
        })
    },
    ResetDuetoDealer: function ResetDuetoDealer() {
        Dealer.find(function(err, dealers) {
            if (err)
                console.log(err);
            else {
                dealers.forEach(function(dealer) {
                    dealer.paymentdue = 0;
                    dealer.save(function(err, dealer) {
                        if (err)
                            console.log("Error in updating dealer " + err);
                    })
                }, this);
            }
        })
    },
    PaymentDuetoMe: function paymentDuetoMe() {
        Account.find({ paymentstatus: 'Due' }, function(err, accounts) {
            if (err) {
                console.log(err)
            }
            else {

                UpdateCustomerDue(accounts, accounts.length - 1);
            }
        });
    },
    PaymentDuetoDealer: function PaymentDuetoDealer() {
        Account.find(function(err, accounts) {
            if (err) {
                console.log(err)
            }
            else {

                UpdateDealerDues(accounts, accounts.length - 1);
            }
        });
    }

}

function UpdateCustomerDue(accounts, count) {
    if (accounts.length != 0) {
        var clientId = accounts[count].customer[0].custId;
        var contactNo = accounts[count].customer[0].contact;
        Customer.find({ $or: [{ 'custId': clientId }, { 'contact': contactNo }] }, function(err, customers) {
            if (customers.length > 0 && customers.length == 1) {
                customers[0].paymentdue += accounts[count].billedamount;
                customers[0].save(function(err, customer) {
                    if (err)
                        console.log("Error in updating customer");
                    else {
                        if (count > 0) {
                            UpdateCustomerDue(accounts, count - 1);
                        }
                    }
                })
            }
        })

    }

}


function UpdateDealerDues(accounts, count) {
    if (accounts.length > 0) {
        if (count >= 0) {
            // call dealer update function seperately as it can have more than one product for same dealer as well and it will caue issue in async update
            UpdateDealerDueProductWise(accounts[count].products, accounts[count].products.length - 1)
            if (count > 0)
                UpdateDealerDues(accounts, count - 1);//recursively call the same function till the count is not 0
        }
    }
}

function UpdateDealerDueProductWise(products, count) {
    if (products.length > 0) {
        Dealer.findOne({ 'contact': products[count].dealercontact }, function(err, dealer) {
            if (err) {

            }
            else {
                //check if the dealer payement for a particular product is due 
                if (products[count].purchasepaymentdone === 'Due') {
                    dealer.paymentdue += (products[count].costprice * products[count].units);
                    dealer.save(function(err, dealer) {
                        if (err)
                            console.log("error in updating dealer");
                        else {
                            if (count > 0) {
                                //Call the function recusively as its async with count -1
                                UpdateDealerDueProductWise(products, count - 1);
                            }
                        }
                    })
                }
                else {
                    if (count > 0) {
                        //Call the function recusively as its async with count -1
                        UpdateDealerDueProductWise(products, count - 1);
                    }
                }
            }
        })
    }
}