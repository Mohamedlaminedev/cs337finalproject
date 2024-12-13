// routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const Transaction = require('../models/Transaction');



// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { username, initialBalance, savingsGoal = 0 } = req.body;
        console.log('Signup request:', { username, initialBalance, savingsGoal });

        // Check existing user
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // make new user
        const user = new User({
            username: username,
            budget: Number(initialBalance),
            balance: Number(initialBalance),
            savingsGoal: Number(savingsGoal),
            currentSavings: 0
        });

        await user.save();

        // Send response and make sure correct field names
        res.status(201).json({
            _id: user._id.toString(),
            username: user.username,
            budget: user.budget,
            balance: user.balance,
            savingsGoal: user.savingsGoal,
            currentSavings: user.currentSavings,
            transactions: []
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});


// Update savings goal
router.post('/savings/goal', async (req, res) => {
    try {
        const { userId, newGoal } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.updateSavingsGoal(Number(newGoal));

        res.json({
            username: user.username,
            savingsGoal: user.savingsGoal,
            currentSavings: user.currentSavings,
            balance: user.balance
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add to savings from balance
router.post('/savings/add', async (req, res) => {
    try {
        const { userId, amount } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.addToSavings(Number(amount));

        // generate a transaction record for savings
        const transaction = new Transaction({
            user: userId,
            amount: Number(amount),
            type: 'debit',
            category: 'savings',
            description: 'Transfer to savings'
        });
        await transaction.save();

        res.json({
            username: user.username,
            savingsGoal: user.savingsGoal,
            currentSavings: user.currentSavings,
            balance: user.balance,
            transaction: transaction
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Withdraw from savings to balance
router.post('/savings/withdraw', async (req, res) => {
    try {
        const { userId, amount } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.withdrawFromSavings(Number(amount));

        // make a transaction record for withdrawal from savings
        const transaction = new Transaction({
            user: userId,
            amount: Number(amount),
            type: 'credit',
            category: 'savings',
            description: 'Withdrawal from savings'
        });
        await transaction.save();

        res.json({
            username: user.username,
            savingsGoal: user.savingsGoal,
            currentSavings: user.currentSavings,
            balance: user.balance,
            transaction: transaction
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });

        const recentTransactions = await Transaction.find({
            $or: [
                { user: user._id },       // Transactions where the user is the sender
                { recipient: user._id }   // Transactions where the user is the recipient
            ]
        })
            .sort({ date: -1 })  // Most recent first
            .limit(3)            // Get last 3 transactions
            .select('amount type category date recipient user') // Select fields to display
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