var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var Profitrevenue = mongoose.model('ProfitRevenue')
var SystemVariables = mongoose.model('SytemVariable');
module.exports = {
    updateProfitRevenue: function updateProfitRevenue() {
        SystemVariables.findOne(function (err, systemvariable) {
            //if there is no systemvariable set it will calculate profit on all the account data
            if (systemvariable === null) {
                var sysvariable = new SystemVariables({ 'RevenueLastCalculated': new Date() })
                sysvariable.save(function (err, data) { });
                Account.find(function (err, accounts) {
                    if (err) {
                        console.log(err)
                    }
                    else {

                        UpdateRevenueDb(accounts, accounts.length - 1);
                    }
                })
            }
            else {
                //if there is a lastRevenuCalculatedDate then the system will do the calculation on accounts data which is new
                var lastRevenuCalculatedDate = systemvariable.RevenueLastCalculated
                systemvariable.RevenueLastCalculated = new Date();
                systemvariable.save(function (err, data) { });
                Account.find({ 'created': { '$gt': lastRevenuCalculatedDate, '$lte': new Date() } }, function (err, accounts) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        UpdateRevenueDb(accounts, accounts.length - 1);
                    }
                })
            }
        })


    }
}
//Update revenu and profit data and store in database based on months and year
function UpdateRevenueDb(accounts, count) {
    if (accounts.length > 0) {
        var createdate = new Date(accounts[count].created);
        var totalprofit = 0;
        accounts[count].products.forEach(function (product) {
            totalprofit += (product.sellingprice - product.costprice) * product.units;
        }, this);
        //if there is no data strore for the accounts month and year then it will create a new record
        Profitrevenue.findOne({ 'year': createdate.getFullYear(), 'month': createdate.getMonth() }, function (err, profitrevenue) {
            if (err) {
                console.log(err);
            }
            else {
                if (profitrevenue === null) {
                    var tempProfitandRevenue = new Profitrevenue({
                        year: createdate.getFullYear(),
                        month: createdate.getMonth(),
                        revenue: accounts[count].billedamount,
                        profit: totalprofit
                    });
                    tempProfitandRevenue.save(function (err, data) {
                        if (err)
                            console.log(err);
                        else {
                            if (count === 0) {
                                console.log("Revenue and Profit Updated")
                            }
                            else {
                                count--;
                                UpdateRevenueDb(accounts, count);
                            }
                        }
                    })

                }
                //if there is a record for the current accounts created year and month then it will update the existing one 
                else {
                    profitrevenue.revenue += accounts[count].billedamount;
                    profitrevenue.profit += totalprofit;
                    profitrevenue.save(function (err, data) {
                        if (err)
                            console.log(err);
                        else {
                            if (count === 0) {
                                console.log("Revenue and Profit Updated")
                            }
                            else {
                                count--;
                                UpdateRevenueDb(accounts, count);
                            }
                        }
                    })
                }
            }
        })
    }
}


