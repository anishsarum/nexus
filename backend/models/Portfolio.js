const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['buy', 'sell'], required: true },
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const PortfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cash: { type: Number, default: 100000 },
  holdings: [{
    symbol: String,
    quantity: Number,
    avgPrice: Number
  }],
  transactions: [TransactionSchema]
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
