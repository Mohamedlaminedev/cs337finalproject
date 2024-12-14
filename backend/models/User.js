const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    balance: {
        type: Number,
        default: 0
    },
    budget: {
        type: Number,
        default: 0
    },
    savingsGoal: {
        type: Number,
        default: 0
    },
    currentSavings: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// function to update savings goal
userSchema.methods.updateSavingsGoal = async function(newGoal) {
    this.savingsGoal = newGoal;
    return this.save();
};

// function to add savings from balance
userSchema.methods.addToSavings = async function(amount) {
    if (amount <= 0) {
        throw new Error('Amount must be positive');
    }
    if (amount > this.balance) {
        throw new Error('Insufficient balance for savings');
    }

    this.balance -= amount;
    this.currentSavings += amount;
    return this.save();
};

// function to withdraw from savings to balance
userSchema.methods.withdrawFromSavings = async function(amount) {
    if (amount <= 0) {
        throw new Error('Amount must be positive');
    }
    if (amount > this.currentSavings) {
        throw new Error('Insufficient savings amount');
    }

    this.currentSavings -= amount;
    this.balance += amount;
    return this.save();
};

// normal transfer info.
userSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret) {
        ret._id = ret._id.toString();
        return ret;
    }
});

module.exports = mongoose.model('User', userSchema);
