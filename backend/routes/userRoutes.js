// routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const Transaction = require('../models/Transaction');



// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { username, initialBalance } = req.body;
        console.log('Signup request:', { username, initialBalance });

        // Check for existing user
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create new user
        const user = new User({
            username: username,  // Make sure this matches the schema
            budget: Number(initialBalance),
            balance: Number(initialBalance)
        });

        await user.save();

        // Send response with correct field names
        res.status(201).json({
            _id: user._id.toString(),
            username: user.username,
            budget: user.budget,
            balance: user.balance,
            transactions: []
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});



router.post('/login', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        
        // Fetch the most recent transactions for this user
        const recentTransactions = await Transaction.find({ user: user._id })
            .sort({ date: -1 })  // Most recent first
            .limit(3)  // Get last 3 transactions
            .select('amount type category date description')
            .lean();

        res.status(200).json({
            _id: user._id,
            username: user.username,
            budget: user.budget,
            balance: user.balance,
            transactions: recentTransactions  // Include transactions in login response
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        // Fetch top 5 users sorted by balance in descending order
        const topUsers = await User.find()
            .sort({ balance: -1 })
            .limit(5)
            .select('username balance');
        res.json(topUsers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaderboard', error });
    }
});


module.exports = router;