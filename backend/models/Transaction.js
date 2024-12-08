// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model who initiates the transaction
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the recipient user for transfers (optional)
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['credit', 'debit', 'transfer'], // Includes 'transfer' for peer-to-peer payments
    required: true,
  },
  category: {
    type: String,
    enum: ['food', 'rent', 'entertainment', 'utilities', 'others'], // Predefined categories for expenses
    required: function () {
      return this.type === 'debit'; // Category is required only if it's an expense (debit)
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
