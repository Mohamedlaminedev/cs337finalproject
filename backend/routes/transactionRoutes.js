const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Add a new transaction
router.post('/addTransaction', async (req, res) => {
    const { userId, amount, type, recipientUsername, category } = req.body;

    try {
        // Validate user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let newTransaction;

        // Handle Transfer Transactions
        if (type === 'transfer') {
            if (!recipientUsername) {
                return res.status(400).json({ message: 'Recipient username is required for transfer.' });
            }

            const recipient = await User.findOne({ username: recipientUsername });
            if (!recipient) {
                return res.status(404).json({ message: 'Recipient not found.' });
            }

            // Check if recipient is the same as the sender
            if (recipient._id.toString() === userId.toString()) {
                return res.status(400).json({ message: 'You cannot transfer money to yourself.' });
            }

            if (amount > user.balance) {
                return res.status(400).json({ message: 'Insufficient funds for transfer.' });
            }

            newTransaction = new Transaction({
                user: userId,
                recipient: recipient._id,
                amount,
                type: 'transfer',
                category: category || 'other',
            });
            await newTransaction.save();

            // Update balances
            user.balance -= amount;
            recipient.balance += amount;
            await user.save();
            await recipient.save();
        }

        // Handle Expense (Debit) Transactions
        else if (type === 'debit') {
            if (amount > user.balance) {
                return res.status(400).json({ message: 'Insufficient funds for expense.' });
            }

            newTransaction = new Transaction({
                user: userId,
                amount,
                type: 'debit',
                category: category || 'expense',
            });
            await newTransaction.save();

            // Deduct balance
            user.balance -= amount;
            await user.save();
        }

        // Handle Income Transactions
        else if (type === 'income') {
            newTransaction = new Transaction({
                user: userId,
                amount,
                type: 'income',
                category: 'income',
            });
            await newTransaction.save();

            // Add to balance
            user.balance += amount;
            await user.save();
        }

        // Invalid transaction type
        else {
            return res.status(400).json({ message: 'Invalid transaction type.' });
        }

        // Fetch updated user data and transactions
        const updatedUser = await User.findById(userId).lean();
        const transactions = await Transaction.find({ user: userId })
            .sort({ date: -1 })
            .lean();

        // Response
        res.status(201).json({
            username: updatedUser.username,
            budget: updatedUser.budget,
            balance: updatedUser.balance,
            transactions: transactions.map(txn => ({
                id: txn._id,
                type: txn.type,
                category: txn.category,
                amount: txn.amount,
                date: txn.date,
                user: txn.user.toString(),
                recipient: txn.recipient ? txn.recipient.toString() : null,
            })),
        });
    } catch (error) {
        console.error('Error processing transaction:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

module.exports = router;
