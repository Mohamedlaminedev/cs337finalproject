// routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction'); // Import the Transaction model

const router = express.Router();

// Signup user route
router.post('/signup', async (req, res) => {
    const { username, initialBalance } = req.body;
    console.log('Request Body:', req.body); // Log incoming data
    try {
        const existingUser = await User.findOne({ username });
        console.log('Existing User:', existingUser); // Log result of query
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create a new user with budget and balance
        const newUser = new User({
            username,
            budget: initialBalance,
            balance: initialBalance
        });

        await newUser.save();

        res.status(201).json({
            name: newUser.username,
            budget: newUser.budget,
            balance: newUser.balance,
            transactions: [] // Empty transactions for a new user
        });

    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Get user by username (including balance, budget, and transaction history)
router.post('/login', async (req, res) => {
    const { username } = req.body;
    try {
        // Find the user by their unique username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch all transactions where the user is either the sender or recipient
        const transactions = await Transaction.find({
            $or: [{ user: user._id }, { recipient: user._id }]
        }).populate('user recipient', 'username'); // Populate user and recipient names

        // Return user details along with their transaction history
        res.status(200).json({
            name: user.username,
            balance: user.balance,
            budget: user.budget,
            transactions: transactions.map(txn => ({
                id: txn._id,
                type: txn.type,
                category: txn.category || null,
                amount: txn.amount,
                date: txn.date,
                description: txn.description || '',
                user: txn.user ? txn.user.username : null,
                recipient: txn.recipient ? txn.recipient.username : null,
            })),
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user data', error });
    }
});

module.exports = router;
