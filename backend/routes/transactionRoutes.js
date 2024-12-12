const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');

router.post('/addTransaction', async (req, res) => {
    const { userId, amount, type, recipientUsername, category, description, incomeSource } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let newTransaction;

        if (type === 'transfer') {
            if (!recipientUsername) {
                return res.status(400).json({ message: 'Recipient Username is required for transfer' });
            }

            const recipient = await User.findOne({ username: recipientUsername });
            if (!recipient) {
                return res.status(404).json({ message: 'Recipient not found' });
            }

            newTransaction = new Transaction({ 
                user: userId, 
                recipient: recipient._id, 
                amount, 
                type, 
                category, 
                description 
            });
            await newTransaction.save();

            // For transfer, subtract from sender and add to recipient
            user.balance -= amount;
            recipient.balance += amount;
            await user.save();
            await recipient.save();
        } else if (type === 'debit') {
            newTransaction = new Transaction({ 
                user: userId, 
                amount, 
                type, 
                category, 
                description 
            });
            await newTransaction.save();

            user.balance -= amount;
            await user.save();
        } else {  // Income transaction
            newTransaction = new Transaction({ 
                user: userId, 
                amount, 
                type: 'income',
                category: 'income',
                description: incomeSource,
                incomeSource
            });
            await newTransaction.save();

            user.balance += amount;
            await user.save();
        }

        const updatedUser = await User.findById(userId).lean();
        const transactions = await Transaction.find({ user: userId })
            .sort({ date: -1 })
            .lean();

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
                description: txn.description || '',
                incomeSource: txn.incomeSource || '',
                user: txn.user.toString(),
                recipient: txn.recipient ? txn.recipient.toString() : null
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing transaction', error });
    }
});

module.exports = router;