var mongoose = require('mongoose');

var ProfitRevenueSchema = new mongoose.Schema({
    revenue:{type:Number},
    profit:{type:Number},
    month:{type:String},
    year:{type:Number}
});


mongoose.model('ProfitRevenue', ProfitRevenueSchema);