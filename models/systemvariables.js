var mongoose = require('mongoose');

var SytemVariableSchema = new mongoose.Schema({
   RevenueLastCalculated:{type:Date}
});


mongoose.model('SytemVariable', SytemVariableSchema);