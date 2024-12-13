// routes/splitBillRoutes.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { validateSplitBillParticipants } = require('../middleware/splitBillValidation');

// Create new split bill
router.post('/create', validateSplitBillParticipants, async (req, res) => {
    try {
        const { userId, participants, totalAmount, category, description } = req.body;
        console.log('Starting split bill creation with:', { userId, participants, totalAmount, category });

        // Find creator
        const creator = await User.findById(userId);
        if (!creator) {
            return res.status(404).json({ message: 'Creator not found' });
        }
        console.log('Found creator:', creator.username);

        // Calculate split amount
        const splitAmount = totalAmount / (participants.length + 1);
        console.log('Split amount calculated:', splitAmount);

        // First deduct creator's share
        const creatorNewBalance = creator.balance - splitAmount;
        if (creatorNewBalance < 0) {
            return res.status(400).json({ message: 'Creator has insufficient funds' });
        }

        // Update creator's balance
        await User.findByIdAndUpdate(userId, { balance: creatorNewBalance });
        console.log('Updated creator balance to:', creatorNewBalance);

        // Process participants
        const participantResults = [];
        for (const participantUsername of participants) {
            // Find participant
            const participant = await User.findOne({ username: participantUsername });
            if (!participant) {
                continue;
            }
            console.log('Processing participant:', participant.username);

            // Check participant's balance
            if (participant.balance < splitAmount) {
                console.log('Insufficient funds for participant:', participant.username);
                continue;
            }

            // Update participant's balance
            const newBalance = participant.balance - splitAmount;
            await User.findByIdAndUpdate(participant._id, { balance: newBalance });
            console.log('Updated participant balance to:', newBalance);

            // Create transaction record
            const transaction = new Transaction({
                user: participant._id,
                recipient: userId,
                amount: splitAmount,
                type: 'transfer',
                category,
                description: `Split bill for ${description || category}`
            });
            await transaction.save();

            participantResults.push({
                username: participant.username,
                amount: splitAmount,
                transactionId: transaction._id
            });
        }

        // Create transaction record for creator
        const creatorTransaction = new Transaction({
            user: userId,
            amount: splitAmount,
            type: 'debit',
            category,
            description: `Your share of split bill for ${description || category}`
        });
        await creatorTransaction.save();

        res.status(201).json({
            message: 'Split bill processed successfully',
            creatorShare: {
                username: creator.username,
                amount: splitAmount,
                newBalance: creatorNewBalance
            },
            participantResults,
            totalAmount,
            splitAmount
        });

    } catch (error) {
        console.error('Split bill error:', error);
        res.status(500).json({ message: 'Error processing split bill', error: error.message });
    }
});

module.exports = router;