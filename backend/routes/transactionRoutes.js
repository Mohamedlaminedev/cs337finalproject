// routes/transactionRoutes.js
const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

const router = express.Router();

// Create a new transaction (transfer, expense, or credit income)
router.post('/addTransaction', async (req, res) => {
    const { userId, amount, type, recipientUsername, category, description } = req.body;

    try {
        // Find the user initiating the transaction
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let newTransaction;

        if (type === 'transfer') {
            // Handle transfer to another user
            if (!recipientUsername) {
                return res.status(400).json({ message: 'Recipient Username is required for transfer' });
            }

            // Find the recipient
            const recipient = await User.findOne({ username: recipientUsername });
            if (!recipient) {
                return res.status(404).json({ message: 'Recipient not found' });
            }

            // Create the transfer transaction
            newTransaction = new Transaction({ user: userId, recipient: recipient._id, amount, type, category, description });
            await newTransaction.save();

            // Update balances for both users
            user.balance -= amount;
            recipient.balance += amount;
            await user.save();
            await recipient.save();
        } else if (type === 'debit') {
            // Handle general expense
            newTransaction = new Transaction({ user: userId, amount, type, category, description });
            await newTransaction.save();

            // Update user's balance
            user.balance -= amount;
            await user.save();
        } else if (type === 'credit') {
            // Handle income (adding money to user)
            newTransaction = new Transaction({ user: userId, amount, type, category, description });
            await newTransaction.save();

            // Update user's balance
            user.balance += amount;
            await user.save();
        }

        const updatedUser = await User.findById(userId).lean();
        const transactions = await Transaction.find({ user: userId }).lean();

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
                user: txn.user.toString(),
                recipient: txn.recipient ? txn.recipient.toString() : null
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing transaction', error });
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        // Fetch the top 3 users sorted by budget in descending order
        const topUsers = await User.find()
            .sort({ budget: -1 }) // Sort by 'budget' descending
            .limit(3) // Limit to top 3 users
            .select('username budget -_id'); // Select only 'username' and 'budget', exclude '_id'

        return res.status(200).json(topUsers);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// Route to get the top 5 most recent transactions
router.get('/recent', async (req, res) => {
    try {
        // Find the 5 most recent transactions sorted by date descending
        const recentTransactions = await Transaction.find()
            .sort({ date: -1 }) // Sort by 'date' in descending order (most recent first)
            .limit(5) // Limit to 5 transactions
            .populate('user recipient', 'username') // Populate user and recipient names
            .lean(); // Convert result to plain JS objects for performance

        // Format the response to include relevant fields
        const formattedTransactions = recentTransactions.map(txn => ({
            id: txn._id,
            type: txn.type,
            category: txn.category,
            amount: txn.amount,
            date: txn.date,
            description: txn.description || '',
            user: txn.user ? txn.user.username : null,
            recipient: txn.recipient ? txn.recipient.username : null
        }));

        res.status(200).json(formattedTransactions);
    } catch (error) {
        console.error('Error fetching recent transactions:', error);
        res.status(500).json({ message: 'Internal server error.', error });
    }
});


// Get all transactions for a specific user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // Find all transactions where the user is either the sender or recipient
        const transactions = await Transaction.find({
            $or: [{ user: userId }, { recipient: userId }]
        }).populate('user recipient', 'username'); // Populate user and recipient names

        // Format transactions into the expected response structure
        const formattedTransactions = transactions.map(txn => ({
            id: txn._id,
            type: txn.type,
            category: txn.category,
            amount: txn.amount,
            date: txn.date,
            description: txn.description || '', // Default to an empty string if description is missing
            user: txn.user ? txn.user.username : null, // Initiator's username
            recipient: txn.recipient ? txn.recipient.username : null // Recipient's username (if any)
        }));

        res.status(200).json(formattedTransactions);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving transactions', error });
    }
});

module.exports = router;
