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
    required: false 
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['credit', 'debit', 'transfer','income'], 
    required: true,
  },
  category: {
    type: String,
    required: true,
    default: function() {
        return this.type === 'income' ? 'income' : undefined;
    }
},

date: {
    type: Date,
    default: Date.now
}
});

module.exports = mongoose.model('Transaction', transactionSchema);